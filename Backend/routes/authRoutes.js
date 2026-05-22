const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/perfiles/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});

const upload = multer({ storage });

const {
    registrarUsuario,
    loginUsuario
} = require("../controladores/authController");

router.post(
    "/register",
    upload.single("avatar"),
    registrarUsuario
);

router.post("/login", loginUsuario);

module.exports = router;