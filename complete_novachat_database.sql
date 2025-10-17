-- NovaChat Complete Database Schema
-- Run this SQL to create the complete NovaChat database from scratch
-- Database: novachat_db

-- Create database
CREATE DATABASE IF NOT EXISTS `novachat_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `novachat_db`;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- TABLE STRUCTURE
-- ============================================

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_roles_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create permissions table
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `display_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT 'general',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `theme_preference` enum('light','dark','system') DEFAULT 'system',
  `language` varchar(10) DEFAULT 'en',
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `email_notifications` tinyint(1) DEFAULT 1,
  `sound_enabled` tinyint(1) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role_id` int(11) DEFAULT 2,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `session_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_active` (`is_active`),
  KEY `idx_users_admin` (`is_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create chats table
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

-- Create messages table
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

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS `chat_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','member') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `left_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chat_user` (`chat_id`,`user_id`),
  KEY `idx_chat_participants` (`chat_id`,`is_active`),
  KEY `idx_user_chats` (`user_id`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS `user_activity_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_activity` (`user_id`,`created_at`),
  KEY `idx_action_module` (`action`,`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS `user_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `theme` varchar(20) DEFAULT 'light',
  `language` varchar(10) DEFAULT 'en',
  `timezone` varchar(50) DEFAULT 'UTC',
  `date_format` varchar(20) DEFAULT 'MM/DD/YYYY',
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `email_notifications` tinyint(1) DEFAULT 1,
  `push_notifications` tinyint(1) DEFAULT 1,
  `sound_enabled` tinyint(1) DEFAULT 1,
  `desktop_notifications` tinyint(1) DEFAULT 0,
  `profile_visibility` varchar(20) DEFAULT 'public',
  `show_online_status` tinyint(1) DEFAULT 1,
  `allow_direct_messages` tinyint(1) DEFAULT 1,
  `data_collection` tinyint(1) DEFAULT 0,
  `theme_mode` varchar(20) DEFAULT 'system',
  `accent_color` varchar(20) DEFAULT 'blue',
  `font_size` varchar(20) DEFAULT 'medium',
  `compact_mode` tinyint(1) DEFAULT 0,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `session_timeout` varchar(10) DEFAULT '30',
  `login_alerts` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_settings` (`user_id`),
  KEY `idx_user_settings_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

ALTER TABLE `users` ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
ALTER TABLE `chats` ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `user_activity_log` ADD CONSTRAINT `user_activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- ============================================
-- DEFAULT DATA INSERTION
-- ============================================

-- Insert default roles
INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_active`) VALUES 
(1, 'super_admin', 'Super Administrator', 'Full system access with all permissions', 1),
(2, 'user', 'Regular User', 'Standard user with basic chat access', 1),
(3, 'limited_user', 'Limited User', 'Restricted user with limited feature access', 1),
(4, 'moderator', 'Moderator', 'Can manage users and moderate content', 1),
(5, 'viewer', 'Viewer', 'Read-only access to specific modules', 1);

-- Insert default permissions
INSERT INTO `permissions` (`name`, `display_name`, `description`, `module`, `action`, `category`) VALUES 
-- Dashboard permissions
('dashboard.view', 'View Dashboard', 'Access to main dashboard', 'dashboard', 'view', 'dashboard'),
('dashboard.analytics', 'View Analytics', 'Access to analytics and reports', 'dashboard', 'view', 'dashboard'),

-- User management permissions
('users.view', 'View Users', 'View user list and profiles', 'users', 'view', 'users'),
('users.create', 'Create Users', 'Create new user accounts', 'users', 'create', 'users'),
('users.edit', 'Edit Users', 'Modify user information and settings', 'users', 'edit', 'users'),
('users.delete', 'Delete Users', 'Remove user accounts', 'users', 'delete', 'users'),
('users.manage_roles', 'Manage User Roles', 'Assign and modify user roles', 'users', 'manage', 'users'),

-- Chat permissions
('chat.access', 'Access Chat', 'Use chat functionality', 'chat', 'view', 'chat'),
('chat.history', 'View Chat History', 'Access chat conversation history', 'chat', 'view', 'chat'),
('chat.export', 'Export Chat Data', 'Export chat conversations', 'chat', 'manage', 'chat'),

-- Settings permissions
('settings.view', 'View Settings', 'Access settings pages', 'settings', 'view', 'settings'),
('settings.edit', 'Edit Settings', 'Modify application settings', 'settings', 'edit', 'settings'),
('settings.system', 'System Settings', 'Access system-level settings', 'settings', 'manage', 'settings'),

-- Profile permissions
('profile.view', 'View Profile', 'View own profile information', 'profile', 'view', 'profile'),
('profile.edit', 'Edit Profile', 'Modify own profile information', 'profile', 'edit', 'profile'),

-- Admin permissions
('admin.panel', 'Admin Panel Access', 'Access to admin panel', 'admin', 'view', 'admin'),
('admin.logs', 'View System Logs', 'Access system logs and audit trails', 'admin', 'view', 'admin'),
('admin.backup', 'System Backup', 'Create and manage system backups', 'admin', 'manage', 'admin');

-- Assign permissions to roles
-- Super Admin gets all permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 1, id FROM permissions;

-- Regular User permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 2, id FROM permissions WHERE name IN (
    'dashboard.view',
    'chat.access',
    'chat.history',
    'profile.view',
    'profile.edit',
    'settings.view'
);

-- Limited User permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 3, id FROM permissions WHERE name IN (
    'chat.access',
    'profile.view'
);

-- Moderator permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 4, id FROM permissions WHERE name IN (
    'dashboard.view',
    'dashboard.analytics',
    'users.view',
    'users.edit',
    'chat.access',
    'chat.history',
    'chat.export',
    'profile.view',
    'profile.edit',
    'settings.view'
);

-- Viewer permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) 
SELECT 5, id FROM permissions WHERE name IN (
    'dashboard.view',
    'users.view',
    'profile.view',
    'settings.view'
);

-- Insert default users
-- Admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role_id`, `is_admin`, `bio`) VALUES 
('System Administrator', 'admin@novachat.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, 'System Administrator'),
('John Doe', 'john@example.com', '$2y$10$example_hashed_password', 2, 0, 'Welcome to NovaChat!'),
('Jane Smith', 'jane@example.com', '$2y$10$example_hashed_password', 2, 0, 'AI enthusiast and developer'),
('NovaBot', 'bot@novachat.com', '$2y$10$example_hashed_password', 2, 0, 'Your friendly AI assistant'),
('Bob Wilson', 'bob@example.com', '$2y$10$example_hashed_password', 2, 0, 'Tech enthusiast');

-- Insert sample chats
INSERT INTO `chats` (`user_id`, `title`, `chat_type`) VALUES 
(1, 'Welcome Chat', 'bot'),
(2, 'General Discussion', 'personal');

-- Insert sample messages
INSERT INTO `messages` (`chat_id`, `user_id`, `message`, `is_bot`) VALUES 
(1, 4, 'Welcome to NovaChat! How can I help you today?', 1),
(1, 1, 'Hello! This looks amazing!', 0),
(2, 2, 'Testing the chat functionality', 0);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
-- Database creation completed successfully!
-- Default admin login: admin@novachat.com / admin123
-- Please change the admin password after first login for security.