require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");

// 1. Inicializar la app y conectar la Base de Datos
const app = express();
conectarDB();

// 2. Middlewares Globales
app.use(cors()); 
app.use(express.json());

// 3. Configurar la carpeta de archivos estáticos para las subidas (Multer)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. Importar Rutas (¡Una sola vez cada una!)
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const postRoutes = require("./routes/postRoutes");

// 5. Definición de Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/posts", postRoutes);

// Ruta de prueba inicial
app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

// 6. Configuración del Puerto y Encendido del Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});