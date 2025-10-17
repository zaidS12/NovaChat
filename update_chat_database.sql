-- Update NovaChat Database for Chat Message Saving
-- Run this SQL to update your existing novachat_db database

USE `novachat_db`;

-- Ensure chats table exists with all necessary columns
CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT 'New Chat',
  `description` text DEFAULT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_archived` tinyint(1) DEFAULT 0,
  `chat_type` enum('personal','bot','group') DEFAULT 'bot',
  `last_message_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_chats` (`user_id`,`created_at`),
  KEY `idx_last_message` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ensure messages table exists with all necessary columns
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `message_type` enum('text','image','file','system') DEFAULT 'text',
  `is_bot` tinyint(1) DEFAULT 0,
  `is_edited` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `reply_to_message_id` int(11) DEFAULT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `attachment_size` int(11) DEFAULT NULL,
  `reactions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reactions`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reply_to_message_id` (`reply_to_message_id`),
  KEY `idx_chat_messages` (`chat_id`,`created_at`),
  KEY `idx_user_messages` (`user_id`,`created_at`),
  FULLTEXT KEY `ft_message_content` (`message`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add any missing columns to existing tables
ALTER TABLE `chats` 
ADD COLUMN IF NOT EXISTS `chat_type` enum('personal','bot','group') DEFAULT 'bot' AFTER `is_archived`,
ADD COLUMN IF NOT EXISTS `last_message_at` timestamp NOT NULL DEFAULT current_timestamp() AFTER `chat_type`;

ALTER TABLE `messages`
ADD COLUMN IF NOT EXISTS `message_type` enum('text','image','file','system') DEFAULT 'text' AFTER `message`,
ADD COLUMN IF NOT EXISTS `is_bot` tinyint(1) DEFAULT 0 AFTER `message_type`,
ADD COLUMN IF NOT EXISTS `is_edited` tinyint(1) DEFAULT 0 AFTER `is_bot`,
ADD COLUMN IF NOT EXISTS `is_deleted` tinyint(1) DEFAULT 0 AFTER `is_edited`,
ADD COLUMN IF NOT EXISTS `reply_to_message_id` int(11) DEFAULT NULL AFTER `is_deleted`,
ADD COLUMN IF NOT EXISTS `attachment_url` varchar(500) DEFAULT NULL AFTER `reply_to_message_id`,
ADD COLUMN IF NOT EXISTS `attachment_name` varchar(255) DEFAULT NULL AFTER `attachment_url`,
ADD COLUMN IF NOT EXISTS `attachment_size` int(11) DEFAULT NULL AFTER `attachment_name`,
ADD COLUMN IF NOT EXISTS `reactions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reactions`)) AFTER `attachment_size`,
ADD COLUMN IF NOT EXISTS `read_at` timestamp NULL DEFAULT NULL AFTER `reactions`;

-- Ensure foreign key constraints exist
ALTER TABLE `chats` ADD CONSTRAINT IF NOT EXISTS `chats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT IF NOT EXISTS `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT IF NOT EXISTS `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT IF NOT EXISTS `messages_ibfk_3` FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

-- Create sample chat for testing (if user exists)
INSERT IGNORE INTO `chats` (`id`, `user_id`, `title`, `description`, `chat_type`, `created_at`) VALUES 
(1, 1, 'Welcome Chat', 'Your first chat with NovaChat Assistant', 'bot', NOW());

-- Create sample welcome message
INSERT IGNORE INTO `messages` (`id`, `chat_id`, `user_id`, `message`, `message_type`, `is_bot`, `created_at`) VALUES 
(1, 1, 1, 'Welcome to NovaChat! How can I help you today?', 'text', 1, NOW());

-- Create a bot user for system messages (if it doesn't exist)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `is_admin`, `is_active`, `created_at`) VALUES 
(3, 'NovaChat Assistant', 'assistant@novachat.com', '$2y$10$dummy.hash.for.bot.user', 0, 1, NOW());

-- Update the welcome message to be from the bot user
UPDATE `messages` SET `user_id` = 3 WHERE `id` = 1 AND `is_bot` = 1;

-- Add some sample chat permissions
INSERT IGNORE INTO `permissions` (`name`, `display_name`, `description`, `module`, `action`, `category`) VALUES 
('chat.access', 'Access Chat', 'Access the chat interface', 'chat', 'access', 'chat'),
('chat.history', 'View Chat History', 'View chat message history', 'chat', 'history', 'chat'),
('chat.send', 'Send Messages', 'Send messages in chat', 'chat', 'send', 'chat'),
('chat.export', 'Export Chats', 'Export chat conversations', 'chat', 'export', 'chat');

-- Grant chat permissions to regular users (role_id = 2)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 2, p.id FROM `permissions` p WHERE p.name IN ('chat.access', 'chat.history', 'chat.send');

-- Grant chat permissions to admin users (role_id = 1)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 1, p.id FROM `permissions` p WHERE p.name LIKE 'chat.%';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_chats_user_type` ON `chats` (`user_id`, `chat_type`);
CREATE INDEX IF NOT EXISTS `idx_messages_bot` ON `messages` (`is_bot`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_messages_type` ON `messages` (`message_type`, `created_at`);

-- Update table statistics
ANALYZE TABLE `chats`;
ANALYZE TABLE `messages`;

-- Show success message
SELECT 'Database updated successfully for chat message saving!' as Status;
