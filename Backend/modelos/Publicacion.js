const mongoose = require("mongoose"); // Importamos Mongoose para definir el esquema de la publicación y los comentarios

// Esquema para los comentarios individuales
const comentarioSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Reutiliza tu modelo de Usuario
        required: true
    }, // El campo de usuario es una referencia al modelo de Usuario, lo que nos permite relacionar cada comentario con el usuario que lo hizo
    texto: {
        type: String,
        required: true
    } // El texto del comentario es obligatorio
}, {
    timestamps: true // Para saber a qué hora comentaron
});
// Esquema para las publicaciones, que incluye un array de comentarios
const publicacionSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }, // El campo de usuario es una referencia al modelo de Usuario, lo que nos permite relacionar cada publicación con el usuario que la creó
    texto: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: ""
    },

    comentarios: [comentarioSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Publicacion",
    publicacionSchema
); // Exportamos el modelo de Publicación para usarlo en otras partes del backend (controladores, rutas, etc.)