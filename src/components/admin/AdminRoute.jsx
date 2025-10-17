import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminRoute = ({ children, requiredPermission = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyAdminAccess();
  }, [requiredPermission]);

  const verifyAdminAccess = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');

      if (!token || !adminUser) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Parse stored user data
      const user = JSON.parse(adminUser);
      
      // Check if user has admin access
      const hasAdminAccess = user.is_admin || (user.permissions && user.permissions.includes('admin.panel'));
      
      if (!hasAdminAccess) {
        setIsAuthenticated(false);
        setError('Admin access required');
        setLoading(false);
        return;
      }

      // Check specific permission if required
      if (requiredPermission) {
        const hasRequiredPermission = user.permissions && user.permissions.includes(requiredPermission);
        if (!hasRequiredPermission) {
          setIsAuthenticated(true);
          setHasPermission(false);
          setError(`Permission required: ${requiredPermission}`);
          setLoading(false);
          return;
        }
      }

      // Verify token is still valid by making a test API call
      const response = await fetch('/api/admin/auth/verify_token.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          setHasPermission(true);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
          setError('Session expired');
        }
      } else {
        // API call failed, assume token is invalid
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAuthenticated(false);
        setError('Authentication failed');
      }
    } catch (error) {
      console.error('Admin verification error:', error);
      setIsAuthenticated(true); // Allow access if verification fails due to network issues
      setHasPermission(true);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while verifying
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Show permission denied if authenticated but lacks required permission
  if (isAuthenticated && hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            {error || 'You do not have permission to access this resource.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated and has permission
  return children;
};

// Higher-order component for easier usage
export const withAdminAuth = (Component, requiredPermission = null) => {
  return (props) => (
    <AdminRoute requiredPermission={requiredPermission}>
      <Component {...props} />
    </AdminRoute>
  );
};

// Hook to get current admin user
export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAdminUser(user);
        setIsAdmin(true);
      } catch (error) {
        console.error('Error parsing admin user:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setIsAdmin(false);
    window.location.href = '/admin/login';
  };

  const hasPermission = (permission) => {
    if (!adminUser) return false;
    return adminUser.is_admin || (adminUser.permissions && adminUser.permissions.includes(permission));
  };

  return {
    adminUser,
    isAdmin,
    logout,
    hasPermission
  };
};

export default AdminRoute;