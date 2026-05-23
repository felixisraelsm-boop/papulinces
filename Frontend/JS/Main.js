const URL_POSTS = "http://localhost:3000/api/posts";
const URL_USUARIOS = "http://localhost:3000/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    
    // Configurar barra de navegación y área de post dinámicas
    actualizarNav(token);

    // Si estamos en la página principal, cargamos el feed
    if (document.getElementById("feed-dinamico")) {
        cargarFeed();
    }

    // Si estamos en la página de Mi Cuenta, cargamos el perfil del usuario
    if (document.getElementById("info-perfil")) {
        cargarPerfilUsuario(token);
    }
});

// Función para ajustar la vista del menú y el formulario según la sesión
function actualizarNav(token) {
    const nav = document.querySelector("nav");
    const areaPublicar = document.getElementById("area-publicar");

    if (token) {
        // Si hay sesión activa, cambiamos los links de arriba
        if (nav) {
            nav.innerHTML = `
                <a href="pagina_principal.html">Inicio</a> | 
                <a href="mi_cuenta.html">Mi Cuenta</a> | 
                <a href="#" id="btn-logout">Cerrar Sesión</a>
            `;
            
            document.getElementById("btn-logout").addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.clear();
                alert("Sesión cerrada");
                window.location.reload();
            });
        }

        // Reemplazar el mensaje por el formulario dinámico real para subir posts con fotos
        if (areaPublicar) {
            areaPublicar.innerHTML = `
                <h3>Compartir una nueva publicación</h3>
                <form id="form-crear-post">
                    <textarea id="post-texto" placeholder="¿Qué estás pensando?" required style="padding: 10px; width: 100%; max-width: 400px; min-height: 60px; display: block; margin-bottom: 10px;"></textarea>
                    
                    <label for="post-imagen" style="display: block; font-weight: bold; margin-bottom: 5px;">Seleccionar imagen:</label>
                    <input type="file" id="post-imagen" accept="image/*" style="display: block; margin-bottom: 10px;">

                    <button type="submit" style="cursor: pointer; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold;">Publicar en la comunidad</button>
                </form>
            `;

            // Escuchar el envío del formulario estructurado como FormData
            document.getElementById("form-crear-post").addEventListener("submit", async (e) => {
                e.preventDefault();
                
                const formData = new FormData();
                formData.append("texto", document.getElementById("post-texto").value);
                
                const inputImagen = document.getElementById("post-imagen");
                if (inputImagen.files.length > 0) {
                    formData.append("imagen", inputImagen.files[0]); 
                }

                try {
                    const respuesta = await fetch(URL_POSTS, {
                        method: "POST",
                        headers: {
                            "Authorization": token 
                        },
                        body: formData 
                    });

                    const contentType = respuesta.headers.get("content-type");
                    if (contentType && contentType.includes("text/html")) {
                        throw new Error("El servidor tuvo un problema interno al procesar el archivo o faltan datos.");
                    }

                    const resultado = await respuesta.json();

                    if (!respuesta.ok) {
                        throw new Error(resultado.mensaje || "Error al crear la publicación");
                    }

                    alert("¡Publicación compartida con éxito!");
                    window.location.reload(); 

                } catch (error) {
                    alert(error.message);
                }
            });
        }

    } else {
        if (nav) {
            nav.innerHTML = `
                <strong>Inicio</strong> | 
                <a href="login.html">Entrar</a> | 
                <a href="registro.html">Registro</a> | 
                <a href="mi_cuenta.html">Mi Cuenta</a>
            `;
        }
    }
}

// === CARGAR TODAS LAS PUBLICACIONES EN EL FEED ===
async function cargarFeed() {
    const contenedorFeed = document.getElementById("feed-dinamico");
    if (!contenedorFeed) return;

    const token = localStorage.getItem("token");
    // 🚀 Recuperamos el usuario logueado para comparar IDs más adelante
    const usuarioLogueado = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : null;

    try {
        const respuesta = await fetch(URL_POSTS);
        const posts = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los posts");
        }

        if (posts.length === 0) {
            contenedorFeed.innerHTML = "<h2>Publicaciones de la comunidad</h2><p>No hay publicaciones todavía. ¡Sé el primero!</p>";
            return;
        }

        contenedorFeed.innerHTML = "<h2>Publicaciones de la comunidad</h2>";

        posts.forEach(post => {
            const article = document.createElement("article");
            article.style.border = "1px solid #ccc";
            article.style.padding = "15px";
            article.style.margin = "15px 0";
            article.style.borderRadius = "8px";

            const usuarioNombre = post.usuario ? post.usuario.username : "Usuario Anónimo";
            
         
            const creadorPostId = post.usuario ? (post.usuario._id || post.usuario) : null;
            // ID del usuario que tiene la sesión iniciada en este navegador
            const idUsuarioActual = usuarioLogueado ? (usuarioLogueado._id || usuarioLogueado.id) : null;

           
            let comentariosHTML = "";
            if (post.comentarios && post.comentarios.length > 0) {
                post.comentarios.forEach(com => {
                    const comUsuarioNombre = com.usuario ? com.usuario.username : "Anónimo";
                    
                   
                    const esDuenioDelPost = idUsuarioActual && creadorPostId && (idUsuarioActual === creadorPostId);
                    
                    // Si es el dueño del post, le renderizamos el botón de eliminar comentario
                    const botonEliminarComentario = esDuenioDelPost 
                        ? `<button onclick="eliminarComentario('${post._id}', '${com._id}')" style="background: none; border: none; color: red; cursor: pointer; font-size: 0.9em;">🗑️</button>` 
                        : "";

                    comentariosHTML += `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 5px 10px; margin: 4px 0; border-radius: 4px; font-size: 0.9em;">
                            <span><strong>@${comUsuarioNombre}</strong>: ${com.texto}</span>
                            ${botonEliminarComentario}
                        </div>
                    `;
                });
            } else {
                comentariosHTML = `<p style="color: gray; font-size: 0.85em; font-style: italic;">No hay comentarios aún.</p>`;
            }

            // 🚀 Construir el formulario para añadir un nuevo comentario (solo si hay token/sesión)
            let formComentarioHTML = "";
            if (token) {
                formComentarioHTML = `
                    <form onsubmit="agregarComentario(event, '${post._id}')" style="margin-top: 12px; display: flex; gap: 8px;">
                        <input type="text" id="input-comentario-${post._id}" placeholder="Escribe un comentario..." required style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <button type="submit" style="padding: 6px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Comentar</button>
                    </form>
                `;
            } else {
                formComentarioHTML = `<p style="color: gray; font-size: 0.85em; margin-top: 10px;">Inicia sesión para dejar un comentario.</p>`;
            }

            // Inyectamos todo al article del post
            article.innerHTML = `
                <strong>@${usuarioNombre}</strong>
                ${post.imagen ? `<br><img src="http://localhost:3000/uploads/publicaciones/${post.imagen}" alt="Post" style="max-width: 100%; max-height: 400px; border-radius: 4px; margin-top: 10px;">` : ''}
                <p>${post.texto}</p>
                <small style="color: gray;">${new Date(post.createdAt).toLocaleDateString()}</small>
                
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #eee;">
                    <h4 style="margin: 0 0 8px 0; font-size: 0.95em; color: #333;">Comentarios:</h4>
                    <div class="contenedor-comentarios">${comentariosHTML}</div>
                    ${formComentarioHTML}
                </div>
            `;
            contenedorFeed.appendChild(article);
        });

    } catch (error) {
        console.error("Error al cargar el feed:", error);
    }
}

// === CARGAR EL PERFIL EN MI_CUENTA.HTML ===
async function cargarPerfilUsuario(token) {
    if (!token) {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch(`${URL_USUARIOS}/perfil`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const usuario = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(usuario.mensaje);
        }

        document.getElementById("display-user").textContent = usuario.username;
        document.getElementById("display-bio").textContent = usuario.bio || "Sin biografía aún.";
        
        if (usuario.fotoPerfil) {
            const imgAvatar = document.getElementById("img-avatar");
            if (imgAvatar) {
                imgAvatar.src = `http://localhost:3000/uploads/perfiles/${usuario.fotoPerfil}`;
            }
        }

        cargarMisPublicaciones(token);

    } catch (error) {
        console.error("Error al obtener perfil:", error);
    }
}

// === CARGAR LAS PUBLICACIONES DEL PROPIO USUARIO ===
async function cargarMisPublicaciones(token) {
    const galeria = document.getElementById("galeria-personal");
    if (!galeria) return;

    try {
        const respuesta = await fetch(`${URL_POSTS}/mis-posts`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const misPosts = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error("Error al obtener tus publicaciones");
        }

        if (misPosts.length === 0) {
            galeria.innerHTML = "<p>Aún no has subido ninguna publicación.</p>";
            return;
        }

        galeria.innerHTML = ""; 

        misPosts.forEach(post => {
            const item = document.createElement("div");
            item.style.border = "1px solid #ddd";
            item.style.padding = "10px";
            item.style.margin = "10px 0";
            item.style.borderRadius = "6px";

            item.innerHTML = `
                ${post.imagen ? `<img src="http://localhost:3000/uploads/publicaciones/${post.imagen}" width="150" style="border-radius: 4px;"><br>` : ''}
                <p>${post.texto}</p>
                <button onclick="eliminarPublicacion('${post._id}')" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Eliminar</button>
            `;
            galeria.appendChild(item);
        });

    } catch (error) {
        console.error(error);
    }
}

// === FUNCIÓN PARA ELIMINAR POST ===
async function eliminarPublicacion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta publicación?")) return;
    const token = localStorage.getItem("token");

    try {
        const respuesta = await fetch(`${URL_POSTS}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": token }
        });

        if (respuesta.ok) {
            alert("Publicación eliminada correctamente.");
            window.location.reload();
        } else {
            alert("No se pudo eliminar la publicación.");
        }
    } catch (error) {
        console.error(error);
    }
}

// Función para enviar un nuevo comentario al Backend
window.agregarComentario = async (event, postId) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const inputTexto = document.getElementById(`input-comentario-${postId}`);
    
    if (!inputTexto || !inputTexto.value.trim()) return;

    try {
        const respuesta = await fetch(`${URL_POSTS}/${postId}/comentarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ texto: inputTexto.value.trim() })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            inputTexto.value = ""; // Limpiamos la caja de texto
            cargarFeed(); // Recargamos el feed para reflejar el nuevo comentario en pantalla
        } else {
            alert(datos.mensaje || "Error al añadir comentario");
        }
    } catch (error) {
        console.error("Error en agregarComentario:", error);
    }
};

// Función para eliminar un comentario (Solo habilitado en Backend y Frontend para el creador del post)
window.eliminarComentario = async (postId, comentarioId) => {
    if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;
    const token = localStorage.getItem("token");

    try {
        const respuesta = await fetch(`${URL_POSTS}/${postId}/comentarios/${comentarioId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert("Comentario eliminado correctamente.");
            cargarFeed(); // Volvemos a pintar el feed actualizado
        } else {
            alert(datos.mensaje || "No se pudo eliminar el comentario.");
        }
    } catch (error) {
        console.error("Error en eliminarComentario:", error);
    }
};