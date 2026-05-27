const express = require("express");
const router = express.Router();
const protegerRuta = require("../middlewares/authMiddleware");

const {
    obtenerPerfil,
    obtenerUsuarios,
    crearUsuario,
    eliminarCuenta // 👈 Importado aquí
} = require("../controladores/usuarioController");

// Definición de rutas
router.get("/perfil", protegerRuta, obtenerPerfil);
router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);

// 🚀 Nueva Ruta para eliminar la cuenta (Protegida por Token)
router.delete("/eliminar-mi-cuenta", protegerRuta, eliminarCuenta);

module.exports = router;