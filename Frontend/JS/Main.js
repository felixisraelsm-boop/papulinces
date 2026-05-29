const URL_POSTS = "http://localhost:3000/api/posts";
const URL_USUARIOS = "http://localhost:3000/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    
    // Configurar barra de navegación y área de post dinámicas
    actualizarNav(token);

    // Si estamos en la página principal, cargamos el feed y activamos el buscador
    if (document.getElementById("feed-dinamico")) {
        cargarFeed();

        // Lógica para el funcionamiento del Buscador Global
        const btnBuscar = document.getElementById("btn-buscar");
        const inputBusqueda = document.getElementById("busqueda-global");

        if (btnBuscar && inputBusqueda) {
            btnBuscar.addEventListener("click", () => {
                const texto = inputBusqueda.value.trim();
                cargarFeed(texto); // Recarga el feed filtrado por palabras clave
            });

            inputBusqueda.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    cargarFeed(inputBusqueda.value.trim());
                }
            });
        }
    }

    // Si estamos en la página de Mi Cuenta, cargamos el perfil del usuario
    if (document.getElementById("info-perfil")) {
        cargarPerfilUsuario(token);
        cargarMisPublicaciones(token); // Carga tus fotos al entrar a la cuenta
        
        // 🚀 ESCUCHAR EL CLIC DEL BOTÓN EN MI_CUENTA.HTML
        const btnEliminarCuenta = document.getElementById("btn-eliminar-cuenta");
        if (btnEliminarCuenta) {
            btnEliminarCuenta.addEventListener("click", eliminarMiCuenta);
        }
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
                window.location.href = "pagina_principal.html";
            });
        }

        // Cambiamos la sección de publicar por un formulario real
        if (areaPublicar) {
            areaPublicar.innerHTML = `
                <h3>Comparte algo con la comunidad</h3>
                <form id="form-publicar" enctype="multipart/form-data">
                    <textarea id="texto-post" placeholder="¿En qué estás pensando?" required></textarea>
                    <br><br>
                    <label>Subir una foto (opcional):</label>
                    <input type="file" id="imagen-post" accept="image/*">
                    <br><br>
                    <button type="submit">Publicar</button>
                </form>
            `;

            // Escuchamos el envío del nuevo post
            document.getElementById("form-publicar").addEventListener("submit", crearNuevaPublicacion);
        }

    } else {
        // Si NO hay token (usuario visitante sin iniciar sesión)
        if (nav) {
            nav.innerHTML = `
                <a href="pagina_principal.html">Inicio</a> | 
                <a href="login.html">Iniciar Sesión</a> | 
                <a href="registro.html">Regístrate</a>
            `;
        }
    }
}

// === ENVIAR NUEVA PUBLICACIÓN AL SERVIDOR ===
async function crearNuevaPublicacion(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const texto = document.getElementById("texto-post").value;
    const imagenInput = document.getElementById("imagen-post");

    const formData = new FormData();
    formData.append("texto", texto);
    if (imagenInput.files.length > 0) {
        formData.append("imagen", imagenInput.files[0]);
    }

    try {
        const respuesta = await fetch(URL_POSTS, {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Publicación subida con éxito!");
            document.getElementById("form-publicar").reset(); 
            cargarFeed(); 
        } else {
            alert("Error: " + datos.mensaje);
        }

    } catch (error) {
        console.error("Error en crearNuevaPublicacion:", error);
    }
}

// === CARGAR LAS PUBLICACIONES EN EL FEED ===
async function cargarFeed(terminoBusqueda = "") {
    const contenedorFeed = document.getElementById("feed-dinamico");
    if (!contenedorFeed) return;

    const token = localStorage.getItem("token");
    const usuarioLogueado = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : null;

    try {
        const urlFinal = terminoBusqueda 
            ? `${URL_POSTS}?buscar=${encodeURIComponent(terminoBusqueda)}` 
            : URL_POSTS;

        const respuesta = await fetch(urlFinal);
        const posts = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los posts");
        }

        if (posts.length === 0) {
            contenedorFeed.innerHTML = "<h2>Publicaciones de la comunidad</h2><p style='color: gray; font-style: italic;'>No se encontraron publicaciones que coincidan con tu búsqueda.</p>";
            return;
        }

        contenedorFeed.innerHTML = "<h2>Publicaciones de la comunidad</h2>";

        posts.forEach(post => {
            const article = document.createElement("article");

            const usuarioNombre = post.usuario ? post.usuario.username : "Usuario Anónimo";
            const creadorPostId = post.usuario ? (post.usuario._id || post.usuario) : null;
            const idUsuarioActual = usuarioLogueado ? (usuarioLogueado._id || usuarioLogueado.id) : null;

            let comentariosHTML = "";
            if (post.comentarios && post.comentarios.length > 0) {
                post.comentarios.forEach(com => {
                    const comUsuarioNombre = com.usuario ? com.usuario.username : "Anónimo";
                    const esDuenioDelPost = idUsuarioActual && creadorPostId && (idUsuarioActual === creadorPostId);
                    
                    const botonEliminarComentario = esDuenioDelPost 
                        ? `<button onclick="eliminarComentario('${post._id}', '${com._id}')" class="btn-borrar-comentario">🗑️</button>` 
                        : "";

                    comentariosHTML += `
                        <div class="comentario-item">
                            <span><strong>@${comUsuarioNombre}</strong>: ${com.texto}</span>
                            ${botonEliminarComentario}
                        </div>
                    `;
                });
            } else {
                comentariosHTML = `<p class="comentarios-vacio">No hay comentarios aún.</p>`;
            }

            let formComentarioHTML = "";
            if (token) {
                formComentarioHTML = `
                    <form onsubmit="agregarComentario(event, '${post._id}')" class="form-comentario">
                        <input type="text" id="input-comentario-${post._id}" placeholder="Escribe un comentario..." required>
                        <button type="submit">Comentar</button>
                    </form>
                `;
            } else {
                formComentarioHTML = `<p class="comentarios-bloqueado">Inicia sesión para dejar un comentario.</p>`;
            }

            article.innerHTML = `
                <header><strong>@${usuarioNombre}</strong></header>
                ${post.imagen ? `<img src="http://localhost:3000/uploads/publicaciones/${post.imagen}" alt="Post">` : ''}
                <p>${post.texto}</p>
                <small style="color: gray;">${new Date(post.createdAt).toLocaleDateString()}</small>
                
                <div class="seccion-comentarios">
                    <h4>Comentarios:</h4>
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

// === CARGAR PERFIL DE USUARIO (MI CUENTA) ===
async function cargarPerfilUsuario(token) {
    if (!token) return;

    try {
        const respuesta = await fetch(`${URL_USUARIOS}/perfil`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            document.getElementById("display-user").textContent = datos.username || "Usuario";
            document.getElementById("display-bio").textContent = datos.bio || "Sin biografía aún.";
            
            const imgAvatar = document.getElementById("img-avatar");
            if (imgAvatar) {
                imgAvatar.src = datos.fotoPerfil 
                    ? `http://localhost:3000/uploads/perfiles/${datos.fotoPerfil}` 
                    : "../uploads/perfiles/default-avatar.png"; 
            }
        }
    } catch (error) {
        console.error("Error en cargarPerfilUsuario:", error);
    }
}

// === CARGAR MIS PUBLICACIONES ===
async function cargarMisPublicaciones(token) {
    const galeria = document.getElementById("galeria-personal");
    if (!galeria || !token) return;

    try {
        const respuesta = await fetch(`${URL_POSTS}/mis-posts`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        const posts = await respuesta.json();

        if (!respuesta.ok) throw new Error();

        if (posts.length === 0) {
            galeria.innerHTML = "<p>Aún no tienes publicaciones propias.</p>";
            return;
        }

        galeria.innerHTML = "";

        posts.forEach(post => {
            const item = document.createElement("div");
            item.style.borderBottom = "1px solid #444";
            item.style.padding = "15px 0";

            item.innerHTML = `
                ${post.imagen ? `<img src="http://localhost:3000/uploads/publicaciones/${post.imagen}" width="150" style="border-radius: 6px; margin-bottom: 8px;"><br>` : ''}
                <p style="margin-bottom: 10px;">${post.texto}</p>
                <button onclick="eliminarPublicacion('${post._id}')" style="background-color: #1e1e1e; color: #ef5350; border: 1px solid #c62828; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;" onmouseover="this.style.backgroundColor='#c62828'; this.style.color='#ffffff';" onmouseout="this.style.backgroundColor='#1e1e1e'; this.style.color='#ef5350';">Eliminar</button>
            `;
            galeria.appendChild(item);
        });

    } catch (error) {
        galeria.innerHTML = "<p>Error al cargar tus publicaciones.</p>";
    }
}

// === ELIMINAR UNA PUBLICACIÓN PROPIA ===
window.eliminarPublicacion = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;

    const token = localStorage.getItem("token");

    try {
        const respuesta = await fetch(`${URL_POSTS}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": token }
        });

        if (respuesta.ok) {
            alert("Publicación eliminada correctamente.");
            cargarMisPublicaciones(token); 
        } else {
            const datos = await respuesta.json();
            alert(datos.mensaje || "No se pudo eliminar.");
        }
    } catch (error) {
        console.error("Error al eliminar publicación:", error);
    }
};

// === AGREGAR UN COMENTARIO ===
window.agregarComentario = async (e, postId) => {
    e.preventDefault();
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
            inputTexto.value = ""; 
            cargarFeed(); 
        } else {
            alert(datos.mensaje || "Error al añadir comentario");
        }
    } catch (error) {
        console.error("Error en agregarComentario:", error);
    }
};

// === ELIMINAR UN COMENTARIO ===
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
            cargarFeed(); 
        } else {
            alert(datos.mensaje || "No se pudo eliminar el comentario.");
        }
    } catch (error) {
        console.error("Error en eliminarComentario:", error);
    }
};

// 🚀 FUNCIÓN COMPLETA PARA ELIMINAR CUENTA DESDE EL FRONTEND
async function eliminarMiCuenta() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No has iniciado sesión o tu sesión ha expirado.");
        return;
    }

    if (!confirm("⚠️ ¿ESTÁS TOTALMENTE SEGURO? Esta acción eliminará permanentemente tu perfil y todos tus posts en cascada. Esto no se puede deshacer.")) {
        return;
    }

    try {
        // Ahora llama a la ruta correcta '/eliminar'
        const respuesta = await fetch(`${URL_USUARIOS}/eliminar`, {
            method: "DELETE",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert(datos.mensaje || "Tu cuenta ha sido eliminada.");
            localStorage.clear(); // Limpia la sesión local
            window.location.href = "registro.html"; // Envía al usuario de vuelta al registro
        } else {
            alert("Error: " + datos.mensaje);
        }
    } catch (error) {
        console.error("Error al intentar eliminar la cuenta:", error);
        alert("Hubo un error de conexión con el servidor.");
    }
}