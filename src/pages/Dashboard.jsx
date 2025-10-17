import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Activity,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Menu,
  X,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { hasPermission, canAccessRoute, getNavigationItems } from '../utils/permissions'

const Dashboard = () => {
  const { user, logout, checkPermission } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  
  const stats = [
    { label: 'Total Messages', value: '2,847', change: '+12%', icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Active Users', value: '1,234', change: '+8%', icon: Users, color: 'text-green-500' },
    { label: 'Response Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Avg Response Time', value: '1.2s', change: '-0.3s', icon: Activity, color: 'text-orange-500' }
  ]
  
  const activities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'started a new conversation',
      time: '2 minutes ago',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'completed onboarding',
      time: '5 minutes ago',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      user: 'Emma Davis',
      action: 'updated profile settings',
      time: '12 minutes ago',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      action: 'sent feedback',
      time: '1 hour ago',
      avatar: '/api/placeholder/32/32'
    }
  ]
  
  const quickActions = [
    { label: 'New Chat', icon: MessageSquare, color: 'bg-blue-500', path: '/chat' },
    { label: 'Add User', icon: Users, color: 'bg-green-500', path: '/users' },
    { label: 'Settings', icon: Settings, color: 'bg-purple-500', path: '/settings' },
    { label: 'Analytics', icon: TrendingUp, color: 'bg-orange-500', path: '/dashboard' }
  ]

  const floatingMenuOptions = [
    { label: 'Premium Features', icon: TrendingUp, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { label: 'Monetization', icon: Activity, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { label: 'Export Data', icon: Filter, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { label: 'Bulk Actions', icon: MoreHorizontal, color: 'bg-gradient-to-r from-orange-500 to-red-500' }
  ]

  const handleFloatingMenuAction = (actionLabel) => {
     switch (actionLabel) {
       case 'Premium Features':
         // Show premium features modal or navigate to premium page
         alert('🚀 Premium Features\n\n• Advanced Analytics\n• Priority Support\n• Custom Themes\n• API Access\n\nUpgrade now to unlock these features!')
         break
       case 'Monetization':
         // Open monetization dashboard
         alert('💰 Monetization Dashboard\n\n• Revenue Analytics: $1,234 this month\n• Subscription Management\n• Payment Processing\n• Affiliate Program\n\nManage your revenue streams here!')
         break
       case 'Export Data':
         // Trigger data export
         alert('📊 Data Export\n\n• User Data: 1,250 records\n• Chat History: 5,430 messages\n• Analytics: 30 days\n\nExport started! You\'ll receive an email when ready.')
         // Simulate export process
         setTimeout(() => {
           alert('✅ Export Complete!\n\nYour data has been exported successfully. Check your email for the download link.')
         }, 3000)
         break
       case 'Bulk Actions':
          // Show bulk actions modal
          setShowBulkActionsModal(true)
          break
       default:
         console.log(`Action not implemented: ${actionLabel}`)
     }
   }

   const handleBulkAction = (actionType) => {
     const actions = {
       'delete-inactive': 'Deleted 45 inactive users',
       'send-notifications': 'Sent notifications to 1,250 users',
       'update-permissions': 'Updated permissions for 230 users',
       'archive-conversations': 'Archived 1,120 old conversations'
     }
     
     if (actions[actionType]) {
       alert(`✅ ${actions[actionType]} successfully!`)
       setShowBulkActionsModal(false)
     }
   }
  
  return (
    <div className="page-background dashboard-bg min-h-screen flex relative overflow-hidden">
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
        className="absolute top-1/3 left-10 w-24 h-24 bg-blue-200/15 dark:bg-blue-500/10 rounded-full blur-xl"
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
        className="absolute bottom-20 right-1/4 w-20 h-20 bg-purple-200/15 dark:bg-purple-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -360, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute top-2/3 right-10 w-16 h-16 bg-orange-200/15 dark:bg-orange-500/10 rounded-full blur-lg"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-green-200/15 dark:bg-green-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -25, 0],
          x: [0, 25, 0],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 ${
          // Mobile behavior - overlay when menu is open
          mobileMenuOpen ? 'lg:relative fixed inset-y-0 left-0 w-64' : 'lg:relative fixed -left-64 w-64 lg:left-0'
        }`}
        animate={{ 
          width: sidebarCollapsed ? 80 : 256
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut"
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ 
                opacity: (!sidebarCollapsed || mobileMenuOpen) ? 1 : 0,
                x: (!sidebarCollapsed || mobileMenuOpen) ? 0 : -10
              }}
              transition={{ 
                duration: 0.2, 
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">NC</span>
              </div>
              <motion.span 
                className="font-bold text-slate-900 dark:text-slate-100"
                animate={{ 
                  opacity: (!sidebarCollapsed || mobileMenuOpen) ? 1 : 0,
                  width: (!sidebarCollapsed || mobileMenuOpen) ? "auto" : 0,
                  overflow: "hidden"
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: "easeInOut"
                }}
              >
                NovaChat
              </motion.span>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Desktop: toggle collapse
                if (window.innerWidth >= 1024) {
                  setSidebarCollapsed(!sidebarCollapsed)
                } else {
                  // Mobile: close menu
                  setMobileMenuOpen(false)
                }
              }}
              className="p-2 min-h-[44px] min-w-[44px]"
            >
              {sidebarCollapsed && window.innerWidth >= 1024 ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {getNavigationItems(user).map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <motion.div key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center rounded-lg transition-all duration-200 touch-manipulation relative ${
                    sidebarCollapsed && !mobileMenuOpen 
                      ? 'px-3 py-4 min-h-[56px] justify-center' 
                      : 'space-x-3 px-3 py-3 min-h-[48px]'
                  } ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600'
                  } ${
                    isActive && sidebarCollapsed && !mobileMenuOpen 
                      ? 'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-600 before:rounded-r-full' 
                      : ''
                  }`}
                  title={sidebarCollapsed && !mobileMenuOpen ? item.label : ''}
                >
                  <motion.div
                    className={`flex items-center w-full ${
                      sidebarCollapsed && !mobileMenuOpen ? 'justify-center' : 'space-x-3'
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: (sidebarCollapsed && !mobileMenuOpen) ? 1.3 : 1
                      }}
                      transition={{ 
                        duration: 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      <item.icon 
                        size={20} 
                        className={sidebarCollapsed && !mobileMenuOpen ? 'text-slate-600 dark:text-slate-400' : ''}
                      />
                    </motion.div>
                    <motion.span
                      className="font-medium"
                      animate={{ 
                        opacity: (!sidebarCollapsed || mobileMenuOpen) ? 1 : 0,
                        width: (!sidebarCollapsed || mobileMenuOpen) ? "auto" : 0,
                        overflow: "hidden"
                      }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeInOut"
                      }}
                    >
                      {item.label}
                    </motion.span>
                    <motion.div
                      animate={{ 
                        opacity: (!sidebarCollapsed || mobileMenuOpen) ? 1 : 0,
                        scale: (!sidebarCollapsed || mobileMenuOpen) ? 1 : 0.8
                      }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeInOut"
                      }}
                    >
                      {item.adminOnly && (
                        <Shield className="w-4 h-4 ml-auto text-amber-500" />
                      )}
                    </motion.div>
                   </motion.div>
                 </Link>
               </motion.div>
             )
           })}
        </nav>
      </motion.aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 min-h-[44px] min-w-[44px]"
              >
                <Menu size={20} />
              </Button>
              
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Dashboard
              </h1>
              
              {/* Search - Hidden on small mobile */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all w-48 lg:w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden p-2 min-h-[44px] min-w-[44px]"
              >
                <Search size={20} />
              </Button>
              
              <ThemeToggle className="shrink-0" />
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                </Button>
                
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-elevation-high border border-slate-200 dark:border-slate-700 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 touch-manipulation min-h-[60px] flex flex-col justify-center">
                          <p className="text-sm text-slate-900 dark:text-slate-100">New message received</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 minutes ago</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="User Menu"
                >
                  <Avatar 
                    src={user?.avatar || "/api/placeholder/40/40"} 
                    alt={user?.name || "User"} 
                    fallback={user?.name ? user.name.split(' ').map(n => n[0]).join('') : "JD"} 
                    size="md" 
                    online 
                  />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 top-12 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-elevation-high border border-slate-200 dark:border-slate-700 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={user?.avatar || "/api/placeholder/40/40"}
                          alt={user?.name || "User"}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user?.email}
                          </p>
                          {user?.role && (
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {user.role === 'admin' ? 'Administrator' : user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 min-h-[44px] touch-manipulation"
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
          {/* Stats Grid */}
          {checkPermission('view_analytics') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                      <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700 ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors touch-manipulation min-h-[72px]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Avatar src={activity.avatar} alt={activity.user} fallback={activity.user.split(' ').map(n => n[0]).join('')} />
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-slate-100">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Link key={action.label} to={action.path}>
                        <motion.div
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors cursor-pointer touch-manipulation min-h-[60px]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon size={16} />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{action.label}</span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Messages */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Link key={i} to="/chat">
                        <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 cursor-pointer transition-colors touch-manipulation min-h-[64px]">
                          <Avatar size="sm" fallback="U" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              User {i}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              Hey, I need help with...
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">2m</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Floating Action Menu */}
       {checkPermission('manage_users') && (
       <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6">
         {/* Floating Menu Options */}
         <AnimatePresence>
           {showFloatingMenu && (
             <motion.div
               className="absolute bottom-14 sm:bottom-16 right-0 space-y-3 mb-2"
               initial={{ opacity: 0, scale: 0.8, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.8, y: 20 }}
               transition={{ duration: 0.2 }}
             >
            {floatingMenuOptions.map((option, index) => (
              <motion.div
                key={option.label}
                className="flex items-center justify-end space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {option.label}
                </span>
                <Button 
                  className={`h-12 w-12 rounded-full shadow-elevation-high ${option.color} text-white border-0 touch-manipulation`}
                  onClick={() => {
                    handleFloatingMenuAction(option.label)
                    setShowFloatingMenu(false)
                  }}
                >
                  <option.icon size={20} />
                </Button>
              </motion.div>
            ))}
           </motion.div>
         )}
       </AnimatePresence>
        
        {/* Main Floating Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: showFloatingMenu ? 45 : 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Button 
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-elevation-high bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 touch-manipulation"
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          >
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </Button>
        </motion.div>
       </div>
       )}

       {/* Bulk Actions Modal */}
       {showBulkActionsModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <motion.div
             className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
           >
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">🔧 Bulk Actions</h3>
               <Button
                 className="h-8 w-8 p-0 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                 onClick={() => setShowBulkActionsModal(false)}
               >
                 <X size={16} />
               </Button>
             </div>
             <p className="text-slate-600 dark:text-slate-400 mb-6">Choose a bulk action to perform:</p>
             <div className="space-y-3">
               <Button
                 className="w-full justify-start bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                 onClick={() => handleBulkAction('delete-inactive')}
               >
                 Delete inactive users
               </Button>
               <Button
                 className="w-full justify-start bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                 onClick={() => handleBulkAction('send-notifications')}
               >
                 Send bulk notifications
               </Button>
               <Button
                 className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                 onClick={() => handleBulkAction('update-permissions')}
               >
                 Update user permissions
               </Button>
               <Button
                 className="w-full justify-start bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                 onClick={() => handleBulkAction('archive-conversations')}
               >
                 Archive old conversations
               </Button>
             </div>
           </motion.div>
         </div>
       )}
     </div>
   )
 }

export default Dashboard