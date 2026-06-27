<?php
// Configuración de la conexión a la base de datos
$host = "localhost";
$user = "root";       // Cambiá por tu usuario de MySQL (por defecto suele ser root)
$pass = "";           // Cambiá por tu contraseña de MySQL
$db   = "tu_base_de_datos"; // Escribí acá el nombre de tu base de datos

$conn = new mysqli($host, $user, $pass, $db);

// Verificamos la conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Fallo en la conexión: " . $conn->connect_error]));
}

// Recibimos el correo que nos manda el JavaScript
$email = isset($_GET['email']) ? $conn->real_escape_string($_GET['email']) : '';

if (!empty($email)) {
    // Buscamos el empleado en la tabla
    $sql = "SELECT id, nombre, apellido, correo_electronico, sueldo FROM datos_empleado WHERE correo_electronico = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Si existe, guardamos los datos en un array
        $empleado = $result->fetch_assoc();
        // Lo devolvemos al frontend en formato JSON
        echo json_encode($empleado);
    } else {
        echo json_encode(["error" => "Empleado no registrado"]);
    }
} else {
    echo json_encode(["error" => "Correo vacío"]);
}

$conn->close();
?>