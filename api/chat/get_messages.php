<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $userId = $_GET['user_id'] ?? null;
    $chatId = $_GET['chat_id'] ?? null;
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);

    if (!$userId || !$chatId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID and Chat ID are required']);
        exit();
    }

    // Get messages for the chat
    $stmt = $db->prepare("
        SELECT 
            m.id,
            m.message,
            m.message_type,
            m.is_bot,
            m.attachment_url,
            m.attachment_name,
            m.attachment_size,
            m.created_at as timestamp,
            m.read_status,
            u.name as sender_name
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.chat_id = ? AND m.user_id = ?
        ORDER BY m.created_at ASC
        LIMIT ? OFFSET ?
    ");
    $stmt->execute([$chatId, $userId, $limit, $offset]);
    $messages = $stmt->fetchAll();

    // Format messages
    $formattedMessages = [];
    foreach ($messages as $msg) {
        $formattedMessages[] = [
            'id' => (int)$msg['id'],
            'content' => $msg['message'],
            'message_type' => $msg['message_type'],
            'sender' => $msg['is_bot'] ? 'bot' : 'user',
            'sender_name' => $msg['sender_name'],
            'timestamp' => $msg['timestamp'],
            'read' => (bool)$msg['read_status'],
            'attachment_url' => $msg['attachment_url'],
            'attachment_name' => $msg['attachment_name'],
            'attachment_size' => $msg['attachment_size']
        ];
    }

    $response = [
        'success' => true,
        'data' => [
            'messages' => $formattedMessages,
            'chat_id' => (int)$chatId,
            'user_id' => (int)$userId,
            'total' => count($formattedMessages)
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching messages: ' . $e->getMessage()
    ]);
}
?>