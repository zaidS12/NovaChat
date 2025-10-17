<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';
require_once '../middleware/auth_middleware.php';

// Require admin authentication and backup permission
requireAdminAuth(['admin.backup']);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get backup data
    $backupData = [
        'metadata' => [
            'backup_date' => date('Y-m-d H:i:s'),
            'version' => '1.0',
            'generated_by' => $GLOBALS['current_admin_user']['name'] ?? 'System'
        ],
        'users' => [],
        'roles' => [],
        'permissions' => [],
        'role_permissions' => [],
        'system_settings' => []
    ];
    
    // Export users (excluding sensitive data like passwords)
    $query = "SELECT id, name, email, role_id, is_admin, is_active, created_at, updated_at, last_login FROM users ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $backupData['users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Export roles
    $query = "SELECT * FROM roles ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $backupData['roles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Export permissions
    $query = "SELECT * FROM permissions ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $backupData['permissions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Export role permissions
    $query = "SELECT * FROM role_permissions ORDER BY role_id, permission_id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $backupData['role_permissions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if chat tables exist and export chat data
    $query = "SHOW TABLES LIKE 'conversations'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        $query = "SELECT id, user_id, title, created_at, updated_at FROM conversations ORDER BY id";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $backupData['conversations'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $query = "SELECT id, conversation_id, message, sender, created_at FROM messages ORDER BY id";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $backupData['messages'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Check if activity log exists
    $query = "SHOW TABLES LIKE 'user_activity_log'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        $query = "SELECT * FROM user_activity_log WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) ORDER BY created_at DESC LIMIT 1000";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $backupData['activity_log'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Add statistics
    $stats = [];
    
    // Count users
    $query = "SELECT COUNT(*) as total_users, 
                     COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
                     COUNT(CASE WHEN is_admin = 1 THEN 1 END) as admin_users
              FROM users";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['users'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Count roles and permissions
    $query = "SELECT COUNT(*) as total_roles FROM roles WHERE is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['roles'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $query = "SELECT COUNT(*) as total_permissions FROM permissions WHERE is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['permissions'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $backupData['statistics'] = $stats;
    
    // Log the backup action
    logAdminActivity('backup_created', 'system', [
        'backup_size' => strlen(json_encode($backupData)),
        'tables_included' => array_keys($backupData)
    ]);
    
    // Return backup data
    echo json_encode([
        'success' => true,
        'message' => 'Backup created successfully',
        'data' => $backupData,
        'filename' => 'novachat_backup_' . date('Y-m-d_H-i-s') . '.json'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Backup failed: ' . $e->getMessage()
    ]);
}
?>