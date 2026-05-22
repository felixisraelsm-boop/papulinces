const Publicacion = require("../modelos/Publicacion");

const crearPost = async (req, res) => {

    try {

        const nuevaPublicacion = new Publicacion({

            usuario: req.usuario,

            texto: req.body.texto,

            imagen: req.file
                ? req.file.filename
                : ""

        });

        await nuevaPublicacion.save();

        res.status(201).json({
            mensaje: "Publicación creada",
            publicacion: nuevaPublicacion
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al crear publicación"
        });
    }
};

const obtenerPosts = async (req, res) => {

    try {

        const posts = await Publicacion.find()
            .populate("usuario", "username")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener publicaciones"
        });
    }
};

const obtenerMisPosts = async (req, res) => {

    try {

        const posts = await Publicacion.find({
            usuario: req.usuario
        })
        .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener tus publicaciones"
        });
    }
};

const eliminarPost = async (req, res) => {

    try {

        const post = await Publicacion.findById(
            req.params.id
        );

        if (!post) {

            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        }

        if (
            post.usuario.toString() !== req.usuario
        ) {

            return res.status(401).json({
                mensaje: "No autorizado"
            });
        }

        await post.deleteOne();

        res.json({
            mensaje: "Publicación eliminada"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar publicación"
        });
    }
};

module.exports = {
    crearPost,
    obtenerPosts,
    obtenerMisPosts,
    eliminarPost
};