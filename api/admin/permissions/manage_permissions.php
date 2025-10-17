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
            handleGetPermissions($db);
            break;
        case 'POST':
            handleAssignPermissions($db);
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
 * Get all permissions grouped by category
 */
function handleGetPermissions($db) {
    requireAdminAuth('users.manage_roles');
    
    $query = "SELECT id, name, display_name, description, category 
              FROM permissions 
              WHERE is_active = 1 
              ORDER BY category, display_name";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $permissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group permissions by category
    $groupedPermissions = [];
    foreach ($permissions as $permission) {
        $category = $permission['category'] ?: 'General';
        if (!isset($groupedPermissions[$category])) {
            $groupedPermissions[$category] = [];
        }
        $groupedPermissions[$category][] = $permission;
    }
    
    logAdminActivity('view_permissions', 'permissions');
    
    echo json_encode([
        'success' => true,
        'data' => [
            'permissions' => $groupedPermissions
        ]
    ]);
}

/**
 * Assign/Update permissions for a role
 */
function handleAssignPermissions($db) {
    requireAdminAuth('users.manage_roles');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    $roleId = (int)($input['role_id'] ?? 0);
    $permissions = $input['permissions'] ?? [];
    
    if (!$roleId) {
        http_response_code(400);
        echo json_encode(['error' => 'Role ID is required']);
        return;
    }
    
    if (!is_array($permissions)) {
        http_response_code(400);
        echo json_encode(['error' => 'Permissions must be an array']);
        return;
    }
    
    // Check if role exists
    $roleQuery = "SELECT id, name, display_name FROM roles WHERE id = :role_id AND is_active = 1";
    $roleStmt = $db->prepare($roleQuery);
    $roleStmt->bindParam(':role_id', $roleId);
    $roleStmt->execute();
    $role = $roleStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$role) {
        http_response_code(404);
        echo json_encode(['error' => 'Role not found']);
        return;
    }
    
    // Validate permissions exist
    if (!empty($permissions)) {
        $placeholders = str_repeat('?,', count($permissions) - 1) . '?';
        $permQuery = "SELECT name FROM permissions WHERE name IN ($placeholders) AND is_active = 1";
        $permStmt = $db->prepare($permQuery);
        $permStmt->execute($permissions);
        $validPermissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
        
        $invalidPermissions = array_diff($permissions, $validPermissions);
        if (!empty($invalidPermissions)) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Invalid permissions: ' . implode(', ', $invalidPermissions)
            ]);
            return;
        }
    }
    
    try {
        $db->beginTransaction();
        
        // Get current permissions for logging
        $currentPermQuery = "SELECT p.name 
                            FROM role_permissions rp 
                            JOIN permissions p ON rp.permission_id = p.id 
                            WHERE rp.role_id = :role_id";
        $currentPermStmt = $db->prepare($currentPermQuery);
        $currentPermStmt->bindParam(':role_id', $roleId);
        $currentPermStmt->execute();
        $currentPermissions = $currentPermStmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Remove all current permissions for this role
        $deleteQuery = "DELETE FROM role_permissions WHERE role_id = :role_id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':role_id', $roleId);
        $deleteStmt->execute();
        
        // Add new permissions
        if (!empty($permissions)) {
            $insertQuery = "INSERT INTO role_permissions (role_id, permission_id, created_at) 
                           SELECT :role_id, p.id, NOW() 
                           FROM permissions p 
                           WHERE p.name = :permission_name AND p.is_active = 1";
            $insertStmt = $db->prepare($insertQuery);
            
            foreach ($permissions as $permissionName) {
                $insertStmt->bindParam(':role_id', $roleId);
                $insertStmt->bindParam(':permission_name', $permissionName);
                $insertStmt->execute();
            }
        }
        
        $db->commit();
        
        // Log the changes
        $addedPermissions = array_diff($permissions, $currentPermissions);
        $removedPermissions = array_diff($currentPermissions, $permissions);
        
        logAdminActivity('update_role_permissions', 'roles', [
            'role_id' => $roleId,
            'role_name' => $role['name'],
            'added_permissions' => $addedPermissions,
            'removed_permissions' => $removedPermissions,
            'total_permissions' => count($permissions)
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Permissions updated successfully',
            'data' => [
                'role_id' => $roleId,
                'permissions_count' => count($permissions),
                'added' => count($addedPermissions),
                'removed' => count($removedPermissions)
            ]
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update permissions: ' . $e->getMessage()]);
    }
}
?>