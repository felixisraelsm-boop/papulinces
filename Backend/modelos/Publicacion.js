const mongoose = require("mongoose");

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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Publicacion",
    publicacionSchema
);