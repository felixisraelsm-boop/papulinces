const Usuario = require("../modelos/Usuario"); //importa el modelo de usuarios
const bcrypt = require("bcryptjs"); //libreria para encriptar contrasenas
const jwt = require("jsonwebtoken"); //libreria para generar tokens de autenticacion

const registrarUsuario = async (req, res) => { //valida que no hayanduplicados, encripta la contraseña y guarda el usuario en la base de datos
    try { 
        const { username, email, password } = req.body; //contiene el nombre de usuario, contrasenas y el correo (op. img.)

        if (!username || !email || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        } //valida que no hayan campos vacios 

        const usuarioExiste = await Usuario.findOne({
            $or: [{ email }, { username }]
        }); //se busca dentro de la base de datos si ya existe un usuario 

        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "Usuario o correo ya existente" });
        } //si el usuario ya existe regresa mensaje de error

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt); //por seguridad se encripta la contrasena antes de guardarla

        const nuevoUsuario = new Usuario({
            username,
            email,
            password: passwordHash,
            fotoPerfil: req.file ? req.file.filename : ""
        }); //se crea un nuevo usuario con los dats recibidos y contrasena encriptada

        await nuevoUsuario.save(); //se guarda el nuevo usuario en la base de datos

        res.status(201).json({ mensaje: "Usuario registrado correctamente" }); //un JSON con mensaje de exito

    } catch (error) {
        console.error("ERROR DETALLADO:", error); 
        res.status(500).json({ 
            mensaje: "Error en el servidor", 
            detalle: error.message 
        }); //si ocurre un error enm el proceso, se captura un mensaje de error
    }
};

const loginUsuario = async (req, res) => { //verfica que el usuario exista, compara la contraseña y genera un token JWT para autenticación
    try {
        const { identifier, password } = req.body; //usando identifier permitimos al usuario registrarse con gmail o user 
        const usuario = await Usuario.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });  //se busca en la base de datos el usuario por los datos proporcionados

        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        } //si no existe se regresa error

        const passwordCorrecta = await bcrypt.compare(password, usuario.password); //se compara la contrasena ingresada con la encriptada 
        if (!passwordCorrecta) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        } //si son diferentes manda mensaje de error

        const token = jwt.sign({ id: usuario._id }, "secretotemporal", { expiresIn: "7d" }); //se genera un token JWT con el ID user, una clave secreta y un tiempo de expiracion de 7 dias

        res.json({
            mensaje: "Login exitoso",
            token,
            usuario: { id: usuario._id, username: usuario.username, email: usuario.email }
        }); //si sale exitoso, se regresa un JSON con mensaje de exito

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        res.status(500).json({ mensaje: "Error en el servidor", detalle: error.message });
    } //revela el error especifico en caso de que ocurra un error durante el proceso
};

module.exports = { registrarUsuario, loginUsuario }; //se exportan las funciones para ser usadas en otras partes 