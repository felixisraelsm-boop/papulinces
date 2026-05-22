const Usuario = require("../modelos/Usuario");

const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario).select("-password");
        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener perfil"
        });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener usuarios"
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo } = req.body;

        if (!nombre || !correo) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const usuarioExiste = await Usuario.findOne({ correo });

        if (usuarioExiste) {
            return res.status(400).json({
                mensaje: "El usuario ya existe"
            });
        }

        const nuevoUsuario = new Usuario({
            nombre,
            correo
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: "Usuario creado",
            usuario: nuevoUsuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear usuario"
        });
    }
};

// 💡 AQUÍ ESTÁ EL ARREGLO: Exportamos las 3 funciones juntas en un solo objeto al final
module.exports = {
    obtenerPerfil,
    obtenerUsuarios,
    crearUsuario
};