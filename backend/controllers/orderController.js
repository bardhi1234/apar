
const pool = require("../db/db");
const { randomBytes } = require("crypto");

// ======================================
// PROTEINFITNESS - ORDER CONTROLLER
// ======================================

const SHIPPING = Object.freeze({
  "Kosovë": 2.5,
  "Shqipëri": 5,
  "Maqedoni e Veriut": 5,
});

const ALLOWED_STATUSES = new Set([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

// ======================================
// HELPERS
// ======================================

function requestError(message, status = 400) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function requiredText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw requestError(`${field} është e detyrueshme.`);
  }

  const text = value.trim();

  if (text.length > maxLength) {
    throw requestError(`${field} është shumë e gjatë.`);
  }

  return text;
}

function optionalText(value, field, maxLength) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  if (typeof value !== "string") {
    throw requestError(`${field} nuk është valide.`);
  }

  const text = value.trim();

  if (text.length > maxLength) {
    throw requestError(`${field} është shumë e gjatë.`);
  }

  return text;
}

function toCents(value) {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error(
      "Çmimi i produktit në databazë nuk është valid."
    );
  }

  return Math.round(
    (price + Number.EPSILON) * 100
  );
}

function fromCents(cents) {
  return Number((cents / 100).toFixed(2));
}

function makeOrderNumber() {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `PF-${timestamp}-${random}`;
}

async function safeRollback(client) {
  if (!client) return;

  try {
    await client.query("ROLLBACK");
  } catch (error) {
    console.error("ROLLBACK ERROR:", error);
  }
}

// ======================================
// CREATE ORDER
// POST /api/orders
// ======================================

async function createOrder(req, res) {
  let client;
  let inTransaction = false;

  try {
    const body = req.body || {};

    const firstName = requiredText(
      body.firstName,
      "Emri",
      100
    );

    const lastName = requiredText(
      body.lastName,
      "Mbiemri",
      100
    );

    const phone = requiredText(
      body.phone,
      "Telefoni",
      40
    );

    const city = requiredText(
      body.city,
      "Qyteti",
      120
    );

    const address = requiredText(
      body.address,
      "Adresa",
      250
    );

    const note = optionalText(
      body.note,
      "Shënimi",
      1000
    );

    const country =
      body.country ?? "Kosovë";

    const items = body.items;

    // VALIDATE SHIPPING COUNTRY
    if (
      !Object.prototype.hasOwnProperty.call(
        SHIPPING,
        country
      )
    ) {
      throw requestError(
        "Shteti nuk është valid."
      );
    }

    // VALIDATE CART
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw requestError(
        "Shporta është bosh."
      );
    }

    if (items.length > 100) {
      throw requestError(
        "Shporta ka shumë produkte."
      );
    }

    // VALIDATE EACH ITEM
    const validatedItems = items.map((item) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        throw requestError(
          "Një produkt në shportë nuk është valid."
        );
      }

      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        throw requestError(
          "ID e produktit nuk është valide."
        );
      }

      if (
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        throw requestError(
          "Sasia duhet të jetë numër i plotë pozitiv."
        );
      }

      return {
        productId,
        quantity,

        // Compatibility with existing cart
        size:
          optionalText(
            item.size,
            "Pesha/Paketimi",
            100
          ) || null,

        color:
          optionalText(
            item.color,
            "Shija/Varianti",
            100
          ) || null,
      };
    });

    // ==================================
    // START DATABASE TRANSACTION
    // ==================================

    client = await pool.connect();

    await client.query("BEGIN");
    inTransaction = true;

    let subtotalCents = 0;

    const preparedItems = [];

    // ==================================
    // VERIFY PRODUCTS AND STOCK
    // ==================================

    for (const item of validatedItems) {
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
            ORDER BY
              pi.sort_order ASC,
              pi.id ASC
            LIMIT 1
          ) AS image
        FROM products p
        WHERE p.id = $1
        FOR UPDATE OF p
        `,
        [item.productId]
      );

      if (result.rows.length === 0) {
        throw requestError(
          `Produkti me ID ${item.productId} nuk ekziston.`,
          404
        );
      }

      const product = result.rows[0];

      if (!product.active) {
        throw requestError(
          `${product.name} nuk është aktiv.`,
          409
        );
      }

      if (
        Number(product.stock) <
        item.quantity
      ) {
        throw requestError(
          `Nuk ka stok të mjaftueshëm për ${product.name}.`,
          409
        );
      }

      // PRICE FROM DATABASE
      const priceCents = toCents(
        product.price
      );

      subtotalCents +=
        priceCents * item.quantity;

      // UPDATE STOCK INSIDE TRANSACTION
      // This also handles repeated product IDs.
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

      preparedItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: fromCents(priceCents),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    // ==================================
    // CALCULATE TOTAL
    // ==================================

    const shippingCents = toCents(
      SHIPPING[country]
    );

    const totalCents =
      subtotalCents + shippingCents;

    const orderNumber =
      makeOrderNumber();

    // ==================================
    // INSERT ORDER
    // ==================================

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
        firstName,
        lastName,
        phone,
        country,
        city,
        address,
        note,
        fromCents(subtotalCents),
        fromCents(shippingCents),
        fromCents(totalCents),
      ]
    );

    const order = orderResult.rows[0];

    // ==================================
    // INSERT ORDER ITEMS
    // ==================================

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
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8
        )
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
    }

    // ==================================
    // COMMIT
    // ==================================

    await client.query("COMMIT");

    inTransaction = false;

    return res.status(201).json({
      success: true,

      message:
        "Porosia u regjistrua me sukses.",

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
    if (inTransaction) {
      await safeRollback(client);
    }

    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        success: false,

        message: error.statusCode
          ? error.message
          : "Porosia nuk u krijua. Provo përsëri.",
      });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// ======================================
// GET ALL ORDERS
// GET /api/orders
// ADMIN ONLY
// ======================================

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
            ORDER BY oi.id ASC
          ) FILTER (
            WHERE oi.id IS NOT NULL
          ),
          '[]'::json
        ) AS items

      FROM orders o

      LEFT JOIN order_items oi
        ON oi.order_id = o.id

      GROUP BY o.id

      ORDER BY
        o.created_at DESC,
        o.id DESC
    `);

    return res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Porositë nuk u morën.",
    });
  }
}

// ======================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:id/status
// ADMIN ONLY
// ======================================

async function updateOrderStatus(req, res) {
  const id = Number(req.params.id);

  const status = req.body?.status;

  // VALIDATE ORDER ID
  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "ID e porosisë nuk është valide.",
    });
  }

  // VALIDATE STATUS
  if (!ALLOWED_STATUSES.has(status)) {
    return res.status(400).json({
      success: false,
      message:
        "Statusi nuk është valid.",
    });
  }

  let client;
  let inTransaction = false;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    inTransaction = true;

    // LOCK ORDER ROW
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
      throw requestError(
        "Porosia nuk u gjet.",
        404
      );
    }

    const current =
      currentResult.rows[0];

    const previousStatus =
      current.status;

    // NO CHANGE NEEDED
    if (status === previousStatus) {
      await client.query("COMMIT");

      inTransaction = false;

      return res.json({
        success: true,
        message:
          "Statusi është tashmë i përzgjedhur.",
        order: current,
      });
    }

    // Do not restock shipped/delivered
    // orders without a return process.
    if (
      status === "cancelled" &&
      (
        previousStatus === "shipped" ||
        previousStatus === "delivered"
      )
    ) {
      throw requestError(
        "Porosia e dërguar ose e dorëzuar kërkon trajtimin e kthimit para ndryshimit të stokut.",
        409
      );
    }

    // ==================================
    // ADJUST STOCK WHEN CANCELLING
    // OR REACTIVATING AN ORDER
    // ==================================

    if (
      status === "cancelled" ||
      previousStatus === "cancelled"
    ) {
      const itemsResult =
        await client.query(
          `
          SELECT
            product_id,
            quantity
          FROM order_items
          WHERE order_id = $1
            AND product_id IS NOT NULL
          ORDER BY
            product_id ASC,
            id ASC
          `,
          [id]
        );

      for (const item of itemsResult.rows) {
        if (status === "cancelled") {
          // Restore stock once on cancellation.
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
        } else {
          // Re-activating a cancelled order
          // must reserve stock again.
          const stockResult =
            await client.query(
              `
              UPDATE products
              SET
                stock = stock - $1,
                updated_at = NOW()
              WHERE id = $2
                AND stock >= $1
                AND active = true
              RETURNING id
              `,
              [
                item.quantity,
                item.product_id,
              ]
            );

          if (
            stockResult.rows.length === 0
          ) {
            throw requestError(
              "Nuk ka stok të mjaftueshëm për riaktivizimin e porosisë.",
              409
            );
          }
        }
      }
    }

    // ==================================
    // SAVE STATUS
    // ==================================

    const result = await client.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [
        status,
        id,
      ]
    );

    await client.query("COMMIT");

    inTransaction = false;

    return res.json({
      success: true,

      message:
        "Statusi u ndryshua me sukses.",

      order: result.rows[0],
    });
  } catch (error) {
    if (inTransaction) {
      await safeRollback(client);
    }

    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        success: false,

        message: error.statusCode
          ? error.message
          : "Statusi nuk u ndryshua.",
      });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
