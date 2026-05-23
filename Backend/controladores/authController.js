const Usuario = require("../modelos/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const usuarioExiste = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "Usuario o correo ya existente" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            username,
            email,
            password: passwordHash,
            fotoPerfil: req.file ? req.file.filename : ""
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        // ESTE CAMBIO TE DARÁ EL ERROR REAL EN LA PESTAÑA "RESPONSE" DEL NAVEGADOR
        console.error("ERROR DETALLADO:", error); 
        res.status(500).json({ 
            mensaje: "Error en el servidor", 
            detalle: error.message 
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const usuario = await Usuario.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario._id }, "secretotemporal", { expiresIn: "7d" });

        res.json({
            mensaje: "Login exitoso",
            token,
            usuario: { id: usuario._id, username: usuario.username, email: usuario.email }
        });

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        res.status(500).json({ mensaje: "Error en el servidor", detalle: error.message });
    }
};

module.exports = { registrarUsuario, loginUsuario };