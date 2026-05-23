const express = require("express");
const multer = require("multer");
const router = express.Router();
const { registrarUsuario, loginUsuario } = require("../controladores/authController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/perfiles/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// RUTA DE REGISTRO CON DEBUG
router.post("/register", (req, res, next) => {
    console.log("--- LLEGÓ PETICIÓN AL BACKEND ---");
    
    upload.single("fotoPerfil")(req, res, (err) => {
        if (err) {
            console.error("DEBUG MULTER:", err);
            return res.status(400).json({ mensaje: "Error de Multer: " + err.message });
        }
        
        console.log("Archivo procesado:", req.file);
        console.log("Cuerpo del formulario:", req.body);
        next();
    });
}, registrarUsuario);

router.post("/login", loginUsuario);

module.exports = router;