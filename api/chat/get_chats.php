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

    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        exit();
    }

    // Get user's chats
    $stmt = $db->prepare("
        SELECT 
            c.id,
            c.title,
            c.chat_type,
            c.created_at,
            c.updated_at,
            (
                SELECT m.message 
                FROM messages m 
                WHERE m.chat_id = c.id 
                ORDER BY m.created_at DESC 
                LIMIT 1
            ) as last_message,
            (
                SELECT m.created_at 
                FROM messages m 
                WHERE m.chat_id = c.id 
                ORDER BY m.created_at DESC 
                LIMIT 1
            ) as last_message_time,
            (
                SELECT COUNT(*) 
                FROM messages m 
                WHERE m.chat_id = c.id 
                AND m.is_bot = 0 
                AND m.read_status = 0
            ) as unread_count
        FROM chats c
        WHERE c.user_id = ?
        ORDER BY c.updated_at DESC
    ");
    $stmt->execute([$userId]);
    $chats = $stmt->fetchAll();

    // Format chats
    $formattedChats = [];
    foreach ($chats as $chat) {
        $lastMessageTime = $chat['last_message_time'];
        $timeAgo = '';
        
        if ($lastMessageTime) {
            $minutesAgo = (time() - strtotime($lastMessageTime)) / 60;
            
            if ($minutesAgo < 1) {
                $timeAgo = 'Just now';
            } elseif ($minutesAgo < 60) {
                $timeAgo = floor($minutesAgo) . 'm ago';
            } elseif ($minutesAgo < 1440) {
                $hours = floor($minutesAgo / 60);
                $timeAgo = $hours . 'h ago';
            } else {
                $days = floor($minutesAgo / 1440);
                $timeAgo = $days . 'd ago';
            }
        } else {
            $timeAgo = 'No messages';
        }

        $formattedChats[] = [
            'id' => (int)$chat['id'],
            'title' => $chat['title'],
            'lastMessage' => $chat['last_message'] ?: 'No messages yet',
            'timestamp' => $timeAgo,
            'unread' => (int)$chat['unread_count'],
            'chat_type' => $chat['chat_type'],
            'created_at' => $chat['created_at'],
            'updated_at' => $chat['updated_at']
        ];
    }

    $response = [
        'success' => true,
        'data' => [
            'chats' => $formattedChats,
            'user_id' => (int)$userId,
            'total' => count($formattedChats)
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching chats: ' . $e->getMessage()
    ]);
}
?>