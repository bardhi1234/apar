require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../db/db");

async function createAdmin() {
  try {
    const email =
      process.env.ADMIN_EMAIL?.trim().toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL ose ADMIN_PASSWORD mungon."
      );
    }

    if (password.length < 8) {
      throw new Error(
        "Password duhet të ketë së paku 8 karaktere."
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
      INSERT INTO admin_users (
        email,
        password_hash
      )
      VALUES ($1, $2)

      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash

      RETURNING id, email;
      `,
      [
        email,
        passwordHash,
      ]
    );

    console.log("");
    console.log("Admin u krijua me sukses.");
    console.log(`Email: ${result.rows[0].email}`);
    console.log("");
  } catch (error) {
    console.error("");
    console.error("ADMIN ERROR:");
    console.error(error.message);
    console.error("");
  } finally {
    await pool.end();
  }
}

createAdmin();