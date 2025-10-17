<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit();
    }

    // Validate required fields
    if (empty($input['user_id']) || empty($input['message'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'User ID and message are required'
        ]);
        exit();
    }

    $userId = $input['user_id'];
    $message = $input['message'];
    $chatId = $input['chat_id'] ?? null;
    $messageType = $input['message_type'] ?? 'text';
    $isBot = $input['is_bot'] ?? false;
    $attachmentUrl = $input['attachment_url'] ?? null;
    $attachmentName = $input['attachment_name'] ?? null;
    $attachmentSize = $input['attachment_size'] ?? null;

    // If no chat_id provided, create a new chat
    if (!$chatId) {
        $chatTitle = $isBot ? 'New Chat' : 'User Chat';
        $stmt = $db->prepare("
            INSERT INTO chats (user_id, title, chat_type, created_at, updated_at) 
            VALUES (?, ?, 'bot', NOW(), NOW())
        ");
        $stmt->execute([$userId, $chatTitle]);
        $chatId = $db->lastInsertId();
    }

    // Save the message
    $stmt = $db->prepare("
        INSERT INTO messages (chat_id, user_id, message, message_type, is_bot, attachment_url, attachment_name, attachment_size, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $chatId, 
        $userId, 
        $message, 
        $messageType, 
        $isBot ? 1 : 0,
        $attachmentUrl,
        $attachmentName,
        $attachmentSize
    ]);

    $messageId = $db->lastInsertId();

    // Update chat's updated_at timestamp
    $stmt = $db->prepare("UPDATE chats SET updated_at = NOW() WHERE id = ?");
    $stmt->execute([$chatId]);

    $response = [
        'success' => true,
        'message' => 'Message saved successfully',
        'data' => [
            'message_id' => $messageId,
            'chat_id' => $chatId,
            'user_id' => $userId
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error saving message: ' . $e->getMessage()
    ]);
}
?>