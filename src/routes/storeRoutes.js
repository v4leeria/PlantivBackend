const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  listProducts,
  getProduct,
  getCart,
  addItemToCart,
  removeItemFromCart,
  publishProduct,
} = require("../controllers/storeController");

const router = express.Router();

router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.get("/cart", authenticateToken, getCart);
router.post("/cart", authenticateToken, addItemToCart);
router.delete("/cart/:productId", authenticateToken, removeItemFromCart);
router.post("/products", authenticateToken, publishProduct);

module.exports = router;
