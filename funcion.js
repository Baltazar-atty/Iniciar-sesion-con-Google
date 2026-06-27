// 1. Tu "Base de Datos" simplificada
const baseDeDatos = {
    "calandronada@gmail.com": { id: "NTR-001", nombre: "Tomás", sueldo: "$450.000" },
    "juan@gmail.com": { id: "NTR-002", nombre: "Juan", sueldo: "$500.000" }
};

// 2. Inicializar el botón de Google
google.accounts.id.initialize({
    client_id: "419208057363-k4fimfm79l5e4odst7gdnil5s8e4tl9s.apps.googleusercontent.com", 
    callback: manejarLogin
});
google.accounts.id.renderButton(document.getElementById("buttonDiv"), {});

// 3. LA LÓGICA CENTRAL: Traducir, comparar y mostrar
function manejarLogin(response) {
    // Traducimos el token de Google de forma ultra-corta para sacar el mail
    const tokenTraducido = JSON.parse(atob(response.credential.split('.')[1]));
    const correoIngresado = tokenTraducido.email;

    // Buscamos si ese correo existe en nuestra base de datos
    const usuarioEncontrado = baseDeDatos[correoIngresado];

    if (usuarioEncontrado) {
        console.log("¡Usuario Encontrado!");
        console.log("ID:", usuarioEncontrado.id);
        console.log("Nombre:", usuarioEncontrado.nombre);
        console.log("Sueldo:", usuarioEncontrado.sueldo);
    } else {
        console.log("Acceso denegado: El correo no está registrado.");
    }
}