const usuarios = [];

const obtenerUsuarios = (req, res) => {
    res.json(usuarios);
};

const crearUsuario = (req, res) => {

    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({
            mensaje: "Faltan datos"
        });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        correo
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json({
        mensaje: "Usuario creado",
        usuario: nuevoUsuario
    });
};

module.exports = {
    obtenerUsuarios,
    crearUsuario
};