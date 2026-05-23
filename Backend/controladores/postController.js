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
            .populate("comentarios.usuario", "username") // 👈 Trae el username de quien comentó
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener publicaciones" });
    }
};

const agregarComentario = async (req, res) => {
    try {
        const { id } = req.params; // ID de la publicación
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ mensaje: "El comentario no puede estar vacío" });
        }

        const post = await Publicacion.findById(id);
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        }

        
        const nuevoComentario = {
            usuario: req.usuario,
            texto: texto
        };

        post.comentarios.push(nuevoComentario);
        await post.save();

        res.status(201).json({ 
            mensaje: "Comentario agregado con éxito", 
            post 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar el comentario" });
    }
};

const eliminarComentario = async (req, res) => {
    try {
        const { postId, comentarioId } = req.params;

        const post = await Publicacion.findById(postId);
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        }

       
        if (post.usuario.toString() !== req.usuario) {
            return res.status(403).json({ 
                mensaje: "No autorizado. Solo el dueño de la publicación puede borrar comentarios." 
            });
        }

        
        post.comentarios = post.comentarios.filter(
            (comentario) => comentario._id.toString() !== comentarioId
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
    eliminarPost,
    agregarComentario, 
    eliminarComentario  
};