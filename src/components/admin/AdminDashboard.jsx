import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  Settings, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from 'lucide-react';
import PermissionManager from './PermissionManager';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        role: selectedRole,
        status: selectedStatus
      });

      const response = await fetch(`/api/admin/users/manage_users.php?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setRoles(data.data.roles);
        setTotalPages(data.data.pagination.total_pages);
        
        // Calculate stats
        const totalUsers = data.data.pagination.total_users;
        const activeUsers = data.data.users.filter(u => u.is_active).length;
        const adminUsers = data.data.users.filter(u => u.is_admin).length;
        
        setStats({
          totalUsers,
          activeUsers,
          adminUsers,
          newUsersToday: 0 // This would need a separate API call
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/system/backup.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Create and download the backup file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || 'novachat_backup.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message (you can replace this with a toast notification)
        alert('Backup created and downloaded successfully!');
      } else {
        alert('Backup failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Backup failed: ' + error.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/users/manage_users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        fetchUsers();
        alert('User created successfully!');
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/users/manage_users.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
        alert('User updated successfully!');
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/users/manage_users.php?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        alert('User deactivated successfully!');
      } else {
        alert(data.error || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color} flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const UserRow = ({ user }) => (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100">
          {user.role_display_name || user.role_name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
        }`}>
          {user.is_active ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
          ) : (
            <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
          )}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowEditModal(true);
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  const UserCard = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowEditModal(true);
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Role:</span>
          <div className="mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
              {user.role_display_name || user.role_name}
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Status:</span>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.is_active 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}>
              {user.is_active ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
              ) : (
                <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
              )}
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
          <div className="mt-1 text-gray-900 dark:text-gray-100">
            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Created:</span>
          <div className="mt-1 text-gray-900 dark:text-gray-100">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage users and system permissions</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackup}
              disabled={backupLoading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{backupLoading ? 'Creating Backup...' : 'Backup System'}</span>
              <span className="sm:hidden">{backupLoading ? 'Backing up...' : 'Backup'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPermissionManager(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base min-h-[44px]"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Permissions</span>
              <span className="sm:hidden">Permissions</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-blue-500"
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={stats.activeUsers}
            color="bg-green-500"
          />
          <StatCard
            icon={Shield}
            title="Admin Users"
            value={stats.adminUsers}
            color="bg-purple-500"
          />
          <StatCard
            icon={UserPlus}
            title="New Today"
            value={stats.newUsersToday}
            color="bg-orange-500"
          />
        </div>

        {/* Users Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">User Management</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.display_name}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => <UserRow key={user.id} user={user} />)
                )}
              </tbody>
            </table>
          </div>

          {/* Users Cards - Mobile */}
          <div className="lg:hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">Loading users...</span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No users found
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {users.map(user => <UserCard key={user.id} user={user} />)}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="order-2 sm:order-1">
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
                <div className="flex items-center space-x-3 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[80px]"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[80px]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <UserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        roles={roles}
        title="Create New User"
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        roles={roles}
        user={selectedUser}
        title="Edit User"
      />

      {/* Permission Manager Modal */}
      {showPermissionManager && (
        <PermissionManager
          onClose={() => setShowPermissionManager(false)}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal = ({ isOpen, onClose, onSubmit, roles, user, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 2,
    is_active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        role_id: user.role_id || 2,
        is_active: user.is_active
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role_id: 2,
        is_active: true
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4">
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  {title}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password {user && '(leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      required={!user}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role_id}
                      onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.display_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center py-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-3 block text-base text-gray-900 dark:text-gray-100">
                      Active
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[44px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 min-h-[44px]"
                    >
                      {user ? 'Update' : 'Create'} User
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminDashboard;