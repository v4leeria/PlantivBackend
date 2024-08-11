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
router.get("/cart", getCart);
router.post("/cart", addItemToCart);
router.delete("/cart/:productId", removeItemFromCart);
router.post("/products", publishProduct);

module.exports = router;
