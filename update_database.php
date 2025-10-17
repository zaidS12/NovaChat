<?php
/**
 * NovaChat Database Update Script
 * This script automatically updates your database for chat message saving functionality
 */

require_once 'api/config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Get database connection with buffered queries
    $database = new Database();
    $db = $database->getConnection();
    
    // Enable buffered queries to avoid the error
    $db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    
    echo json_encode([
        'status' => 'info',
        'message' => 'Starting database update...'
    ]);
    
    // Read the SQL update file
    $sql_file = 'update_chat_database.sql';
    
    if (!file_exists($sql_file)) {
        throw new Exception('SQL update file not found');
    }
    
    $sql_content = file_get_contents($sql_file);
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql_content)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^(--|\/\*)/', $stmt);
        }
    );
    
    $executed_statements = 0;
    $errors = [];
    
    // Execute each SQL statement
    foreach ($statements as $statement) {
        try {
            if (!empty($statement)) {
                $db->exec($statement);
                $executed_statements++;
            }
        } catch (PDOException $e) {
            // Log error but continue with other statements
            $errors[] = [
                'statement' => substr($statement, 0, 100) . '...',
                'error' => $e->getMessage()
            ];
        }
    }
    
    // Test the updated database
    $test_query = "SELECT COUNT(*) as message_count FROM messages";
    $test_stmt = $db->prepare($test_query);
    $test_stmt->execute();
    $message_count = $test_stmt->fetch(PDO::FETCH_ASSOC)['message_count'];
    
    $test_query2 = "SELECT COUNT(*) as chat_count FROM chats";
    $test_stmt2 = $db->prepare($test_query2);
    $test_stmt2->execute();
    $chat_count = $test_stmt2->fetch(PDO::FETCH_ASSOC)['chat_count'];
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Database updated successfully!',
        'details' => [
            'executed_statements' => $executed_statements,
            'total_messages' => $message_count,
            'total_chats' => $chat_count,
            'errors' => $errors
        ],
        'next_steps' => [
            '1. Start your React development server (npm run dev)',
            '2. Open the chatbot and send a test message',
            '3. Refresh the page to verify messages are saved',
            '4. Check your database for the saved messages'
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database update failed: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>
