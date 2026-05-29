const express = require("express");
const router = express.Router();
const protegerRuta = require("../middlewares/authMiddleware");

const {
    obtenerPerfil,
    obtenerUsuarios,
    crearUsuario,
    eliminarCuenta 
} = require("../controladores/usuarioController");

// Definición de rutas
router.get("/perfil", protegerRuta, obtenerPerfil);
router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);

// 🚀 CORREGIDO: Ruta simplificada a '/eliminar' para que coincida exactamente con tu frontend (Main.js)
router.delete("/eliminar", protegerRuta, eliminarCuenta);

module.exports = router;