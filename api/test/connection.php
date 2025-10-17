<?php
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Test database connection
    $query = "SELECT COUNT(*) as user_count FROM users";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch();
    
    // Test tables exist
    $tables_query = "SHOW TABLES";
    $tables_stmt = $db->prepare($tables_query);
    $tables_stmt->execute();
    $tables = $tables_stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful!',
        'database' => 'novachat_db',
        'user_count' => $result['user_count'],
        'tables' => $tables,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>