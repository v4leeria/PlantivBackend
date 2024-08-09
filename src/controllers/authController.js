const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getUserByEmail,
  createUser,
  getUserById,
} = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "clave secreta";

// Función para generar el token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Registro de usuario
const register = async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    comuna,
    region,
    phone_number,
    image_url,
  } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      lastName,
      email,
      password: hashedPassword,
      comuna,
      region,
      phone_number,
      image_url,
    };

    const createdUser = await createUser(newUser);
    const token = generateToken(createdUser);

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el registro" });
  }
};

// Inicio de sesión de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};

const getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No se proporcionó un token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
};
