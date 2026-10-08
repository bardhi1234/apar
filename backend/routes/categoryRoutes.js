const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);

router.get(
  "/admin",
  authMiddleware,
  getAdminCategories
);

router.post(
  "/",
  authMiddleware,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCategory
);

module.exports = router;
