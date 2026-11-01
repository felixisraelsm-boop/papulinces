const mongoose = require("mongoose"); // Importamos Mongoose para definir el esquema del usuario, que incluye campos para username, email, password, foto de perfil y biografía

const usuarioSchema = mongoose.Schema({ // Definimos el esquema del usuario con los campos necesarios para el registro y perfil

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, // El username debe ser único para evitar cuentas duplicadas, y se trimeará para eliminar espacios al inicio o final

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, // El email también debe ser único para evitar cuentas duplicadas, y se trimeará para eliminar espacios al inicio o final

    password: {
        type: String,
        required: true
    }, // La contraseña se almacenará en formato hash para mayor seguridad, el proceso de hashing se realizará en el controlador antes de guardar el usuario en la base de datos

    fotoPerfil: {
        type: String,
        default: ""
    }, // Agregamos un campo para la foto de perfil, que almacenará la URL de la imagen subida por el usuario. Si no sube una foto, se deja como cadena vacía.

    bio: {
    type: String,
    default: ""
}, // Agregamos un campo de biografía para que los usuarios puedan escribir algo sobre sí mismos en su perfil

}, {
    timestamps: true
}); // Agregamos timestamps para saber cuándo se creó o actualizó el usuario

module.exports = mongoose.model("Usuario", usuarioSchema);