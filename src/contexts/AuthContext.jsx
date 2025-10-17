import React, { createContext, useContext, useState, useEffect } from 'react';
import { hasPermission, canAccessRoute } from '../utils/permissions';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('session_token') || localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('user_data') || localStorage.getItem('admin_user');
        
        if (storedToken && storedUser) {
          setSessionToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('session_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store user data and token
        setUser(data.user);
        setSessionToken(data.session_token);
        
        // Store in localStorage
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Clear any old admin tokens
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    
    // Clear all stored data
    localStorage.removeItem('session_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('admin_user');
    
    // Redirect to login
    window.location.href = '/login';
  };

  const checkPermission = (permission) => {
    return hasPermission(user, permission);
  };

  const checkRouteAccess = (route) => {
    return canAccessRoute(user, route);
  };

  const isAuthenticated = () => {
    return !!(user && sessionToken);
  };

  const isAdmin = () => {
    return user?.is_admin || user?.role === 'super_admin';
  };

  const getAuthHeaders = () => {
    return sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {};
  };

  // API request helper with authentication
  const apiRequest = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    sessionToken,
    login,
    logout,
    checkPermission,
    checkRouteAccess,
    isAuthenticated,
    isAdmin,
    getAuthHeaders,
    apiRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;