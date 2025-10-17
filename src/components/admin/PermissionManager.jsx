import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Settings, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';

const PermissionManager = ({ onClose }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    display_name: '',
    description: ''
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles/list.php');
      const data = await response.json();
      if (data.success) {
        setRoles(data.roles);
        if (data.roles.length > 0) {
          setSelectedRole(data.roles[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/admin/permissions/list.php');
      const data = await response.json();
      if (data.success) {
        setPermissions(data.permissions);
        await fetchRolePermissions();
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const response = await fetch('/api/admin/roles/permissions.php');
      const data = await response.json();
      if (data.success) {
        setRolePermissions(data.role_permissions);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handlePermissionToggle = (roleId, permissionName) => {
    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      const hasPermission = currentPermissions.includes(permissionName);
      
      return {
        ...prev,
        [roleId]: hasPermission 
          ? currentPermissions.filter(p => p !== permissionName)
          : [...currentPermissions, permissionName]
      };
    });
  };

  const saveRolePermissions = async (roleId) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/roles/update-permissions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: roleId,
          permissions: rolePermissions[roleId] || []
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Show success message
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const createRole = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('session_token');
      const response = await fetch('/api/admin/roles/manage_roles.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRole)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowCreateRole(false);
        setNewRole({ name: '', display_name: '', description: '' });
        fetchRoles();
        // Show success message if needed
        console.log('Role created successfully');
      } else {
        console.error('Error creating role:', data.error || 'Unknown error');
        alert('Error creating role: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Network error: Unable to create role');
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module || 'general';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  const getModuleIcon = (module) => {
    const icons = {
      dashboard: Shield,
      users: Users,
      settings: Settings,
      admin: AlertTriangle,
      chat: Eye,
      profile: Edit3
    };
    return icons[module] || Shield;
  };

  const getModuleColor = (module) => {
    const colors = {
      dashboard: 'bg-blue-500',
      users: 'bg-green-500',
      settings: 'bg-purple-500',
      admin: 'bg-red-500',
      chat: 'bg-indigo-500',
      profile: 'bg-orange-500'
    };
    return colors[module] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading permissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Permission Manager</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage roles and assign permissions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors min-h-[44px] text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Roles List */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Roles</h2>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2">
                    {roles.map(role => (
                      <motion.button
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        whileHover={{ scale: 1.02 }}
                        className={`w-full text-left p-4 rounded-lg border transition-all min-h-[60px] ${
                          selectedRole?.id === role.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{role.display_name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{role.description}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-3 ${
                            role.is_active ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="lg:col-span-2">
                {selectedRole ? (
                  <div className="bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                            Permissions for {selectedRole.display_name}
                          </h2>
                          <p className="text-sm sm:text-base text-gray-600 mt-1">{selectedRole.description}</p>
                        </div>
                        <button
                          onClick={() => saveRolePermissions(selectedRole.id)}
                          disabled={saving}
                          className="inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 min-h-[44px] text-sm font-medium w-full sm:w-auto"
                        >
                          {saving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
                        const ModuleIcon = getModuleIcon(module);
                        const moduleColor = getModuleColor(module);
                        
                        return (
                          <div key={module} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center mb-4">
                              <div className={`p-2 rounded-lg ${moduleColor} mr-3 flex-shrink-0`}>
                                <ModuleIcon className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                                {module} Module
                              </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                              {modulePermissions.map(permission => {
                                const isChecked = rolePermissions[selectedRole.id]?.includes(permission.name) || false;
                                
                                return (
                                  <motion.label
                                    key={permission.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all min-h-[60px] ${
                                      isChecked 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handlePermissionToggle(selectedRole.id, permission.name)}
                                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-4 mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                          {permission.display_name}
                                        </span>
                                        {isChecked && (
                                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                                        )}
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </motion.label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                    <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a Role</h3>
                    <p className="text-sm sm:text-base text-gray-600">Choose a role from the left to manage its permissions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      <AnimatePresence>
          {showCreateRole && (
            <div className="fixed inset-0 z-50 overflow-y-auto p-4">
              <div className="flex items-center justify-center min-h-screen">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                  onClick={() => setShowCreateRole(false)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100">
                        Create New Role
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">Define a new role with custom permissions</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); createRole(); }} className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Role Name (Internal)
                        </label>
                        <input
                          type="text"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                          className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="e.g., content_manager"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={newRole.display_name}
                          onChange={(e) => setNewRole({ ...newRole, display_name: e.target.value })}
                          className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="e.g., Content Manager"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Describe the role's purpose and responsibilities"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowCreateRole(false)}
                          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[44px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 min-h-[44px]"
                        >
                          Create Role
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
      </AnimatePresence>
    </>
  );
};

export default PermissionManager;