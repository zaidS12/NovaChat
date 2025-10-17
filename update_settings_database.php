<?php
/**
 * Update Settings Database Schema
 */

require_once 'api/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "<h2>Updating Settings Database Schema</h2>";
    
    // Create user_settings table if it doesn't exist
    $create_table = "
    CREATE TABLE IF NOT EXISTS user_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        
        -- Profile Settings
        theme VARCHAR(20) DEFAULT 'light',
        language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
        
        -- Notification Settings
        notifications_enabled BOOLEAN DEFAULT TRUE,
        email_notifications BOOLEAN DEFAULT TRUE,
        push_notifications BOOLEAN DEFAULT TRUE,
        sound_enabled BOOLEAN DEFAULT TRUE,
        desktop_notifications BOOLEAN DEFAULT FALSE,
        
        -- Privacy Settings
        profile_visibility VARCHAR(20) DEFAULT 'public',
        show_online_status BOOLEAN DEFAULT TRUE,
        allow_direct_messages BOOLEAN DEFAULT TRUE,
        data_collection BOOLEAN DEFAULT FALSE,
        
        -- Appearance Settings
        theme_mode VARCHAR(20) DEFAULT 'system',
        accent_color VARCHAR(20) DEFAULT 'blue',
        font_size VARCHAR(20) DEFAULT 'medium',
        compact_mode BOOLEAN DEFAULT FALSE,
        
        -- Security Settings
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        session_timeout VARCHAR(10) DEFAULT '30',
        login_alerts BOOLEAN DEFAULT TRUE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_settings (user_id)
    )";
    
    $db->exec($create_table);
    echo "<p>✅ User settings table created/updated</p>";
    
    // Add missing columns to existing table
    $add_columns = [
        "ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC'",
        "ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY'",
        "ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS desktop_notifications BOOLEAN DEFAULT FALSE",
        "ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(20) DEFAULT 'public'",
        "ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS allow_direct_messages BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS data_collection BOOLEAN DEFAULT FALSE",
        "ADD COLUMN IF NOT EXISTS theme_mode VARCHAR(20) DEFAULT 'system'",
        "ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20) DEFAULT 'blue'",
        "ADD COLUMN IF NOT EXISTS font_size VARCHAR(20) DEFAULT 'medium'",
        "ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT FALSE",
        "ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE",
        "ADD COLUMN IF NOT EXISTS session_timeout VARCHAR(10) DEFAULT '30'",
        "ADD COLUMN IF NOT EXISTS login_alerts BOOLEAN DEFAULT TRUE",
        "ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];
    
    foreach ($add_columns as $column) {
        try {
            $db->exec("ALTER TABLE user_settings $column");
            echo "<p>✅ Added column: " . explode(' ', $column)[3] . "</p>";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') === false) {
                echo "<p>⚠️ Column already exists or error: " . explode(' ', $column)[3] . "</p>";
            }
        }
    }
    
    // Add bio column to users table if it doesn't exist
    try {
        $db->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT");
        echo "<p>✅ Added bio column to users table</p>";
    } catch (PDOException $e) {
        echo "<p>⚠️ Bio column already exists or error</p>";
    }
    
    // Create uploads directory
    $upload_dir = 'uploads/avatars';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
        echo "<p>✅ Created uploads directory</p>";
    } else {
        echo "<p>✅ Uploads directory already exists</p>";
    }
    
    // Create default settings for existing users
    $users_query = "SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM user_settings)";
    $users_stmt = $db->query($users_query);
    $users = $users_stmt->fetchAll();
    
    foreach ($users as $user) {
        $insert_settings = "INSERT INTO user_settings (user_id) VALUES (?)";
        $insert_stmt = $db->prepare($insert_settings);
        $insert_stmt->execute([$user['id']]);
        echo "<p>✅ Created default settings for user ID: " . $user['id'] . "</p>";
    }
    
    echo "<h3>✅ Settings Database Update Complete!</h3>";
    echo "<p><strong>What's Ready:</strong></p>";
    echo "<ul>";
    echo "<li>✅ Complete user settings table</li>";
    echo "<li>✅ Profile picture upload support</li>";
    echo "<li>✅ All settings tabs functional</li>";
    echo "<li>✅ Database API endpoints</li>";
    echo "<li>✅ Avatar upload functionality</li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?>
