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
if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Email and password are required'
    ]);
    exit();
}

try {
    // Find user by email with role and permissions
    $query = "SELECT u.*, r.name as role_name, r.display_name as role_display_name,
                     GROUP_CONCAT(p.name) as permissions
              FROM users u 
              LEFT JOIN roles r ON u.role_id = r.id
              LEFT JOIN role_permissions rp ON r.id = rp.role_id
              LEFT JOIN permissions p ON rp.permission_id = p.id
              WHERE u.email = ? AND u.is_active = 1
              GROUP BY u.id";
    $stmt = $db->prepare($query);
    $stmt->execute([$input['email']]);
    
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password',
            'field' => 'email'
        ]);
        exit();
    }
    
    // Verify password
    if (!password_verify($input['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password',
            'field' => 'password'
        ]);
        exit();
    }
    
    // Generate session token
    $session_token = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
    
    // Store session in database
    $session_query = "INSERT INTO user_sessions (user_id, session_token, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?)";
    $session_stmt = $db->prepare($session_query);
    $session_stmt->execute([
        $user['id'],
        $session_token,
        $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        $expires_at
    ]);
    
    // Update last login and session token
    $update_query = "UPDATE users SET last_login = NOW(), session_token = ? WHERE id = ?";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->execute([$session_token, $user['id']]);
    
    // Get user settings
    $settings_query = "SELECT * FROM user_settings WHERE user_id = ?";
    $settings_stmt = $db->prepare($settings_query);
    $settings_stmt->execute([$user['id']]);
    $settings = $settings_stmt->fetch();
    
    // Prepare permissions array
    $permissions = !empty($user['permissions']) ? explode(',', $user['permissions']) : [];
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'avatar' => $user['avatar'],
            'last_login' => $user['last_login'],
            'role' => $user['role_name'],
            'role_display' => $user['role_display_name'],
            'is_admin' => (bool)$user['is_admin'],
            'permissions' => $permissions
        ],
        'session_token' => $session_token,
        'settings' => $settings,
        'redirect' => '/dashboard'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>