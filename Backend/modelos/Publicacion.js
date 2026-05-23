const mongoose = require("mongoose");

// Esquema para los comentarios individuales
const comentarioSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Reutiliza tu modelo de Usuario
        required: true
    },
    texto: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Para saber a qué hora comentaron
});

const publicacionSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: ""
    },
    // 🚀 AQUÍ AGREGAMOS LOS COMENTARIOS
    comentarios: [comentarioSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Publicacion",
    publicacionSchema
);