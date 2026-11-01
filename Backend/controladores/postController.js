const Publicacion = require("../modelos/Publicacion"); //recupera el modelo de los post

const crearPost = async (req, res) => { //funcion que se encarga de crear un post nuevo
    try {
        const nuevaPublicacion = new Publicacion({
            usuario: req.usuario, //se asigna el usuario que esta logueado a la publicacion, esto se hace gracias al middleware de autenticacion que asigna el id del usuario a req.usuario
            texto: req.body.texto,
            imagen: req.file ? req.file.filename : ""
        }); //crea una nueva publicacion con el usuario que la creo, el texto que escribio e imagen (solo si subio una)

        await nuevaPublicacion.save(); //guadrda la publicaicon en la base de datos 

        res.status(201).json({
            mensaje: "Publicación creada",
            publicacion: nuevaPublicacion
        }); //devuelve mensaje de exito y la publicacion creada

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear publicación"
        }); //si ocurrio un error devuelve mensaje de error y detiene el proceso
    }
};

<<<<<<< HEAD

const obtenerPosts = async (req, res) => {
=======
const obtenerPosts = async (req, res) => { //funcion que sirve para obtener los post de la base de datos
>>>>>>> ac0a1420304939d32a7427ecef8c1c0e3dd9b8a4
    try {
        const { buscar } = req.query; //recupera el valor de la barra de busqueda
        let filtro = {}; //filtra vacio por defecto

        // Si el usuario escribió algo en la barra, buscamos coincidencias (sin importar mayúsculas/minúsculas)
        if (buscar) {
            filtro = { texto: { $regex: buscar, $options: "i" } }; 
        }// Si no se escribió nada, el filtro queda vacío y se obtienen todas las publicaciones

        const posts = await Publicacion.find(filtro)
            .populate("usuario", "username") //popula el campo usuario con el username del usuario que lo creo
            .populate("comentarios.usuario", "username")
            .sort({ createdAt: -1 }); //ordena por fecha de creacion

        res.json(posts);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener publicaciones" });
    }
};

const agregarComentario = async (req, res) => { //anadir comentarios a los post 
    try {
        const { id } = req.params; //recupera el id del post al que se le va a anadir el comentario
        const { texto } = req.body; //recupera el texto del comentario que se va a anadir

        if (!texto) {
            return res.status(400).json({ mensaje: "El texto del comentario es obligatorio" });
        } //verififca que el texto no este vacio

        const post = await Publicacion.findById(id);
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        }//verifica que el post exista

        post.comentarios.push({ //utilizando subdocumentos de moongose anadimos un array de comentarios al post
            usuario: req.usuario,
            texto: texto
        }); //los comentarios tienen el id del user y el texto del contario

        await post.save();

        res.status(201).json({ mensaje: "Comentario añadido correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al añadir el comentario" });
    }
};

const eliminarComentario = async (req, res) => { //eliminar comentarios de los post, solo el usuario que creo el post puede eliminar los comentarios de ese post
    try {
        const { postId, comentarioId } = req.params; //obtiene el idpost y el id del comentario que se eliminara

        const post = await Publicacion.findById(postId); //busca el post al que se eliminara el comentario
        if (!post) {
            return res.status(404).json({ mensaje: "Publicación no encontrada" });
        } //si no se encuentra devuelve error

        const comentario = post.comentarios.id(comentarioId); //busca el comentario del post utilizando su id
        if (!comentario) {
            return res.status(404).json({ mensaje: "Comentario no encontrado" });
        }

        if (post.usuario.toString() !== req.usuario) {
            return res.status(401).json({ mensaje: "No tienes permiso para borrar este comentario" });
        } //se valida que el usuario que va a elminar el post sea el mismo que lo creo

        post.comentarios = post.comentarios.filter(
            (c) => c._id.toString() !== comentarioId
        ); //se filtra el array de comentarios del post para eliminar el comentario seleccionado

        await post.save(); //se guarda el post con el comentario elminado

        res.json({ mensaje: "Comentario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el comentario" });
    }
};

const obtenerMisPosts = async (req, res) => { //muestra los post del usuario que esta logueado
    try {
        const posts = await Publicacion.find({ //busca los post que tengan el id del usuario logueado
            usuario: req.usuario
        })
        .sort({ createdAt: -1 }); //se meustran en orden de fecha de creacion

        res.json(posts); //devuelve los post del usuario logueado

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener tus publicaciones"
        });
    }
};

const eliminarPost = async (req, res) => { //permite eliminar un post, solo el usuario que lo creo puede eliminarlo
    try {
        const post = await Publicacion.findById(req.params.id);  //busca el post que se va a eliminar utilizando su id

        if (!post) {
            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        } //se valida que el; post exista

        if (post.usuario.toString() !== req.usuario) {
            return res.status(401).json({
                mensaje: "No autorizado"
            });
        } //si el usuario logueado es diferente al que creo el post devuelve error no autorizado

        await post.deleteOne(); //si el usuario es el mismo que lo creo se elimina el post

        res.json({
            mensaje: "Publicación eliminada"
        }); //devuelve mensaje de exito al elimianr el post

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
}; //se exportan las funciones para ser utilizadas en demas partes 