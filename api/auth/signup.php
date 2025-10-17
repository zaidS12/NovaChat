<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
$required_fields = ['fullName', 'email', 'password', 'confirmPassword'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => ucfirst($field) . ' is required',
            'field' => $field
        ]);
        exit();
    }
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid email format',
        'field' => 'email'
    ]);
    exit();
}

// Validate password match
if ($input['password'] !== $input['confirmPassword']) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Passwords do not match',
        'field' => 'confirmPassword'
    ]);
    exit();
}

// Validate password strength
if (strlen($input['password']) < 8) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Password must be at least 8 characters long',
        'field' => 'password'
    ]);
    exit();
}

try {
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$input['email']]);
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            'success' => false, 
            'message' => 'Email already exists',
            'field' => 'email'
        ]);
        exit();
    }
    
    // Hash password
    $hashed_password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Insert new user
    $insert_query = "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())";
    $insert_stmt = $db->prepare($insert_query);
    $insert_stmt->execute([
        $input['fullName'],
        $input['email'],
        $hashed_password
    ]);
    
    $user_id = $db->lastInsertId();
    
    // Create default user settings
    $settings_query = "INSERT INTO user_settings (user_id) VALUES (?)";
    $settings_stmt = $db->prepare($settings_query);
    $settings_stmt->execute([$user_id]);
    
    // Create welcome chat
    $chat_query = "INSERT INTO chats (user_id, title, chat_type) VALUES (?, 'Welcome Chat', 'bot')";
    $chat_stmt = $db->prepare($chat_query);
    $chat_stmt->execute([$user_id]);
    
    $chat_id = $db->lastInsertId();
    
    // Add welcome message
    $message_query = "INSERT INTO messages (chat_id, user_id, message, is_bot) VALUES (?, 3, 'Welcome to NovaChat! How can I help you today?', TRUE)";
    $message_stmt = $db->prepare($message_query);
    $message_stmt->execute([$chat_id]);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully!',
        'user' => [
            'id' => $user_id,
            'name' => $input['fullName'],
            'email' => $input['email']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>