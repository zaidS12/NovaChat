-- User Settings Table Schema
-- Run this SQL to create/update the user_settings table

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
);

-- Add missing columns to existing user_settings table if they don't exist
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS desktop_notifications BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS allow_direct_messages BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS data_collection BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS theme_mode VARCHAR(20) DEFAULT 'system',
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20) DEFAULT 'blue',
ADD COLUMN IF NOT EXISTS font_size VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS session_timeout VARCHAR(10) DEFAULT '30',
ADD COLUMN IF NOT EXISTS login_alerts BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);