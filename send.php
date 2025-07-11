<?php
// Встановлюємо отримувача
$to = "comfortauto89@gmail.com"; // ← заміни на свою пошту

// Отримуємо дані з форми
$name = htmlspecialchars(trim($_POST['name']));
$phone = htmlspecialchars(trim($_POST['phone']));
$comment = htmlspecialchars(trim($_POST['comment']));
$products = isset($_POST['products']) ? $_POST['products'] : [];

// Заголовки
$subject = "Нове замовлення з сайту";
$headers = "From: no-reply@yourdomain.com\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";

// Формуємо список товарів
$productList = "";
if (!empty($products)) {
    foreach ($products as $item) {
        $title = htmlspecialchars($item['title']);
        $qty = htmlspecialchars($item['quantity']);
        $price = htmlspecialchars($item['price']);
        $productList .= "<li><strong>$title</strong> — $qty шт. × $price грн</li>";
    }
} else {
    $productList = "<li>—</li>";
}

// HTML лист
$message = "
<h2>Нове замовлення</h2>
<p><strong>Ім’я:</strong> $name</p>
<p><strong>Телефон:</strong> $phone</p>
<p><strong>Коментар:</strong> $comment</p>
<h3>Товари:</h3>
<ul>$productList</ul>
";

// Надсилаємо лист
$mailSuccess = mail($to, $subject, $message, $headers);

// Відповідь
if ($mailSuccess) {
    echo json_encode(['success' => true, 'message' => 'Замовлення успішно надіслано']);
} else {
    echo json_encode(['success' => false, 'message' => 'Помилка надсилання']);
}
?>
