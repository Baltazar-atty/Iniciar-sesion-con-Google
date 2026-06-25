// Esperar a que la API de Google esté completamente cargada
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "720907761269-r3j5mmfmjk81nd6nr1lnbkodgg94k1n4.apps.googleusercontent.com", // Reemplazá esto con tu ID de cliente real
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", type: "standard" } // Configuración estética del botón
    );

    // Mostrar el botón de inicio de sesión de inmediato
    google.accounts.id.prompt(); 

    // Configurar el botón de cerrar sesión
    document.getElementById("btn-logout").addEventListener("click", logout);
};

// Función que maneja la respuesta de Google tras el login exitoso
function handleCredentialResponse(response) {
    // Decodificamos el JWT para obtener los datos del usuario
    const responsePayload = decodeJwt(response.credential);

    // --- BASE DE DATOS SIMULADA ---
    // Como el sueldo y el ID no vienen de Google, los definimos acá
    // En el futuro, harías un fetch() a tu servidor usando el email para buscar estos datos
    const datosBaseDeDatos = {
        idEmpleado: "EMP-2026-094",
        sueldo: "450.000,00"
    };

    // Insertar los datos en el HTML
    document.getElementById("emp-id").textContent = datosBaseDeDatos.idEmpleado;
    document.getElementById("emp-fullname").textContent = responsePayload.name; // Trae Nombre y Apellido juntos
    document.getElementById("emp-email").textContent = responsePayload.email;
    document.getElementById("emp-salary").textContent = datosBaseDeDatos.sueldo;

    // Intercambiar pantallas (ocultar login, mostrar dashboard)
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("dashboard-screen").classList.remove("hidden");
}

// Función auxiliar para decodificar el token JWT de Google de forma nativa
function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Función para cerrar sesión
function logout() {
    // Limpiar los campos del HTML por seguridad
    document.getElementById("emp-id").textContent = "-";
    document.getElementById("emp-fullname").textContent = "-";
    document.getElementById("emp-email").textContent = "-";
    document.getElementById("emp-salary").textContent = "-";

    // Intercambiar pantallas de nuevo
    document.getElementById("dashboard-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
    
    // Opcional: Deshabilitar el inicio automático de Google si se deslogueó a propósito
    google.accounts.id.disableAutoSelect();
}