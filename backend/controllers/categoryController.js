const pool = require("../db/db");

function makeSlug(value = "") {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getCategories(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        image_url,
        sort_order,
        active
      FROM categories
      WHERE active = TRUE
      ORDER BY sort_order ASC, id ASC
    `);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("GET CATEGORIES:", error);

    res.status(500).json({
      success: false,
      message: "Kategoritë nuk u morën.",
    });
  }
}

async function getAdminCategories(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        image_url,
        sort_order,
        active
      FROM categories
      ORDER BY sort_order ASC, id ASC
    `);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("GET ADMIN CATEGORIES:", error);

    res.status(500).json({
      success: false,
      message: "Kategoritë nuk u morën.",
    });
  }
}

async function createCategory(req, res) {
  try {
    const {
      name,
      description = "",
      imageUrl = "",
      sortOrder = 0,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shkruaj emrin e kategorisë.",
      });
    }

    const slug = makeSlug(name);

    const result = await pool.query(
      `
      INSERT INTO categories (
        name,
        slug,
        description,
        image_url,
        sort_order
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        name.trim(),
        slug,
        description.trim(),
        imageUrl.trim(),
        Number(sortOrder) || 0,
      ]
    );

    res.status(201).json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE CATEGORY:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Kjo kategori ekziston.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Kategoria nuk u krijua.",
    });
  }
}

async function updateCategory(req, res) {
  const client = await pool.connect();

  try {
    const id = Number(req.params.id);

    const {
      name,
      description = "",
      imageUrl = "",
      sortOrder = 0,
      active = true,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Emri është i detyrueshëm.",
      });
    }

    await client.query("BEGIN");

    const oldResult = await client.query(
      `
      SELECT *
      FROM categories
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    if (!oldResult.rows.length) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Kategoria nuk u gjet.",
      });
    }

    const oldName = oldResult.rows[0].name;
    const newName = name.trim();
    const slug = makeSlug(newName);

    const result = await client.query(
      `
      UPDATE categories
      SET
        name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        sort_order = $5,
        active = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
      `,
      [
        newName,
        slug,
        description.trim(),
        imageUrl.trim(),
        Number(sortOrder) || 0,
        Boolean(active),
        id,
      ]
    );

    if (oldName !== newName) {
      await client.query(
        `
        UPDATE products
        SET
          category = $1,
          updated_at = NOW()
        WHERE category = $2
        `,
        [newName, oldName]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("UPDATE CATEGORY:", error);

    res.status(500).json({
      success: false,
      message: "Kategoria nuk u ndryshua.",
    });
  } finally {
    client.release();
  }
}

async function deleteCategory(req, res) {
  try {
    const id = Number(req.params.id);

    const categoryResult = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );

    if (!categoryResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Kategoria nuk u gjet.",
      });
    }

    const category = categoryResult.rows[0];

    const countResult = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE category = $1
      `,
      [category.name]
    );

    if (countResult.rows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Kjo kategori ka produkte. Ndrysho kategorinë e produkteve para se ta fshish.",
      });
    }

    await pool.query(
      `DELETE FROM categories WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Kategoria u fshi.",
    });
  } catch (error) {
    console.error("DELETE CATEGORY:", error);

    res.status(500).json({
      success: false,
      message: "Kategoria nuk u fshi.",
    });
  }
}

module.exports = {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};