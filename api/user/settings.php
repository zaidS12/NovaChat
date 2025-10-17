<?php
/**
 * User Settings API
 * Handles saving and retrieving user settings
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Get user ID from request (GET or POST/PUT)
    if ($method === 'GET') {
        $user_id = $_GET['user_id'] ?? null;
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
        $user_id = $input['user_id'] ?? null;
    }
    
    if (!$user_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'User ID is required'
        ]);
        exit();
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetSettings($db, $user_id);
            break;
        case 'PUT':
        case 'POST':
            handleSaveSettings($db, $user_id, $input);
            break;
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

/**
 * Get user settings
 */
function handleGetSettings($db, $user_id) {
    try {
        // Get user profile data
        $user_query = "SELECT id, name, email, avatar, bio FROM users WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$user_id]);
        $user = $user_stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'User not found'
            ]);
            return;
        }
        
        // Get user settings
        $settings_query = "SELECT * FROM user_settings WHERE user_id = ?";
        $settings_stmt = $db->prepare($settings_query);
        $settings_stmt->execute([$user_id]);
        $settings = $settings_stmt->fetch();
        
        // If no settings exist, create default
        if (!$settings) {
            $default_query = "INSERT INTO user_settings (user_id) VALUES (?)";
            $default_stmt = $db->prepare($default_query);
            $default_stmt->execute([$user_id]);
            
            $settings_query = "SELECT * FROM user_settings WHERE user_id = ?";
            $settings_stmt = $db->prepare($settings_query);
            $settings_stmt->execute([$user_id]);
            $settings = $settings_stmt->fetch();
        }
        
        echo json_encode([
            'success' => true,
            'data' => [
                'profile' => [
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'avatar' => $user['avatar'],
                    'bio' => $user['bio']
                ],
                'settings' => $settings
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

/**
 * Save user settings
 */
function handleSaveSettings($db, $user_id, $input) {
    try {
        $db->beginTransaction();
        
        // Update user profile if provided
        if (isset($input['name']) || isset($input['email']) || isset($input['bio']) || isset($input['avatar'])) {
            $profile_fields = [];
            $profile_values = [];
            
            if (isset($input['name'])) {
                $profile_fields[] = "name = ?";
                $profile_values[] = $input['name'];
            }
            if (isset($input['email'])) {
                $profile_fields[] = "email = ?";
                $profile_values[] = $input['email'];
            }
            if (isset($input['bio'])) {
                $profile_fields[] = "bio = ?";
                $profile_values[] = $input['bio'];
            }
            if (isset($input['avatar'])) {
                $profile_fields[] = "avatar = ?";
                $profile_values[] = $input['avatar'];
            }
            
            if (!empty($profile_fields)) {
                $profile_values[] = $user_id;
                $profile_query = "UPDATE users SET " . implode(', ', $profile_fields) . " WHERE id = ?";
                $profile_stmt = $db->prepare($profile_query);
                $profile_stmt->execute($profile_values);
            }
        }
        
        // Update user settings
        $settings_fields = [];
        $settings_values = [];
        
        $allowed_settings = [
            'theme', 'language', 'timezone', 'date_format',
            'notifications_enabled', 'email_notifications', 'push_notifications', 
            'sound_enabled', 'desktop_notifications',
            'profile_visibility', 'show_online_status', 'allow_direct_messages', 'data_collection',
            'theme_mode', 'accent_color', 'font_size', 'compact_mode',
            'two_factor_enabled', 'session_timeout', 'login_alerts'
        ];
        
        foreach ($allowed_settings as $field) {
            if (isset($input[$field])) {
                $settings_fields[] = "$field = ?";
                $settings_values[] = $input[$field];
            }
        }
        
        if (!empty($settings_fields)) {
            $settings_values[] = $user_id;
            
            // Check if settings exist
            $check_query = "SELECT id FROM user_settings WHERE user_id = ?";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->execute([$user_id]);
            
            if ($check_stmt->rowCount() > 0) {
                // Update existing settings
                $settings_query = "UPDATE user_settings SET " . implode(', ', $settings_fields) . " WHERE user_id = ?";
            } else {
                // Insert new settings
                $settings_query = "INSERT INTO user_settings (" . implode(', ', array_map(function($field) {
                    return str_replace(' = ?', '', $field);
                }, $settings_fields)) . ", user_id) VALUES (" . str_repeat('?, ', count($settings_fields)) . "?)";
            }
            
            $settings_stmt = $db->prepare($settings_query);
            $settings_stmt->execute($settings_values);
        }
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Settings saved successfully'
        ]);
        
    } catch (Exception $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save settings: ' . $e->getMessage()
        ]);
    }
}
?>
