<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }
    
    // Query user with role and permissions
    $query = "SELECT u.*, r.name as role_name, r.display_name as role_display_name,
                     GROUP_CONCAT(p.name) as permissions
              FROM users u 
              LEFT JOIN roles r ON u.role_id = r.id
              LEFT JOIN role_permissions rp ON r.id = rp.role_id
              LEFT JOIN permissions p ON rp.permission_id = p.id
              WHERE u.email = :email AND u.is_active = 1
              GROUP BY u.id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }
    
    // Check if user has admin panel access
    $permissions = explode(',', $user['permissions'] ?? '');
    $hasAdminAccess = in_array('admin.panel', $permissions) || $user['is_admin'];
    
    if (!$hasAdminAccess) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. Admin privileges required.']);
        exit;
    }
    
    // Generate session token
    $sessionToken = bin2hex(random_bytes(32));
    
    // Update last login and session token
    $updateQuery = "UPDATE users SET last_login = NOW(), session_token = :token WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':token', $sessionToken);
    $updateStmt->bindParam(':id', $user['id']);
    $updateStmt->execute();
    
    // Log admin login activity
    $logQuery = "INSERT INTO user_activity_log (user_id, action, module, details, ip_address, user_agent) 
                 VALUES (:user_id, 'login', 'admin', :details, :ip, :user_agent)";
    $logStmt = $db->prepare($logQuery);
    $logDetails = json_encode([
        'login_type' => 'admin_panel',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $logStmt->bindParam(':user_id', $user['id']);
    $logStmt->bindParam(':details', $logDetails);
    $logStmt->bindParam(':ip', $ipAddress);
    $logStmt->bindParam(':user_agent', $userAgent);
    $logStmt->execute();
    
    // Prepare response data
    $responseData = [
        'success' => true,
        'message' => 'Admin login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role_name'],
            'role_display' => $user['role_display_name'],
            'is_admin' => (bool)$user['is_admin'],
            'permissions' => $permissions
        ],
        'session_token' => $sessionToken,
        'redirect' => '/admin/dashboard'
    ];
    
    echo json_encode($responseData);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>