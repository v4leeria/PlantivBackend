const { pool } = require("../config/db");

const getProducts = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

const getCartItems = async (userId) => {
  const query = `
    SELECT ci.id, ci.product_id, ci.quantity, p.imgplanta, p.price, p.name
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = $1
  `;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error al obtener cart items:", error);
    throw error;
  }
};

const createCart = async (userId) => {
  const query = `
    INSERT INTO carts (user_id) VALUES ($1) RETURNING id
  `;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error creando carrito:", error);
    throw error;
  }
};

const getCartByUserId = async (userId) => {
  const query = `
    SELECT id FROM carts WHERE user_id = $1
  `;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el carrito por id de carrito:", error);
    throw error;
  }
};

const addToCart = async (userId, productId, quantity) => {
  try {
    let cartId = await getCartByUserId(userId);
    if (!cartId) {
      cartId = await createCart(userId);
    }

    const query = `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `;
    const values = [cartId, productId, quantity];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error agregando al carro", error);
    throw error;
  }
};

const removeFromCart = async (userId, productId) => {
  const query = `
    DELETE FROM cart_items
    WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)
    AND product_id = $2
  `;
  const values = [userId, productId];
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    throw error;
  }
};

const createProduct = async (product, userId) => {
  const { name, description, price, stock, imgplanta } = product;
  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, imgplanta, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, stock, imgplanta, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creando el producto:", error);
    throw error;
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCartItems,
  addToCart,
  removeFromCart,
  createProduct,
};
