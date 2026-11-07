
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// ======================================
// PROTEINFITNESS BACKEND
// ======================================

// ROUTES
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// ======================================
// INITIALIZE EXPRESS
// ======================================

const app = express();

const PORT = process.env.PORT || 5000;

// ======================================
// CORS CONFIGURATION
// ======================================

// Ne .env:
// CLIENT_URL=http://localhost:5173
//
// Per disa domene:
// CLIENT_URL=https://proteinfitness.com,https://www.proteinfitness.com

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Lejon kerkesat pa Origin, p.sh. server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS_ORIGIN_NOT_ALLOWED")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================
// MIDDLEWARE
// ======================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// ======================================
// HEALTH CHECK
// ======================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    name: "ProteinFitness API",
    message: "ProteinFitness Backend po punon.",
  });
});

// ======================================
// PRODUCT ROUTES
// ======================================

app.use(
  "/api/products",
  productRoutes
);

// ======================================
// ORDER ROUTES
// ======================================

app.use(
  "/api/orders",
  orderRoutes
);

// ======================================
// ADMIN ROUTES
// ======================================

app.use(
  "/api/admin",
  adminRoutes
);

// ======================================
// IMAGE UPLOAD ROUTES
// ======================================

app.use(
  "/api/uploads",
  uploadRoutes
);

// ======================================
// CATEGORY ROUTES
// ======================================

app.use(
  "/api/categories",
  categoryRoutes
);

// ======================================
// API NOT FOUND
// ======================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Kjo adresë API nuk ekziston.",
  });
});

// ======================================
// ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "CORS_ORIGIN_NOT_ALLOWED") {
    return res.status(403).json({
      success: false,
      message: "Origjina e kërkesës nuk lejohet.",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Kërkesa është shumë e madhe.",
    });
  }

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Formati JSON nuk është i vlefshëm.",
    });
  }

  console.error("ProteinFitness API Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Ndodhi një gabim në server."
        : err.message || "Gabim në server.",
  });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
  console.log("================================");
  console.log("PROTEINFITNESS BACKEND");
  console.log(`PORT: ${PORT}`);
  console.log(`ENV: ${process.env.NODE_ENV || "development"}`);
  console.log("API: /api");
  console.log("================================");
});
