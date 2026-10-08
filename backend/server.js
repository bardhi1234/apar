const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "APAR Backend po punon.",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`APAR Backend running on http://localhost:${PORT}`);
});
