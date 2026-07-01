<?php
header('Content-Type: application/json');

// 1. Conexión a la base de datos
$host = "localhost";
$user = "root";       
$pass = "";           
$db   = "login_reitchert"; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Fallo en la conexión: " . $conn->connect_error]);
    exit;
}

// 2. Leer el email dinámico que viene desde el JavaScript (POST JSON)
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? $conn->real_escape_string($input['email']) : '';

if (!empty($email)) {
    // 3. Buscamos al empleado usando las columnas con mayúsculas y espacios de tu BD
    $sql = "SELECT `ID`, `Nombre`, `Apellido`, `Correo electronico`, `Sueldo` FROM `datos_empleado` WHERE `Correo electronico` = '$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Estructura limpia para tu JS
        echo json_encode([
            "success" => true,
            "empleado" => [
                "ID" => $row['ID'],
                "Nombre" => $row['Nombre'],
                "Apellido" => $row['Apellido'],
                "Correo" => $row['Correo electronico'],
                "Sueldo" => $row['Sueldo']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "El correo " . $email . " no está registrado en el sistema."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No se recibió ningún correo electrónico."]);
}

$conn->close();
?>