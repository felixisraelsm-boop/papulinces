const jwt = require("jsonwebtoken"); // Importamos jsonwebtoken para verificar el token de autenticación

const protegerRuta = (req, res, next) => { //se asegura de que el usuario esté autenticado antes de permitirle acceder a ciertas rutas
    
    const token = req.header("Authorization"); // El token se envía en el encabezado de la solicitud 

    if (!token) {
        return res.status(401).json({ //se usa para cortar ejecucion de la funcion
            mensaje: "No autorizado"
        }); // Si no hay token, respondemos con un error de no autorizado
    }

    try {
<<<<<<< HEAD
        
        const verificar = jwt.verify(token, "secretotemporal");

=======
        const verificar = jwt.verify(token, "secretotemporal"); //se verifica el token usando la clave secreta 
//(realmente se deberian usar variables de entorno)
>>>>>>> ac0a1420304939d32a7427ecef8c1c0e3dd9b8a4
        // Guardamos el id del usuario en la petición para que el controlador sepa quién es
        req.usuario = verificar.id; //se usa para saber que usuario hizo la solicitud 

        next(); // Le damos el paso al controlador
    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido"
        });  //se ejecuta si el token no es valido
    }
};

module.exports = protegerRuta; //exportamos la funcion para poder ser usada en demas rutas