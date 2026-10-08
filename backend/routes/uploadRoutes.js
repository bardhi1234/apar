const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  upload,
  uploadImages,
} = require("../controllers/uploadController");

const router = express.Router();

router.post(
  "/images",
  authMiddleware,
  upload.array("images", 6),
  uploadImages
);

module.exports = router;
