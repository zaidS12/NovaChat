<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../middleware/auth_middleware.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetUsers($db);
            break;
        case 'POST':
            handleCreateUser($db);
            break;
        case 'PUT':
            handleUpdateUser($db);
            break;
        case 'DELETE':
            handleDeleteUser($db);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

/**
 * Get users list with pagination and filtering
 */
function handleGetUsers($db) {
    requireAdminAuth('users.view');
    
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 20);
    $search = $_GET['search'] ?? '';
    $role = $_GET['role'] ?? '';
    $status = $_GET['status'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if (!empty($search)) {
        $whereConditions[] = "(u.name LIKE :search OR u.email LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($role)) {
        $whereConditions[] = "r.name = :role";
        $params[':role'] = $role;
    }
    
    if ($status !== '') {
        $whereConditions[] = "u.is_active = :status";
        $params[':status'] = $status;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total 
                   FROM users u 
                   LEFT JOIN roles r ON u.role_id = r.id 
                   $whereClause";
    
    $countStmt = $db->prepare($countQuery);
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    $countStmt->execute();
    $totalUsers = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get users
    $query = "SELECT u.id, u.name, u.email, u.is_active, u.is_admin, u.created_at, u.last_login,
                     r.name as role_name, r.display_name as role_display_name,
                     creator.name as created_by_name
              FROM users u 
              LEFT JOIN roles r ON u.role_id = r.id
              LEFT JOIN users creator ON u.created_by = creator.id
              $whereClause
              ORDER BY u.created_at DESC 
              LIMIT :limit OFFSET :offset";
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get available roles
    $rolesQuery = "SELECT id, name, display_name FROM roles WHERE is_active = 1 ORDER BY display_name";
    $rolesStmt = $db->prepare($rolesQuery);
    $rolesStmt->execute();
    $roles = $rolesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    logAdminActivity('view_users', 'users', ['page' => $page, 'search' => $search]);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'users' => $users,
            'roles' => $roles,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($totalUsers / $limit),
                'total_users' => $totalUsers,
                'per_page' => $limit
            ]
        ]
    ]);
}

/**
 * Create new user
 */
function handleCreateUser($db) {
    requireAdminAuth('users.create');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $roleId = (int)($input['role_id'] ?? 2);
    $isActive = (bool)($input['is_active'] ?? true);
    
    // Validation
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and password are required']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        return;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        return;
    }
    
    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
        return;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $currentUser = getCurrentAdminUser();
    
    // Insert user
    $insertQuery = "INSERT INTO users (name, email, password, role_id, is_active, created_by, created_at) 
                    VALUES (:name, :email, :password, :role_id, :is_active, :created_by, NOW())";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':name', $name);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':password', $hashedPassword);
    $insertStmt->bindParam(':role_id', $roleId);
    $insertStmt->bindParam(':is_active', $isActive, PDO::PARAM_BOOL);
    $insertStmt->bindParam(':created_by', $currentUser['id']);
    
    if ($insertStmt->execute()) {
        $userId = $db->lastInsertId();
        
        // Create default user settings
        $settingsQuery = "INSERT INTO user_settings (user_id, theme, language, notifications_enabled) 
                          VALUES (:user_id, 'light', 'en', 1)";
        $settingsStmt = $db->prepare($settingsQuery);
        $settingsStmt->bindParam(':user_id', $userId);
        $settingsStmt->execute();
        
        logAdminActivity('create_user', 'users', [
            'user_id' => $userId,
            'name' => $name,
            'email' => $email,
            'role_id' => $roleId
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'user_id' => $userId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user']);
    }
}

/**
 * Update existing user
 */
function handleUpdateUser($db) {
    requireAdminAuth('users.edit');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    $userId = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $roleId = (int)($input['role_id'] ?? 0);
    $isActive = (bool)($input['is_active'] ?? true);
    $password = $input['password'] ?? '';
    
    if (!$userId || empty($name) || empty($email) || !$roleId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID, name, email, and role are required']);
        return;
    }
    
    // Check if user exists
    $checkQuery = "SELECT id, email FROM users WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $userId);
    $checkStmt->execute();
    $existingUser = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existingUser) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }
    
    // Check if email is taken by another user
    if ($existingUser['email'] !== $email) {
        $emailCheckQuery = "SELECT id FROM users WHERE email = :email AND id != :id";
        $emailCheckStmt = $db->prepare($emailCheckQuery);
        $emailCheckStmt->bindParam(':email', $email);
        $emailCheckStmt->bindParam(':id', $userId);
        $emailCheckStmt->execute();
        
        if ($emailCheckStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already exists']);
            return;
        }
    }
    
    $currentUser = getCurrentAdminUser();
    
    // Build update query
    $updateFields = [
        'name = :name',
        'email = :email',
        'role_id = :role_id',
        'is_active = :is_active',
        'updated_by = :updated_by'
    ];
    
    $params = [
        ':name' => $name,
        ':email' => $email,
        ':role_id' => $roleId,
        ':is_active' => $isActive,
        ':updated_by' => $currentUser['id'],
        ':id' => $userId
    ];
    
    // Add password update if provided
    if (!empty($password)) {
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 6 characters']);
            return;
        }
        $updateFields[] = 'password = :password';
        $params[':password'] = password_hash($password, PASSWORD_DEFAULT);
    }
    
    $updateQuery = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    
    foreach ($params as $key => $value) {
        $updateStmt->bindValue($key, $value);
    }
    
    if ($updateStmt->execute()) {
        logAdminActivity('update_user', 'users', [
            'user_id' => $userId,
            'changes' => [
                'name' => $name,
                'email' => $email,
                'role_id' => $roleId,
                'is_active' => $isActive,
                'password_changed' => !empty($password)
            ]
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user']);
    }
}

/**
 * Delete user
 */
function handleDeleteUser($db) {
    requireAdminAuth('users.delete');
    
    $userId = (int)($_GET['id'] ?? 0);
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    $currentUser = getCurrentAdminUser();
    
    // Prevent self-deletion
    if ($userId === (int)$currentUser['id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot delete your own account']);
        return;
    }
    
    // Check if user exists
    $checkQuery = "SELECT id, name, email FROM users WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $userId);
    $checkStmt->execute();
    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }
    
    // Soft delete - just deactivate the user
    $deleteQuery = "UPDATE users SET is_active = 0, updated_by = :updated_by WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':updated_by', $currentUser['id']);
    $deleteStmt->bindParam(':id', $userId);
    
    if ($deleteStmt->execute()) {
        logAdminActivity('delete_user', 'users', [
            'user_id' => $userId,
            'user_name' => $user['name'],
            'user_email' => $user['email']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User deactivated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user']);
    }
}
?>