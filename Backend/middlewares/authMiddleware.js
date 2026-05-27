const jwt = require("jsonwebtoken");

const protegerRuta = (req, res, next) => {
    // El frontend enviará el token en los headers
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            mensaje: "No autorizado"
        });
    }

    try {
        
        const verificar = jwt.verify(token, "secretotemporal");

        // Guardamos el id del usuario en la petición para que el controlador sepa quién es
        req.usuario = verificar.id;

        next(); // Le damos el paso al controlador
    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};

module.exports = protegerRuta;