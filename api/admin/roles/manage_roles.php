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
            handleGetRoles($db);
            break;
        case 'POST':
            handleCreateRole($db);
            break;
        case 'PUT':
            handleUpdateRole($db);
            break;
        case 'DELETE':
            handleDeleteRole($db);
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
 * Get all roles with their permissions
 */
function handleGetRoles($db) {
    requireAdminAuth('users.manage_roles');
    
    // Get roles
    $rolesQuery = "SELECT r.*, COUNT(u.id) as user_count
                   FROM roles r
                   LEFT JOIN users u ON r.id = u.role_id AND u.is_active = 1
                   GROUP BY r.id
                   ORDER BY r.display_name";
    
    $rolesStmt = $db->prepare($rolesQuery);
    $rolesStmt->execute();
    $roles = $rolesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get permissions for each role
    foreach ($roles as &$role) {
        $permQuery = "SELECT p.name
                      FROM role_permissions rp
                      JOIN permissions p ON rp.permission_id = p.id
                      WHERE rp.role_id = :role_id";
        
        $permStmt = $db->prepare($permQuery);
        $permStmt->bindParam(':role_id', $role['id']);
        $permStmt->execute();
        
        $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
        $role['permissions'] = $permissions;
    }
    
    logAdminActivity('view_roles', 'roles');
    
    echo json_encode([
        'success' => true,
        'data' => [
            'roles' => $roles
        ]
    ]);
}

/**
 * Create new role
 */
function handleCreateRole($db) {
    requireAdminAuth('users.manage_roles');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    $name = trim($input['name'] ?? '');
    $displayName = trim($input['display_name'] ?? '');
    $description = trim($input['description'] ?? '');
    
    if (empty($name) || empty($displayName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and display name are required']);
        return;
    }
    
    // Check if role name already exists
    $checkQuery = "SELECT id FROM roles WHERE name = :name";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':name', $name);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Role name already exists']);
        return;
    }
    
    // Insert role
    $insertQuery = "INSERT INTO roles (name, display_name, description, is_active, created_at) 
                    VALUES (:name, :display_name, :description, 1, NOW())";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':name', $name);
    $insertStmt->bindParam(':display_name', $displayName);
    $insertStmt->bindParam(':description', $description);
    
    if ($insertStmt->execute()) {
        $roleId = $db->lastInsertId();
        
        logAdminActivity('create_role', 'roles', [
            'role_id' => $roleId,
            'name' => $name,
            'display_name' => $displayName
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Role created successfully',
            'role_id' => $roleId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create role']);
    }
}

/**
 * Update existing role
 */
function handleUpdateRole($db) {
    requireAdminAuth('users.manage_roles');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    $roleId = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $displayName = trim($input['display_name'] ?? '');
    $description = trim($input['description'] ?? '');
    $isActive = (bool)($input['is_active'] ?? true);
    
    if (!$roleId || empty($name) || empty($displayName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Role ID, name, and display name are required']);
        return;
    }
    
    // Check if role exists
    $checkQuery = "SELECT id, name FROM roles WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $roleId);
    $checkStmt->execute();
    $existingRole = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existingRole) {
        http_response_code(404);
        echo json_encode(['error' => 'Role not found']);
        return;
    }
    
    // Check if name is taken by another role
    if ($existingRole['name'] !== $name) {
        $nameCheckQuery = "SELECT id FROM roles WHERE name = :name AND id != :id";
        $nameCheckStmt = $db->prepare($nameCheckQuery);
        $nameCheckStmt->bindParam(':name', $name);
        $nameCheckStmt->bindParam(':id', $roleId);
        $nameCheckStmt->execute();
        
        if ($nameCheckStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Role name already exists']);
            return;
        }
    }
    
    // Update role
    $updateQuery = "UPDATE roles SET 
                    name = :name, 
                    display_name = :display_name, 
                    description = :description, 
                    is_active = :is_active,
                    updated_at = NOW()
                    WHERE id = :id";
    
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':name', $name);
    $updateStmt->bindParam(':display_name', $displayName);
    $updateStmt->bindParam(':description', $description);
    $updateStmt->bindParam(':is_active', $isActive, PDO::PARAM_BOOL);
    $updateStmt->bindParam(':id', $roleId);
    
    if ($updateStmt->execute()) {
        logAdminActivity('update_role', 'roles', [
            'role_id' => $roleId,
            'changes' => [
                'name' => $name,
                'display_name' => $displayName,
                'description' => $description,
                'is_active' => $isActive
            ]
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Role updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update role']);
    }
}

/**
 * Delete role (soft delete - deactivate)
 */
function handleDeleteRole($db) {
    requireAdminAuth('users.manage_roles');
    
    $roleId = (int)($_GET['id'] ?? 0);
    
    if (!$roleId) {
        http_response_code(400);
        echo json_encode(['error' => 'Role ID is required']);
        return;
    }
    
    // Check if role exists
    $checkQuery = "SELECT id, name, display_name FROM roles WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $roleId);
    $checkStmt->execute();
    $role = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$role) {
        http_response_code(404);
        echo json_encode(['error' => 'Role not found']);
        return;
    }
    
    // Prevent deletion of system roles
    $systemRoles = ['super_admin', 'user'];
    if (in_array($role['name'], $systemRoles)) {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot delete system roles']);
        return;
    }
    
    // Check if role is assigned to users
    $userCheckQuery = "SELECT COUNT(*) as count FROM users WHERE role_id = :role_id AND is_active = 1";
    $userCheckStmt = $db->prepare($userCheckQuery);
    $userCheckStmt->bindParam(':role_id', $roleId);
    $userCheckStmt->execute();
    $userCount = $userCheckStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($userCount > 0) {
        http_response_code(400);
        echo json_encode([
            'error' => "Cannot delete role. It is assigned to $userCount active user(s). Please reassign users first."
        ]);
        return;
    }
    
    // Soft delete - deactivate the role
    $deleteQuery = "UPDATE roles SET is_active = 0, updated_at = NOW() WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $roleId);
    
    if ($deleteStmt->execute()) {
        logAdminActivity('delete_role', 'roles', [
            'role_id' => $roleId,
            'role_name' => $role['name'],
            'role_display_name' => $role['display_name']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Role deactivated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete role']);
    }
}
?>