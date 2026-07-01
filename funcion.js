function manejarLogin(response) {
    // 1. Decodificar el token de Google para obtener el email real del usuario
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const emailUsuario = payload.email; // Aquí obtenemos por ejemplo: rodriguito@gmail.com
    
    // 2. Apuntamos al nombre REAL de tu archivo PHP
    fetch('buscar_empleado.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Le mandamos el email real en el cuerpo de la petición
        body: JSON.stringify({ email: emailUsuario })
    })
    .then(res => res.json()) // Volvemos a poner .json() porque ahora sí va a responder bien
    .then(data => {
        if (data.success) {
            // Inyectamos los datos en tu panel
            document.getElementById('emp-id').innerText = data.empleado.ID;
            document.getElementById('emp-name').innerText = data.empleado.Nombre;
            document.getElementById('emp-lastname').innerText = data.empleado.Apellido;
            document.getElementById('emp-email').innerText = data.empleado.Correo;
            document.getElementById('emp-salary').innerText = data.empleado.Sueldo;

            // Intercambiamos pantallas
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar el inicio de sesión.');
    });
}

// Lógica para el botón "Cerrar Sesión"
document.getElementById('btn-logout').addEventListener('click', function() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    location.reload();
});