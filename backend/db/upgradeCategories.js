require("dotenv").config();

const pool = require("./db");

async function run() {
  try {
    await pool.query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);

    await pool.query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);

    console.log("Categories u përditësua me description + image_url.");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

run();