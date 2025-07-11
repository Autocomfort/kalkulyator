<?php
// Встановлюємо заголовки для CORS і JSON
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Зчитуємо JSON-запит
$data = json_decode(file_get_contents("php://input"), true);

// Перевірка полів
if (!isset($data['name']) || !isset($data['phone']) || !isset($data['comment'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Некоректні дані']);
    exit;
}

// Підготовка даних
$payload = [
    "client" => [
        "fullname" => $data['name'],
        "phone" => $data['phone']
    ],
    "clientComment" => $data['comment']
];

// API-запит
$ch = curl_init('https://crm.sitniks.com/open-api/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: X2AZUwxc7GDmlWuEAUCNHGHFTdlVdtlKWwLLkEKyiIa'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

// Виконання запиту
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Обробка відповіді
if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true, 'message' => 'Заявку надіслано']);
} else {
    echo json_encode(['success' => false, 'message' => 'Помилка: ' . $response]);
}
