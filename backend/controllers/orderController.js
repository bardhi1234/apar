const pool = require("../db/db");

const SHIPPING = {
  "Kosovë": 2.5,
  "Shqipëri": 5,
  "Maqedoni e Veriut": 5,
};

function makeOrderNumber() {
  return `APAR-${Date.now().toString(36).toUpperCase()}`;
}

async function createOrder(req, res) {
  const client = await pool.connect();

  try {
    const {
      firstName,
      lastName,
      phone,
      country = "Kosovë",
      city,
      address,
      note = "",
      items,
    } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !address?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Plotëso të gjitha të dhënat e klientit.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Shporta është bosh.",
      });
    }

    if (!(country in SHIPPING)) {
      return res.status(400).json({
        success: false,
        message: "Shteti nuk është valid.",
      });
    }

    await client.query("BEGIN");

    let subtotal = 0;
    const preparedItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Math.max(
        1,
        Number(item.quantity) || 1
      );

      if (!productId) {
        throw new Error("Produkti nuk është valid.");
      }

      const result = await client.query(
        `
        SELECT
          p.id,
          p.name,
          p.price,
          p.stock,
          p.active,
          (
            SELECT pi.url
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY pi.sort_order ASC, pi.id ASC
            LIMIT 1
          ) AS image
        FROM products p
        WHERE p.id = $1
        FOR UPDATE
        `,
        [productId]
      );

      if (result.rows.length === 0) {
        throw new Error(
          `Produkti me ID ${productId} nuk ekziston.`
        );
      }

      const product = result.rows[0];

      if (!product.active) {
        throw new Error(
          `${product.name} nuk është aktiv.`
        );
      }

      if (Number(product.stock) < quantity) {
        throw new Error(
          `Nuk ka stok të mjaftueshëm për ${product.name}.`
        );
      }

      const price = Number(product.price);

      subtotal += price * quantity;

      preparedItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price,
        quantity,
        size: item.size || null,
        color: item.color || null,
      });
    }

    const shipping = SHIPPING[country];
    const total = subtotal + shipping;
    const orderNumber = makeOrderNumber();

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        order_number,
        first_name,
        last_name,
        phone,
        country,
        city,
        address,
        note,
        subtotal,
        shipping,
        total,
        payment_method,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,'COD','pending'
      )
      RETURNING *
      `,
      [
        orderNumber,
        firstName.trim(),
        lastName.trim(),
        phone.trim(),
        country,
        city.trim(),
        address.trim(),
        note.trim(),
        subtotal,
        shipping,
        total,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of preparedItems) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          product_image,
          price,
          quantity,
          size,
          color
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
        [
          order.id,
          item.productId,
          item.name,
          item.image,
          item.price,
          item.quantity,
          item.size,
          item.color,
        ]
      );

      await client.query(
        `
        UPDATE products
        SET
          stock = stock - $1,
          updated_at = NOW()
        WHERE id = $2
        `,
        [
          item.quantity,
          item.productId,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Porosia u krijua me sukses.",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        total: Number(order.total),
        status: order.status,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Porosia nuk u krijua.",
    });
  } finally {
    client.release();
  }
}

async function getOrders(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi.product_id,
              'name', oi.product_name,
              'image', oi.product_image,
              'price', oi.price,
              'quantity', oi.quantity,
              'size', oi.size,
              'color', oi.color
            )
          ) FILTER (
            WHERE oi.id IS NOT NULL
          ),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi
        ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Porositë nuk u morën.",
    });
  }
}

async function updateOrderStatus(req, res) {
  const client = await pool.connect();

  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowed = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Statusi nuk është valid.",
      });
    }

    await client.query("BEGIN");

    const currentResult =
      await client.query(
        `
        SELECT *
        FROM orders
        WHERE id = $1
        FOR UPDATE
        `,
        [id]
      );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message:
          "Porosia nuk u gjet.",
      });
    }

    const currentStatus =
      currentResult.rows[0].status;

    if (
      status === "cancelled" &&
      currentStatus !== "cancelled"
    ) {
      const items =
        await client.query(
          `
          SELECT product_id, quantity
          FROM order_items
          WHERE order_id = $1
          AND product_id IS NOT NULL
          `,
          [id]
        );

      for (const item of items.rows) {
        await client.query(
          `
          UPDATE products
          SET
            stock = stock + $1,
            updated_at = NOW()
          WHERE id = $2
          `,
          [
            item.quantity,
            item.product_id,
          ]
        );
      }
    }

    const result =
      await client.query(
        `
        UPDATE orders
        SET
          status = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
      );

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        "Statusi u ndryshua.",
      order: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Statusi nuk u ndryshua.",
    });
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};