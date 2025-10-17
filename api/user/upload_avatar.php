<?php
/**
 * Profile Picture Upload API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? null;
    $image_data = $input['image_data'] ?? null;
    
    if (!$user_id || !$image_data) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'User ID and image data are required'
        ]);
        exit();
    }
    
    // Validate base64 image data
    if (!preg_match('/^data:image\/(\w+);base64,/', $image_data, $type)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid image format'
        ]);
        exit();
    }
    
    $image_data = substr($image_data, strpos($image_data, ',') + 1);
    $image_data = base64_decode($image_data);
    
    if ($image_data === false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid image data'
        ]);
        exit();
    }
    
    // Create uploads directory if it doesn't exist
    $upload_dir = '../uploads/avatars/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    // Generate unique filename
    $file_extension = $type[1] ?? 'jpg';
    $filename = 'avatar_' . $user_id . '_' . time() . '.' . $file_extension;
    $file_path = $upload_dir . $filename;
    
    // Save image file
    if (file_put_contents($file_path, $image_data)) {
        // Update user avatar in database
        $avatar_url = 'api/uploads/avatars/' . $filename;
        
        $update_query = "UPDATE users SET avatar = ? WHERE id = ?";
        $update_stmt = $db->prepare($update_query);
        
        if ($update_stmt->execute([$avatar_url, $user_id])) {
            echo json_encode([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'data' => [
                    'avatar_url' => $avatar_url
                ]
            ]);
        } else {
            // Remove uploaded file if database update fails
            unlink($file_path);
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update avatar in database'
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to upload image'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
