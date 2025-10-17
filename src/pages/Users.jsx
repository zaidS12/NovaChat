import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Shield } from 'lucide-react';

const Users = () => {
  const { user, isAdmin } = useAuth();
  


  // Only administrators and super administrators can access full user management
  // Regular users see simple status view, admins see full management interface
  if (user?.is_admin || user?.role === 'super_admin' || user?.role === 'admin') {
    return (
      <div className="page-background min-h-screen p-6">
        <UserManagement />
      </div>
    )
  }
  
  // Show user status list for regular users
  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'online', avatar: '/api/placeholder/40/40', lastActive: 'Just now' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', status: 'away', avatar: '/api/placeholder/40/40', lastActive: '5 min ago' },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', status: 'online', avatar: '/api/placeholder/40/40', lastActive: '2 min ago' },
    { id: 4, name: 'Alex Rodriguez', email: 'alex@example.com', status: 'offline', avatar: '/api/placeholder/40/40', lastActive: '2 hours ago' },
    { id: 5, name: 'Lisa Wang', email: 'lisa@example.com', status: 'online', avatar: '/api/placeholder/40/40', lastActive: 'Just now' },
    { id: 6, name: 'David Brown', email: 'david@example.com', status: 'away', avatar: '/api/placeholder/40/40', lastActive: '10 min ago' }
  ]

  return (
    <div className="page-background min-h-screen relative overflow-hidden">

      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 right-20 w-32 h-32 bg-teal-200/15 dark:bg-teal-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-10 w-24 h-24 bg-purple-200/15 dark:bg-purple-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-lg"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                   Online Users
                 </h1>
                 <p className="text-slate-600 dark:text-slate-400">
                   See who's currently active in NovaChat
                 </p>
               </div>
            </motion.div>
          </div>

          {/* Users Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                      user.status === 'online' ? 'bg-green-500' :
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    user.status === 'away' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {user.lastActive}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-200/50 dark:border-slate-600/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                 <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                   User Status View
                 </h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   You can view online/offline status of community members. User management features 
                   are available only to super administrators.
                 </p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Users