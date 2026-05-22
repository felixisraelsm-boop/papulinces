const express = require("express");

const router = express.Router();

const {
    obtenerPerfil
} = require("../controladores/usuarioController");

const protegerRuta = require(
    "../middlewares/authMiddleware"
);

router.get(
    "/perfil",
    protegerRuta,
    obtenerPerfil
);

const {
    obtenerUsuarios,
    crearUsuario
} = require("../controladores/usuarioController");

router.get("/", obtenerUsuarios);

router.post("/", crearUsuario);

module.exports = router;