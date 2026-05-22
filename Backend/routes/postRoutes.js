const express = require("express");

const router = express.Router();

const multer = require("multer");

const {
    crearPost,
    obtenerPosts,
    obtenerMisPosts,
    eliminarPost
} = require("../controladores/postController");

const protegerRuta = require(
    "../middlewares/authMiddleware"
);

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/publicaciones/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});

const upload = multer({ storage });

router.get("/", obtenerPosts);

router.get(
    "/mis-posts",
    protegerRuta,
    obtenerMisPosts
);

router.delete(
    "/:id",
    protegerRuta,
    eliminarPost
);

router.post(
    "/",
    protegerRuta,
    upload.single("imagen"),
    crearPost
);

module.exports = router;