
const express = require("express");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// ======================================
// PROTEINFITNESS - ORDER ROUTES
// ======================================

// Krijimi i porosisë nga klienti
// POST /api/orders
router.post("/", createOrder);

// Lista e porosive - vetëm Admin
// GET /api/orders
router.get(
  "/",
  authMiddleware,
  getOrders
);

// Ndryshimi i statusit - vetëm Admin
// PATCH /api/orders/:id/status
router.patch(
  "/:id/status",
  authMiddleware,
  updateOrderStatus
);

module.exports = router;
