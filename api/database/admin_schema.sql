-- NovaChat Admin System Database Schema
-- Run this SQL to create the admin system tables

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL, -- dashboard, chat, users, settings, etc.
    action VARCHAR(50) NOT NULL, -- view, create, edit, delete, manage
    category VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Add role_id column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INT DEFAULT 2;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_by INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add foreign key constraint for role_id
ALTER TABLE users ADD CONSTRAINT fk_users_role 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Insert default roles
INSERT INTO roles (name, display_name, description) VALUES 
('super_admin', 'Super Administrator', 'Full system access with all permissions'),
('user', 'Regular User', 'Standard user with basic chat access'),
('limited_user', 'Limited User', 'Restricted user with limited feature access'),
('moderator', 'Moderator', 'Can manage users and moderate content'),
('viewer', 'Viewer', 'Read-only access to specific modules');

-- Insert default permissions
INSERT INTO permissions (name, display_name, description, module, action) VALUES 
-- Dashboard permissions
('dashboard.view', 'View Dashboard', 'Access to main dashboard', 'dashboard', 'view'),
('dashboard.analytics', 'View Analytics', 'Access to analytics and reports', 'dashboard', 'view'),

-- User management permissions
('users.view', 'View Users', 'View user list and profiles', 'users', 'view'),
('users.create', 'Create Users', 'Create new user accounts', 'users', 'create'),
('users.edit', 'Edit Users', 'Modify user information and settings', 'users', 'edit'),
('users.delete', 'Delete Users', 'Remove user accounts', 'users', 'delete'),
('users.manage_roles', 'Manage User Roles', 'Assign and modify user roles', 'users', 'manage'),

-- Chat permissions
('chat.access', 'Access Chat', 'Use chat functionality', 'chat', 'view'),
('chat.history', 'View Chat History', 'Access chat conversation history', 'chat', 'view'),
('chat.export', 'Export Chat Data', 'Export chat conversations', 'chat', 'manage'),

-- Settings permissions
('settings.view', 'View Settings', 'Access settings pages', 'settings', 'view'),
('settings.edit', 'Edit Settings', 'Modify application settings', 'settings', 'edit'),
('settings.system', 'System Settings', 'Access system-level settings', 'settings', 'manage'),

-- Profile permissions
('profile.view', 'View Profile', 'View own profile information', 'profile', 'view'),
('profile.edit', 'Edit Profile', 'Modify own profile information', 'profile', 'edit'),

-- Admin permissions
('admin.panel', 'Admin Panel Access', 'Access to admin panel', 'admin', 'view'),
('admin.logs', 'View System Logs', 'Access system logs and audit trails', 'admin', 'view'),
('admin.backup', 'System Backup', 'Create and manage system backups', 'admin', 'manage');

-- Assign permissions to roles
-- Super Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Regular User permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE name IN (
    'dashboard.view',
    'chat.access',
    'chat.history',
    'profile.view',
    'profile.edit',
    'settings.view'
);

-- Limited User permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions WHERE name IN (
    'chat.access',
    'profile.view'
);

-- Moderator permissions
INSERT INTO role_permissions (role_id, permission_id) 
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
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 5, id FROM permissions WHERE name IN (
    'dashboard.view',
    'users.view',
    'profile.view',
    'settings.view'
);

-- Create user activity log table
CREATE TABLE IF NOT EXISTS user_activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, created_at),
    INDEX idx_action_module (action, module)
);

-- Update existing users to have default role
UPDATE users SET role_id = 2 WHERE role_id IS NULL;

-- Create first admin user (update this with your desired admin credentials)
-- Password: admin123 (change this immediately after setup)
INSERT INTO users (name, email, password, role_id, is_admin, created_at) VALUES 
('System Administrator', 'admin@novachat.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, TRUE, NOW())
ON DUPLICATE KEY UPDATE role_id = 1, is_admin = TRUE;

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_admin ON users(is_admin);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_roles_active ON roles(is_active);