-- Simple Chat Database Update
-- Run this in phpMyAdmin or MySQL command line

USE novachat_db;

-- Ensure chats table has all required columns
ALTER TABLE chats 
ADD COLUMN IF NOT EXISTS chat_type ENUM('personal','bot','group') DEFAULT 'bot' AFTER is_archived,
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER chat_type;

-- Ensure messages table has all required columns  
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS message_type ENUM('text','image','file','system') DEFAULT 'text' AFTER message,
ADD COLUMN IF NOT EXISTS is_bot TINYINT(1) DEFAULT 0 AFTER message_type,
ADD COLUMN IF NOT EXISTS is_edited TINYINT(1) DEFAULT 0 AFTER is_bot,
ADD COLUMN IF NOT EXISTS is_deleted TINYINT(1) DEFAULT 0 AFTER is_edited,
ADD COLUMN IF NOT EXISTS reply_to_message_id INT(11) DEFAULT NULL AFTER is_deleted,
ADD COLUMN IF NOT EXISTS attachment_url VARCHAR(500) DEFAULT NULL AFTER reply_to_message_id,
ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255) DEFAULT NULL AFTER attachment_url,
ADD COLUMN IF NOT EXISTS attachment_size INT(11) DEFAULT NULL AFTER attachment_name,
ADD COLUMN IF NOT EXISTS reactions LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL AFTER attachment_size,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL DEFAULT NULL AFTER reactions;

-- Create a bot user for system messages
INSERT IGNORE INTO users (id, name, email, password, is_admin, is_active, created_at) 
VALUES (3, 'NovaChat Assistant', 'assistant@novachat.com', '$2y$10$dummy.hash.for.bot.user', 0, 1, NOW());

-- Create a sample chat for user 1
INSERT IGNORE INTO chats (id, user_id, title, description, chat_type, created_at) 
VALUES (1, 1, 'Welcome Chat', 'Your first chat with NovaChat Assistant', 'bot', NOW());

-- Create a welcome message
INSERT IGNORE INTO messages (id, chat_id, user_id, message, message_type, is_bot, created_at) 
VALUES (1, 1, 3, 'Welcome to NovaChat! How can I help you today?', 'text', 1, NOW());

-- Add chat permissions
INSERT IGNORE INTO permissions (name, display_name, description, module, action, category) VALUES 
('chat.access', 'Access Chat', 'Access the chat interface', 'chat', 'access', 'chat'),
('chat.history', 'View Chat History', 'View chat message history', 'chat', 'history', 'chat'),
('chat.send', 'Send Messages', 'Send messages in chat', 'chat', 'send', 'chat');

-- Grant permissions to users
INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions WHERE name LIKE 'chat.%';

INSERT IGNORE INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE name LIKE 'chat.%';

SELECT 'Database updated successfully for chat functionality!' as Status;
