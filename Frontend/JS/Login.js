const API_URL = "http://localhost:3000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");

    // === LÓGICA DE INICIAR SESIÓN ===
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const identifier = document.getElementById("log-id").value;
            const password = document.getElementById("log-pass").value;

            try {
                const respuesta = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier, password })
                });

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "Error al iniciar sesión");
                }

                // Guardamos el token y los datos del usuario en localStorage
                localStorage.setItem("token", datos.token);
                localStorage.setItem("usuario", JSON.stringify(datos.usuario));

                alert("¡Bienvenido de nuevo!");
                // Redirecciona al feed
                window.location.href = "pagina_principal.html";

            } catch (error) {
                alert(error.message);
            }
        });
    }

    // === LÓGICA DE REGISTRO DE USUARIO ===
    if (formRegistro) {
        formRegistro.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Como el backend usa Multer para la foto de perfil, debemos usar FormData
            const formData = new FormData();
            formData.append("username", document.getElementById("reg-user").value);
            formData.append("email", document.getElementById("reg-email").value);
            formData.append("password", document.getElementById("reg-pass").value);
            
            const avatarInput = document.getElementById("reg-avatar");
            if (avatarInput.files.length > 0) {
                formData.append("avatar", avatarInput.files[0]); // Envía el archivo físico
            }

            try {
                const respuesta = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    body: formData // No lleva headers de Content-Type manuales, FormData lo hace solo
                });

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "Error en el registro");
                }

                alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                window.location.href = "login.html";

            } catch (error) {
                alert(error.message);
            }
        });
    }
});