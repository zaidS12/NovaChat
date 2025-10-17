/**
 * Utility functions for handling user permissions and access control
 */

import { Activity, MessageSquare, Users, Settings, User, Shield } from 'lucide-react'

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  
  // Super admin or admin users have all permissions
  if (user.is_admin || user.role === 'super_admin') {
    return true;
  }
  
  return user.permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object with permissions array
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  // Super admin or admin users have all permissions
  if (user.is_admin || user.role === 'super_admin') {
    return true;
  }
  
  return permissions.some(permission => user.permissions?.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object with permissions array
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  // Super admin or admin users have all permissions
  if (user.is_admin || user.role === 'super_admin') {
    return true;
  }
  
  return permissions.every(permission => user.permissions?.includes(permission));
};

/**
 * Get navigation items based on user permissions
 * @param {Object} user - User object with permissions
 * @returns {Array} Array of navigation items user can access
 */
export const getNavigationItems = (user) => {
  const allItems = [
    {
      icon: Activity,
      label: 'Dashboard',
      path: '/dashboard',
      permission: 'dashboard.view'
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      path: '/chat',
      permission: 'chat.access'
    },
    {
      icon: Users,
      label: 'Users',
      path: '/users',
      permission: 'users.view'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      permission: 'settings.view'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      permission: 'profile.view'
    },
    {
      icon: Shield,
      label: 'Admin Panel',
      path: '/admin',
      permission: 'admin.panel',
      adminOnly: true
    }
  ];
  
  // If no user or no permissions, show basic navigation for authenticated users
  if (!user || !user.permissions) {
    return allItems.filter(item => 
      ['Dashboard', 'Chat', 'Settings', 'Profile'].includes(item.label)
    );
  }
  
  return allItems.filter(item => {
    // Always show profile to authenticated users
    if (item.path === '/profile') return true;
    
    // Check if user has required permission
    return hasPermission(user, item.permission);
  });
};

/**
 * Check if user can access a specific route
 * @param {Object} user - User object with permissions
 * @param {string} route - Route path to check
 * @returns {boolean}
 */
export const canAccessRoute = (user, route) => {
  const routePermissions = {
    '/dashboard': 'dashboard.view',
    '/chat': 'chat.access',
    '/users': 'users.view',
    '/settings': 'settings.view',
    '/profile': 'profile.view',
    '/admin': 'admin.panel'
  };
  
  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return true; // Allow access to routes without specific permissions
  
  return hasPermission(user, requiredPermission);
};

/**
 * Get user role display information
 * @param {Object} user - User object
 * @returns {Object} Role display info
 */
export const getUserRoleInfo = (user) => {
  if (!user) return { name: 'Guest', color: 'gray', badge: false };
  
  const roleInfo = {
    'super_admin': { name: 'Super Admin', color: 'red', badge: true },
    'admin': { name: 'Admin', color: 'purple', badge: true },
    'moderator': { name: 'Moderator', color: 'blue', badge: true },
    'user': { name: 'User', color: 'green', badge: false },
    'limited_user': { name: 'Limited User', color: 'yellow', badge: false },
    'viewer': { name: 'Viewer', color: 'gray', badge: false }
  };
  
  return roleInfo[user.role] || { name: user.role_display || 'User', color: 'gray', badge: false };
};