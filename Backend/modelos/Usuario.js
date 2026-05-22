const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    fotoPerfil: {
        type: String,
        default: ""
    },

    bio: {
    type: String,
    default: ""
},

}, {
    timestamps: true
});

module.exports = mongoose.model("Usuario", usuarioSchema);