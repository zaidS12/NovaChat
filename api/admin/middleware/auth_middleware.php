<?php
/**
 * Admin Authentication Middleware
 * Protects admin routes and verifies user permissions
 */

require_once '../../config/database.php';

class AdminAuthMiddleware {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    /**
     * Verify admin session and permissions
     */
    public function verifyAdminAccess($requiredPermission = null) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            $this->sendUnauthorized('Missing or invalid authorization header');
            return false;
        }
        
        $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
        
        if (empty($token)) {
            $this->sendUnauthorized('Missing session token');
            return false;
        }
        
        $user = $this->getUserByToken($token);
        
        if (!$user) {
            $this->sendUnauthorized('Invalid or expired session');
            return false;
        }
        
        if (!$user['is_active']) {
            $this->sendForbidden('Account is deactivated');
            return false;
        }
        
        // Check if user has admin access
        if (!$user['is_admin'] && !$this->hasPermission($user['id'], 'admin.panel')) {
            $this->sendForbidden('Admin access required');
            return false;
        }
        
        // Check specific permission if required
        if ($requiredPermission && !$this->hasPermission($user['id'], $requiredPermission)) {
            $this->sendForbidden('Insufficient permissions');
            return false;
        }
        
        // Set global user data for use in protected routes
        $GLOBALS['current_admin_user'] = $user;
        
        return $user;
    }
    
    /**
     * Get user by session token
     */
    private function getUserByToken($token) {
        $query = "SELECT u.*, r.name as role_name, r.display_name as role_display_name
                  FROM users u 
                  LEFT JOIN roles r ON u.role_id = r.id
                  WHERE u.session_token = :token AND u.is_active = 1";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Check if user has specific permission
     */
    private function hasPermission($userId, $permission) {
        $query = "SELECT COUNT(*) as count
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  JOIN role_permissions rp ON r.id = rp.role_id
                  JOIN permissions p ON rp.permission_id = p.id
                  WHERE u.id = :user_id AND p.name = :permission";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':permission', $permission);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] > 0;
    }
    
    /**
     * Get all permissions for a user
     */
    public function getUserPermissions($userId) {
        $query = "SELECT p.name, p.display_name, p.module, p.action
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  JOIN role_permissions rp ON r.id = rp.role_id
                  JOIN permissions p ON rp.permission_id = p.id
                  WHERE u.id = :user_id
                  ORDER BY p.module, p.action";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Log admin activity
     */
    public function logActivity($action, $module, $details = null) {
        if (!isset($GLOBALS['current_admin_user'])) {
            return;
        }
        
        $userId = $GLOBALS['current_admin_user']['id'];
        
        $query = "INSERT INTO user_activity_log (user_id, action, module, details, ip_address, user_agent) 
                  VALUES (:user_id, :action, :module, :details, :ip, :user_agent)";
        
        $stmt = $this->db->prepare($query);
        $detailsJson = json_encode($details);
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':module', $module);
        $stmt->bindParam(':details', $detailsJson);
        $stmt->bindParam(':ip', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->execute();
    }
    
    /**
     * Send unauthorized response
     */
    private function sendUnauthorized($message) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
        exit;
    }
    
    /**
     * Send forbidden response
     */
    private function sendForbidden($message) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
        exit;
    }
}

/**
 * Helper function to require admin authentication
 */
function requireAdminAuth($requiredPermission = null) {
    $middleware = new AdminAuthMiddleware();
    return $middleware->verifyAdminAccess($requiredPermission);
}

/**
 * Helper function to get current admin user
 */
function getCurrentAdminUser() {
    return $GLOBALS['current_admin_user'] ?? null;
}

/**
 * Helper function to log admin activity
 */
function logAdminActivity($action, $module, $details = null) {
    $middleware = new AdminAuthMiddleware();
    $middleware->logActivity($action, $module, $details);
}
?>