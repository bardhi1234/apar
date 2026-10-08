const pool = require("../db/db");
const cloudinary = require("../config/cloudinary");

function createSlug(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ë/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImage(image) {
  if (typeof image === "string") {
    return {
      url: image,
      publicId: null,
    };
  }

  return {
    url: image?.url || "",
    publicId:
      image?.publicId ||
      image?.public_id ||
      null,
  };
}

function mapProduct(row) {
  const assets =
    Array.isArray(row.image_assets)
      ? row.image_assets
      : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description,

    price: Number(row.price),

    oldPrice:
      row.old_price !== null
        ? Number(row.old_price)
        : null,

    badge: row.badge,
    stock: row.stock,

    sizes: row.sizes || [],
    colors: row.colors || [],

    active: row.active,

    images:
      assets.map(
        (asset) => asset.url
      ),

    imageAssets: assets,

    image:
      assets[0]?.url || null,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const PRODUCT_SELECT = `
  SELECT
    p.*,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'url', pi.url,
            'publicId', pi.public_id,
            'sortOrder', pi.sort_order
          )
          ORDER BY pi.sort_order
        )
        FROM product_images pi
        WHERE pi.product_id = p.id
      ),
      '[]'::json
    ) AS image_assets

  FROM products p
`;

async function getProducts(
  req,
  res
) {
  try {
    const result =
      await pool.query(`
        ${PRODUCT_SELECT}
        ORDER BY p.created_at DESC;
      `);

    res.json({
      success: true,
      count: result.rows.length,
      products:
        result.rows.map(mapProduct),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Gabim gjatë marrjes së produkteve.",
    });
  }
}

async function getProductById(
  req,
  res
) {
  try {
    const result =
      await pool.query(
        `
        ${PRODUCT_SELECT}
        WHERE p.id = $1;
        `,
        [req.params.id]
      );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message:
          "Produkti nuk u gjet.",
      });
    }

    res.json({
      success: true,
      product:
        mapProduct(
          result.rows[0]
        ),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Gabim gjatë marrjes së produktit.",
    });
  }
}

async function insertImages(
  client,
  productId,
  images = []
) {
  for (
    let index = 0;
    index < images.length;
    index += 1
  ) {
    const image =
      normalizeImage(
        images[index]
      );

    if (!image.url) continue;

    await client.query(
      `
      INSERT INTO product_images (
        product_id,
        url,
        public_id,
        sort_order
      )
      VALUES ($1, $2, $3, $4);
      `,
      [
        productId,
        image.url,
        image.publicId,
        index,
      ]
    );
  }
}

async function createProduct(
  req,
  res
) {
  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      name,
      category,
      description = "",
      price,
      oldPrice = null,
      badge = null,
      stock = 0,
      sizes = [],
      colors = [],
      images = [],
      active = true,
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(400).json({
        success: false,
        message:
          "Emri, kategoria dhe çmimi janë të detyrueshme.",
      });
    }

    let slug =
      createSlug(name);

    const slugExists =
      await client.query(
        `
        SELECT id
        FROM products
        WHERE slug = $1;
        `,
        [slug]
      );

    if (
      slugExists.rows.length
    ) {
      slug =
        `${slug}-${Date.now()}`;
    }

    const result =
      await client.query(
        `
        INSERT INTO products (
          name,
          slug,
          category,
          description,
          price,
          old_price,
          badge,
          stock,
          sizes,
          colors,
          active
        )

        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11
        )

        RETURNING id;
        `,
        [
          name.trim(),
          slug,
          category,
          description,
          Number(price),
          oldPrice === "" ||
          oldPrice === null
            ? null
            : Number(oldPrice),
          badge || null,
          Number(stock) || 0,
          Array.isArray(sizes)
            ? sizes
            : [],
          Array.isArray(colors)
            ? colors
            : [],
          Boolean(active),
        ]
      );

    const productId =
      result.rows[0].id;

    await insertImages(
      client,
      productId,
      images
    );

    await client.query("COMMIT");

    const productResult =
      await pool.query(
        `
        ${PRODUCT_SELECT}
        WHERE p.id = $1;
        `,
        [productId]
      );

    res.status(201).json({
      success: true,
      message:
        "Produkti u krijua me sukses.",
      product:
        mapProduct(
          productResult.rows[0]
        ),
    });
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Gabim gjatë krijimit të produktit.",
    });
  } finally {
    client.release();
  }
}

async function updateProduct(
  req,
  res
) {
  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } =
      req.params;

    const currentResult =
      await client.query(
        `
        SELECT *
        FROM products
        WHERE id = $1;
        `,
        [id]
      );

    if (
      !currentResult.rows.length
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        success: false,
        message:
          "Produkti nuk u gjet.",
      });
    }

    const current =
      currentResult.rows[0];

    const {
      name = current.name,
      category =
        current.category,
      description =
        current.description,
      price = current.price,
      oldPrice =
        current.old_price,
      badge = current.badge,
      stock = current.stock,
      sizes = current.sizes,
      colors = current.colors,
      active = current.active,
      images,
    } = req.body;

    const slug =
      name !== current.name
        ? `${createSlug(name)}-${id}`
        : current.slug;

    await client.query(
      `
      UPDATE products
      SET
        name = $1,
        slug = $2,
        category = $3,
        description = $4,
        price = $5,
        old_price = $6,
        badge = $7,
        stock = $8,
        sizes = $9,
        colors = $10,
        active = $11,
        updated_at = NOW()
      WHERE id = $12;
      `,
      [
        name,
        slug,
        category,
        description,
        Number(price),

        oldPrice === "" ||
        oldPrice === null
          ? null
          : Number(oldPrice),

        badge || null,
        Number(stock) || 0,

        Array.isArray(sizes)
          ? sizes
          : [],

        Array.isArray(colors)
          ? colors
          : [],

        Boolean(active),
        id,
      ]
    );

    let removedPublicIds = [];

    if (
      Array.isArray(images)
    ) {
      const oldImages =
        await client.query(
          `
          SELECT public_id
          FROM product_images
          WHERE product_id = $1;
          `,
          [id]
        );

      const newPublicIds =
        images
          .map(normalizeImage)
          .map(
            (image) =>
              image.publicId
          )
          .filter(Boolean);

      removedPublicIds =
        oldImages.rows
          .map(
            (row) =>
              row.public_id
          )
          .filter(Boolean)
          .filter(
            (publicId) =>
              !newPublicIds.includes(
                publicId
              )
          );

      await client.query(
        `
        DELETE FROM product_images
        WHERE product_id = $1;
        `,
        [id]
      );

      await insertImages(
        client,
        id,
        images
      );
    }

    await client.query("COMMIT");

    /*
      Fotot që janë larguar
      nga produkti fshihen
      edhe nga Cloudinary.
    */
    if (
      removedPublicIds.length
    ) {
      try {
        await cloudinary.api.delete_resources(
          removedPublicIds,
          {
            resource_type:
              "image",
            type: "upload",
            invalidate: true,
          }
        );
      } catch (cloudError) {
        console.error(
          "Cloudinary cleanup error:",
          cloudError
        );
      }
    }

    const result =
      await pool.query(
        `
        ${PRODUCT_SELECT}
        WHERE p.id = $1;
        `,
        [id]
      );

    res.json({
      success: true,
      message:
        "Produkti u ndryshua me sukses.",
      product:
        mapProduct(
          result.rows[0]
        ),
    });
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Gabim gjatë ndryshimit të produktit.",
    });
  } finally {
    client.release();
  }
}

async function deleteProduct(
  req,
  res
) {
  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } =
      req.params;

    const product =
      await client.query(
        `
        SELECT id, name
        FROM products
        WHERE id = $1;
        `,
        [id]
      );

    if (
      !product.rows.length
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        success: false,
        message:
          "Produkti nuk u gjet.",
      });
    }

    const images =
      await client.query(
        `
        SELECT public_id
        FROM product_images
        WHERE product_id = $1
          AND public_id IS NOT NULL;
        `,
        [id]
      );

    const publicIds =
      images.rows
        .map(
          (image) =>
            image.public_id
        )
        .filter(Boolean);

    /*
      Së pari pastrojmë Cloudinary.
    */
    if (publicIds.length) {
      await cloudinary.api.delete_resources(
        publicIds,
        {
          resource_type:
            "image",
          type: "upload",
          invalidate: true,
        }
      );
    }

    /*
      ON DELETE CASCADE fshin
      product_images nga Neon.
    */
    await client.query(
      `
      DELETE FROM products
      WHERE id = $1;
      `,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        "Produkti dhe fotot e tij u fshinë me sukses.",
    });
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Produkti nuk u fshi.",
    });
  } finally {
    client.release();
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};