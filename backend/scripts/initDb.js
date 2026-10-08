require("dotenv").config();

const fs = require("fs");
const path = require("path");

const pool = require("../db/db");

async function initDatabase() {
  try {
    const schemaPath = path.join(
      __dirname,
      "../db/schema.sql"
    );

    const schema = fs.readFileSync(
      schemaPath,
      "utf8"
    );

    await pool.query(schema);

    console.log("");
    console.log("APAR database u krijua me sukses.");
    console.log("");

    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("Tabelat:");

    result.rows.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });
  } catch (error) {
    console.error("");
    console.error("DATABASE ERROR:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

initDatabase();
