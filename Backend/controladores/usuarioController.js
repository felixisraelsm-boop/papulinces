const Usuario = require("../modelos/Usuario");
const Publicacion = require("../modelos/Publicacion"); 

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

// 🚀 LOGICA DE ELIMINACIÓN DE CUENTA EN CASCADA
const eliminarCuenta = async (req, res) => {
    try {
        const usuarioId = req.usuario; // Obtenido del authMiddleware

        // 1. Borrar todas las publicaciones del usuario para no dejar registros huérfanos
        await Publicacion.deleteMany({ usuario: usuarioId });

        // 2. Borrar permanentemente al usuario
        const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId);

        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: "El usuario no existe o ya fue eliminado." });
        }

        res.json({ mensaje: "Tu cuenta y todas tus publicaciones han sido eliminadas correctamente." });

    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al eliminar la cuenta." });
    }
};

module.exports = {
    obtenerPerfil,
    obtenerUsuarios,
    crearUsuario,
    eliminarCuenta // 👈 Exportado correctamente
};