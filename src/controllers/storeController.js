const {
  getProducts,
  getProductById,
  getCartItems,
  addToCart,
  removeFromCart,
  createProduct,
} = require("../models/storeModel");

const listProducts = async (req, res) => {
  try {
    const products = await getProducts();

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Math.round(product.price),
    }));
    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (product) {
      product.price = Math.round(product.price);
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

const getCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  const userId = req.user.id;
  try {
    const cartItems = await getCartItems(userId);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error al obtener los artículos del carrito:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los artículos del carrito:" });
  }
};

const addItemToCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    await addToCart(userId, productId, quantity);
    res.status(200).json({ message: "Artículo añadido al carrito" });
  } catch (error) {
    console.error("Error al agregar el artículo al carrito", error);
    res.status(500).json({ error: "Error al agregar el artículo al carrito" });
  }
};

const removeItemFromCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  const userId = req.user.id;
  const { productId } = req.params;
  try {
    await removeFromCart(userId, productId);
    res.status(200).json({ message: "Artículo eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar el artículo del carrito", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el artículo del carrito" });
  }
};

const publishProduct = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  const { name, description, price, stock, imgplanta } = req.body;
  const userId = req.user.id;
  try {
    const newProduct = await createProduct(
      { name, description, price, stock, imgplanta },
      userId
    );
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error al publicar el producto:", err);
    res.status(500).json({ error: "Error creando el producto" });
  }
};

module.exports = {
  listProducts,
  getProduct,
  getCart,
  addItemToCart,
  removeItemFromCart,
  publishProduct,
};
