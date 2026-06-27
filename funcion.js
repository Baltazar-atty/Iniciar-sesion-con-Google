// Vinculamos el botón de cerrar sesión apenas cargue la página
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-logout").addEventListener("click", logout);
});

// LA FUNCIÓN QUE SE EJECUTA AL LOGUEARTE
function manejarLogin(response) {
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const usuarioGoogle = JSON.parse(jsonPayload);
        const correoIngresado = usuarioGoogle.email.toLowerCase();

        // ─── CONEXIÓN REAL CON LA BASE DE DATOS ───
        // Llamamos a nuestro archivo PHP pasándole el mail por la URL
        fetch(`buscar_empleado.php?email=${correoIngresado}`)
            .then(res => res.json())
            .then(empleadoEncontrado => {
                
                // Si el PHP nos devuelve un error o no encuentra al usuario
                if (empleadoEncontrado.error) {
                    alert("Acceso denegado: " + empleadoEncontrado.error);
                    return;
                }

                // Si todo está bien, inyectamos los datos reales traídos de la base de datos SQL
                document.getElementById("emp-id").textContent = empleadoEncontrado.id;
                document.getElementById("emp-name").textContent = empleadoEncontrado.nombre;
                document.getElementById("emp-lastname").textContent = empleadoEncontrado.apellido;
                document.getElementById("emp-email").textContent = empleadoEncontrado.correo_electronico;
                
                // Formateamos el número del sueldo para que vuelva a mostrarse lindo con comas
                const sueldoFormateado = parseFloat(empleadoEncontrado.sueldo).toLocaleString('es-AR', { minimumFractionDigits: 2 });
                document.getElementById("emp-salary").textContent = sueldoFormateado;

                // Cambiamos de pantalla
                document.getElementById("login-screen").classList.add("hidden");
                document.getElementById("dashboard-screen").classList.remove("hidden");
            })
            .catch(err => {
                console.error("Error al conectar con el servidor:", err);
                alert("Hubo un error de conexión con la base de datos.");
            });

    } catch (error) {
        console.error("Error al procesar el login de Google:", error);
    }
}

function logout() {
    document.getElementById("dashboard-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
}