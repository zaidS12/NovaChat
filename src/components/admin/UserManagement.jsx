import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Plus, Edit, Trash2, Shield, Eye,
  MoreVertical, Check, X, AlertTriangle, UserPlus, Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { useAuth } from '../../contexts/AuthContext'

const UserManagement = () => {
  const { user, apiRequest } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filterRole, setFilterRole] = useState('all')

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'red' },
    { value: 'moderator', label: 'Moderator', color: 'orange' },
    { value: 'user', label: 'User', color: 'blue' },
    { value: 'guest', label: 'Guest', color: 'gray' }
  ]

  const permissions = [
    { id: 'manage_users', label: 'Manage Users', description: 'Create, edit, and delete users' },
    { id: 'manage_roles', label: 'Manage Roles', description: 'Assign and modify user roles' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access dashboard analytics and reports' },
    { id: 'manage_content', label: 'Manage Content', description: 'Create, edit, and delete content' },
    { id: 'moderate_chat', label: 'Moderate Chat', description: 'Monitor and moderate chat messages' },
    { id: 'system_settings', label: 'System Settings', description: 'Access system configuration' }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiRequest('/api/admin/users/manage_users.php')
      if (response.success) {
        setUsers(response.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await apiRequest('/api/admin/users/manage_users.php', {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, ...updates })
      })
      
      if (response.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
        setShowUserModal(false)
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await apiRequest('/api/admin/users/manage_users.php', {
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId })
      })
      
      if (response.success) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    const roleConfig = roles.find(r => r.value === role)
    return roleConfig?.color || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            User Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setShowUserModal(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Last Login</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getRoleColor(user.role)}>
                            {roles.find(r => r.value === user.role)?.label || user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                            {user.status || 'active'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user)
                                setShowUserModal(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 p-4">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-h-[44px] min-w-[44px] p-2"
                          onClick={() => {
                            setEditingUser(user)
                            setShowUserModal(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-h-[44px] min-w-[44px] p-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Role:</span>
                        <div className="mt-1">
                          <Badge variant={getRoleColor(user.role)}>
                            {roles.find(r => r.value === user.role)?.label || user.role}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Status:</span>
                        <div className="mt-1">
                          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                            {user.status || 'active'}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 dark:text-slate-400">Last Login:</span>
                        <p className="text-slate-900 dark:text-slate-100 mt-1">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <UserModal
            user={editingUser}
            roles={roles}
            permissions={permissions}
            onSave={handleUpdateUser}
            onClose={() => {
              setShowUserModal(false)
              setEditingUser(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// User Modal Component
const UserModal = ({ user, roles, permissions, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    permissions: user?.permissions || [],
    status: user?.status || 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user) {
      onSave(user.id, formData)
    } else {
      // Handle new user creation
      onSave(null, formData)
    }
  }

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={permission.id} className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
                        {permission.label}
                      </label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {user ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UserManagement