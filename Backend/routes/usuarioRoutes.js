const express = require("express");
const router = express.Router();

// IMPORTANTE: Asegúrate de que tu carpeta se llame "middlewares" (en minúsculas)
// e incluya el archivo "authMiddleware.js"
const protegerRuta = require("../middlewares/authMiddleware");

const {
    obtenerPerfil,
    obtenerUsuarios,
    crearUsuario
} = require("../controladores/usuarioController");

// Definición de rutas
router.get("/perfil", protegerRuta, obtenerPerfil);
router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);

module.exports = router;