<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../middleware/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Use the middleware to verify admin access
    $user = requireAdminAuth();
    
    if ($user) {
        // Get updated user permissions
        $middleware = new AdminAuthMiddleware();
        $permissions = $middleware->getUserPermissions($user['id']);
        
        $permissionNames = array_column($permissions, 'name');
        
        echo json_encode([
            'success' => true,
            'message' => 'Token is valid',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role_name'],
                'role_display' => $user['role_display_name'],
                'is_admin' => (bool)$user['is_admin'],
                'permissions' => $permissionNames
            ]
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>