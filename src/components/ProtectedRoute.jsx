import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

const ProtectedRoute = ({ children, requiredPermission, adminOnly = false }) => {
  const { user, loading, isAuthenticated, checkPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin-only access
  if (adminOnly && !user?.is_admin && user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          className="max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Shield className="w-10 h-10 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Admin Access Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don't have permission to access this area. Admin privileges are required.
          </p>
          <motion.button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Check specific permission if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          className="max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Lock className="w-10 h-10 text-orange-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            You don't have permission to access this feature.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
            Required permission: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{requiredPermission}</code>
          </p>
          <div className="space-y-3">
            <motion.button
              className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Back
            </motion.button>
            <motion.button
              className="w-full px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => window.location.href = '/dashboard'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;