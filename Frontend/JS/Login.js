const API_URL = "http://localhost:3000/api/auth"; //la url de la red social

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");

    
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const identifier = document.getElementById("log-id").value; // Puede ser email o username, el backend lo manejará
            const password = document.getElementById("log-pass").value; // La contraseña

            try {// Enviamos la solicitud de login al backend
                const respuesta = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier, password })
                }); // El backend responderá con un token JWT y los datos del usuario si el login es exitoso

                const datos = await respuesta.json(); // Si la respuesta no es ok, lanzamos un error con el mensaje del backend o uno genérico

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "Error al iniciar sesión");
                } // Si el login es exitoso, guardamos el token y los datos del usuario en localStorage para mantener la sesión activa

                // Guardamos el token y los datos del usuario en localStorage
                localStorage.setItem("token", datos.token);
                localStorage.setItem("usuario", JSON.stringify(datos.usuario));

                alert("¡Bienvenido de nuevo!");
                // Redirecciona al feed
                window.location.href = "pagina_principal.html";

            } catch (error) {
                alert(error.message);
            } // Si el error es un "Failed to fetch" de red, le damos la oportunidad al usuario de intentar loguearse de nuevo, ya que el servidor pudo haber procesado el login pero la respuesta no llegó.
        }); 
    }

    
    if (formRegistro) { // Si estamos en la página de registro, manejamos el evento submit del formulario de registro
        formRegistro.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue al enviar el formulario

            // Como el backend usa Multer para la foto de perfil, debemos usar FormData
            const formData = new FormData(); // Creamos un objeto FormData para enviar los datos del formulario, incluyendo el archivo de la foto de perfil
            formData.append("username", document.getElementById("reg-user").value);
            formData.append("email", document.getElementById("reg-email").value);
            formData.append("password", document.getElementById("reg-pass").value);
            
            const avatarInput = document.getElementById("reg-avatar");
            if (avatarInput && avatarInput.files.length > 0) {
                formData.append("fotoPerfil", avatarInput.files[0]); // Envía el archivo físico
            } 

            try {
                const respuesta = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    body: formData // No lleva headers de Content-Type manuales, FormData lo hace solo
                }); 

                const datos = await respuesta.json(); // Si la respuesta no es ok, lanzamos un error con el mensaje del backend o uno genérico

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "Error en el registro");
                } // Si el registro es exitoso, informamos al usuario y lo redireccionamos a la página de login para que inicie sesión con su nueva cuenta

                alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                window.location.href = "login.html";

           } catch (error) {
                console.error("ERROR COMPLETO EN CAPTURA:", error);
                
                // Si el error es meramente un "Failed to fetch" de red pero el servidor ya guardó los datos,
                // le damos la oportunidad al usuario de ir a loguearse en lugar de trabar la pantalla.
                if (error.message === "Failed to fetch") {
                    alert("El registro se procesó. Si tu cuenta se creó con éxito, ya puedes iniciar sesión.");
                    window.location.href = "login.html";
                } else {
                    alert("Error: " + error.message);
                }
            }
        });
    }
});