const jwt = require("jsonwebtoken");

const protegerRuta = (req, res, next) => {

    const token = req.header("Authorization");

    if (!token) {

        return res.status(401).json({
            mensaje: "No autorizado"
        });
    }

    try {

        const verificar = jwt.verify(
            token,
            "secreto_super_seguro"
        );

        req.usuario = verificar.id;

        next();

    } catch (error) {

        res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};

module.exports = protegerRuta;