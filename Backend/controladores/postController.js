const Publicacion = require("../modelos/Publicacion");

const crearPost = async (req, res) => {
    try {
        const nuevaPublicacion = new Publicacion({
            usuario: req.usuario,
            texto: req.body.texto,
            imagen: req.file ? req.file.filename : ""
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
        const { buscar } = req.query;
        let filtro = {};

        // Si el usuario escribió algo en la barra, buscamos coincidencias (sin importar mayúsculas/minúsculas)
        if (buscar) {
            filtro = { texto: { $regex: buscar, $options: "i" } };
        }

        const posts = await Publicacion.find(filtro)
            .populate("usuario", "username")
            .populate("comentarios.usuario", "username")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener publicaciones" });
    }
};

const agregarComentario = async (req, res) => {
    try {
        const { id } = req.params; 
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ mensaje: "El texto del comentario es obligatorio" });
        }

        const post = await Publicacion.findById(id);
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        }

        post.comentarios.push({
            usuario: req.usuario,
            texto: texto
        });

        await post.save();

        res.status(201).json({ mensaje: "Comentario añadido correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al añadir el comentario" });
    }
};

const eliminarComentario = async (req, res) => {
    try {
        const { postId, comentarioId } = req.params;

        const post = await Publicacion.findById(postId);
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        }

        const comentario = post.comentarios.id(comentarioId);
        if (!comentario) {
            return res.status(404).json({ mensaje: "Comentario no encontrado" });
        }

        if (post.usuario.toString() !== req.usuario) {
            return res.status(401).json({ mensaje: "No tienes permiso para borrar este comentario" });
        }

        post.comentarios = post.comentarios.filter(
            (c) => c._id.toString() !== comentarioId
        );

        await post.save();

        res.json({ mensaje: "Comentario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el comentario" });
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
        const post = await Publicacion.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        }

        if (post.usuario.toString() !== req.usuario) {
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
            mensaje: "Error al eliminar la publicación"
        });
    }
};

module.exports = {
    crearPost,
    obtenerPosts,
    obtenerMisPosts,
    eliminarPost,
    agregarComentario,
    eliminarComentario
};