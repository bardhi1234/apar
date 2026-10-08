const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dhe password janë të detyrueshme.",
      });
    }

    const result = await pool.query(
      `
      SELECT id, email, password_hash
      FROM admin_users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
      `,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ose password gabim.",
      });
    }

    const admin = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Email ose password gabim.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET mungon.");
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gabim gjatë login-it.",
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

module.exports = {
  login,
  getMe,
};