const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get(
  "/",
  authMiddleware,
  getOrders
);

router.patch(
  "/:id/status",
  authMiddleware,
  updateOrderStatus
);

module.exports = router;