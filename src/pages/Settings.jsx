import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff, 
  Camera, 
  Save, 
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Lock,
  Key,
  Database,
  HelpCircle,
  Check,
  X,
  AlertTriangle,
  Settings as SettingsIcon,
  RefreshCw
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/ui/ThemeToggle'
import ThemeToggleSwitch from '../components/ui/ThemeToggleSwitch'
import AccentColorPicker from '../components/ui/AccentColorPicker'
import Toggle from '../components/ui/Toggle'
import { useTheme } from '../contexts/ThemeContext'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [settings, setSettings] = useState({
    // Profile Settings
    name: '',
    email: '',
    bio: '',
    avatar: '',
    
    // Notification Settings
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    sound_enabled: true,
    desktop_notifications: false,
    
    // Privacy Settings
    profile_visibility: 'public',
    show_online_status: true,
    allow_direct_messages: true,
    data_collection: false,
    
    // Appearance Settings
    theme_mode: 'system',
    accent_color: 'blue',
    font_size: 'medium',
    compact_mode: false,
    
    // Language & Region
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    
    // Security Settings
    two_factor_enabled: false,
    session_timeout: '30',
    login_alerts: true
  })
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'data', label: 'Data', icon: Database }
  ]
  
  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      const userId = userData.id
      
      if (!userId) {
        console.error('No user ID found in localStorage')
        setSaveStatus({ type: 'error', message: 'User not found. Please log in again.' })
        setTimeout(() => setSaveStatus(null), 3000)
        return
      }
      
      console.log('Loading settings for user ID:', userId)
      
      const response = await fetch(`http://localhost/NovaChat/api/user/settings.php?user_id=${userId}`)
      const result = await response.json()
      
      console.log('Settings API response:', result)
      
      if (result.success) {
        const { profile, settings: userSettings } = result.data
        
        // Merge profile and settings data
        const mergedSettings = {
          // Profile data
          name: profile.name || userData.name || '',
          email: profile.email || userData.email || '',
          bio: profile.bio || '',
          avatar: profile.avatar || userData.avatar || '',
          // Settings data with defaults
          notifications_enabled: userSettings.notifications_enabled ?? true,
          email_notifications: userSettings.email_notifications ?? true,
          push_notifications: userSettings.push_notifications ?? true,
          sound_enabled: userSettings.sound_enabled ?? true,
          desktop_notifications: userSettings.desktop_notifications ?? false,
          profile_visibility: userSettings.profile_visibility || 'public',
          show_online_status: userSettings.show_online_status ?? true,
          allow_direct_messages: userSettings.allow_direct_messages ?? true,
          data_collection: userSettings.data_collection ?? false,
          theme_mode: userSettings.theme_mode || 'system',
          accent_color: userSettings.accent_color || 'blue',
          font_size: userSettings.font_size || 'medium',
          compact_mode: userSettings.compact_mode ?? false,
          language: userSettings.language || 'en',
          timezone: userSettings.timezone || 'UTC',
          date_format: userSettings.date_format || 'MM/DD/YYYY',
          two_factor_enabled: userSettings.two_factor_enabled ?? false,
          session_timeout: userSettings.session_timeout || '30',
          login_alerts: userSettings.login_alerts ?? true
        }
        
        setSettings(mergedSettings)
        console.log('Settings loaded successfully:', mergedSettings)
      } else {
        console.error('Failed to load settings:', result.message)
        setSaveStatus({ type: 'error', message: result.message || 'Failed to load settings' })
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      setSaveStatus({ type: 'error', message: 'Failed to load settings. Please try again.' })
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
        const userId = userData.id

        const response = await fetch('http://localhost/NovaChat/api/user/upload_avatar.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            image_data: e.target.result
          })
        })

        const result = await response.json()
        
        if (result.success) {
          updateSetting('avatar', result.data.avatar_url)
          setSaveStatus({ type: 'success', message: 'Avatar updated successfully!' })
          setTimeout(() => setSaveStatus(null), 3000)
        } else {
          setSaveStatus({ type: 'error', message: result.message })
          setTimeout(() => setSaveStatus(null), 3000)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setSaveStatus({ type: 'error', message: 'Failed to upload avatar' })
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      const userId = userData.id
      
      if (!userId) {
        console.error('No user ID found in localStorage')
        setSaveStatus({ type: 'error', message: 'User not found. Please log in again.' })
        setTimeout(() => setSaveStatus(null), 3000)
        return
      }
      
      console.log('Saving settings for user ID:', userId)
      console.log('Settings data:', settings)
      
      const settingsData = {
        user_id: userId,
        ...settings
      }
      
      const response = await fetch('http://localhost/NovaChat/api/user/settings.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData)
      })
      
      const result = await response.json()
      console.log('Save response:', result)
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Settings saved successfully!' })
        setTimeout(() => setSaveStatus(null), 3000)
        
        // Update localStorage with new user data
        const updatedUserData = {
          ...userData,
          name: settings.name,
          email: settings.email,
          avatar: settings.avatar
        }
        localStorage.setItem('user_data', JSON.stringify(updatedUserData))
        
        // Reload settings to ensure consistency
        setTimeout(() => {
          loadSettings()
        }, 1000)
      } else {
        setSaveStatus({ type: 'error', message: result.message || 'Failed to save settings' })
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save settings. Please try again.' })
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefreshSettings = () => {
    loadSettings()
  }
  
  const SettingItem = ({ label, description, children, className = '' }) => (
    <div className={`flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${className}`}>
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">{label}</h4>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  )
  
  const Toggle = ({ checked, onChange, disabled = false }) => (
    <motion.button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar 
                  src={settings.avatar} 
                  alt={settings.name || 'User'}
                  fallback={settings.name ? settings.name.split(' ').map(n => n[0]).join('') : 'U'}
                  size="xl"
                />
                <motion.button
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                </motion.button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {settings.name || 'Your Name'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{settings.email || 'your.email@example.com'}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Avatar
                </Button>
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                rows={3}
                value={settings.bio}
                onChange={(e) => updateSetting('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )
        
      case 'notifications':
        return (
          <div className="space-y-1">
            <SettingItem
              label="Email Notifications"
              description="Receive notifications via email"
            >
              <Toggle
                checked={settings.email_notifications}
                onChange={(value) => updateSetting('email_notifications', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Push Notifications"
              description="Receive push notifications on your device"
            >
              <Toggle
                checked={settings.push_notifications}
                onChange={(value) => updateSetting('push_notifications', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Sound Effects"
              description="Play sounds for notifications and interactions"
            >
              <Toggle
                checked={settings.sound_enabled}
                onChange={(value) => updateSetting('sound_enabled', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Desktop Notifications"
              description="Show notifications on your desktop"
            >
              <Toggle
                checked={settings.desktop_notifications}
                onChange={(value) => updateSetting('desktop_notifications', value)}
              />
            </SettingItem>
          </div>
        )
        
      case 'privacy':
        return (
          <div className="space-y-1">
            <SettingItem
              label="Profile Visibility"
              description="Control who can see your profile"
            >
              <select
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                value={settings.profile_visibility}
                onChange={(e) => updateSetting('profile_visibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </SettingItem>
            
            <SettingItem
              label="Show Online Status"
              description="Let others see when you're online"
            >
              <Toggle
                checked={settings.show_online_status}
                onChange={(value) => updateSetting('show_online_status', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Allow Direct Messages"
              description="Allow others to send you direct messages"
            >
              <Toggle
                checked={settings.allow_direct_messages}
                onChange={(value) => updateSetting('allow_direct_messages', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Data Collection"
              description="Allow anonymous usage data collection"
            >
              <Toggle
                checked={settings.data_collection}
                onChange={(value) => updateSetting('data_collection', value)}
              />
            </SettingItem>
          </div>
        )
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <SettingItem
              label="Theme Mode"
              description="Choose your preferred theme"
            >
              <ThemeToggleSwitch
                value={settings.theme_mode}
                onChange={(value) => updateSetting('theme_mode', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Accent Color"
              description="Choose your preferred accent color"
            >
              <AccentColorPicker
                value={settings.accent_color}
                onChange={(value) => updateSetting('accent_color', value)}
              />
            </SettingItem>
            
            <SettingItem
              label="Font Size"
              description="Adjust the interface font size"
            >
              <div className="flex space-x-2">
                {[
                  { value: 'small', label: 'Small', preview: 'Aa' },
                  { value: 'medium', label: 'Medium', preview: 'Aa' },
                  { value: 'large', label: 'Large', preview: 'Aa' }
                ].map(({ value, label, preview }) => (
                  <motion.button
                    key={value}
                    className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-lg border transition-colors ${
                      settings.font_size === value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                    onClick={() => updateSetting('font_size', value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={`font-semibold ${
                      value === 'small' ? 'text-sm' : 
                      value === 'large' ? 'text-lg' : 'text-base'
                    }`}>{preview}</span>
                    <span className="text-xs">{label}</span>
                  </motion.button>
                ))}
              </div>
            </SettingItem>
            
            <SettingItem
              label="Compact Mode"
              description="Use a more compact interface layout"
            >
              <Toggle
                checked={settings.compact_mode}
                onChange={(value) => updateSetting('compact_mode', value)}
              />
            </SettingItem>
          </div>
        )
        
      case 'language':
        return (
          <div className="space-y-1">
            <SettingItem
              label="Language"
              description="Choose your preferred language"
            >
              <select
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </SettingItem>
            
            <SettingItem
              label="Timezone"
              description="Set your local timezone"
            >
              <select
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </SettingItem>
            
            <SettingItem
              label="Date Format"
              description="Choose your preferred date format"
            >
              <select
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </SettingItem>
          </div>
        )
        
      case 'security':
        return (
          <div className="space-y-6">
            <SettingItem
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            >
              <div className="flex items-center space-x-3">
                <Toggle
                  checked={settings.twoFactorEnabled}
                  onChange={(value) => updateSetting('twoFactorEnabled', value)}
                />
                {settings.twoFactorEnabled && (
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                )}
              </div>
            </SettingItem>
            
            <SettingItem
              label="Session Timeout"
              description="Automatically log out after inactivity"
            >
              <select
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </SettingItem>
            
            <SettingItem
              label="Login Alerts"
              description="Get notified of new login attempts"
            >
              <Toggle
                checked={settings.loginAlerts}
                onChange={(value) => updateSetting('loginAlerts', value)}
              />
            </SettingItem>
            
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Key className="mr-2" size={16} />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={16} />
                Download Account Data
              </Button>
            </div>
          </div>
        )
        
      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Data Management
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Manage your data and privacy settings. You can export or delete your data at any time.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={16} />
                Export All Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2" size={16} />
                View Data Usage
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="mr-2" size={16} />
                Delete Account
              </Button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <HelpCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Need Help?
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Contact our support team if you have questions about your data or privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="page-background min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-16 right-32 w-40 h-40 bg-indigo-200/15 dark:bg-indigo-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 270, 360]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/4 left-16 w-28 h-28 bg-pink-200/15 dark:bg-pink-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 0.7, 1]
        }}
        transition={{ 
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-1/5 w-24 h-24 bg-cyan-200/15 dark:bg-cyan-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 360, 0]
        }}
        transition={{ 
          duration: 16,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute top-3/4 right-20 w-18 h-18 bg-yellow-200/15 dark:bg-yellow-500/10 rounded-full blur-lg"
        animate={{ 
          y: [0, 20, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-emerald-200/15 dark:bg-emerald-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -35, 0],
          x: [0, 35, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your account preferences and privacy settings
              </p>
            </div>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <motion.button
                        key={tab.id}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon, { size: 24 })}
                  <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                )}
              </CardContent>
            </Card>
            
            {/* Save Status and Button */}
            <div className="mt-6 flex items-center justify-between">
              {saveStatus && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    saveStatus.type === 'success' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {saveStatus.type === 'success' ? (
                    <Check size={16} />
                  ) : (
                    <X size={16} />
                  )}
                  <span className="text-sm font-medium">{saveStatus.message}</span>
                </motion.div>
              )}
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefreshSettings}
                  disabled={isLoading || isSaving}
                  className="px-4"
                >
                  <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {isSaving && (
                  <RefreshCw size={16} className="animate-spin text-blue-500" />
                )}
                <Button 
                  onClick={handleSaveSettings} 
                  className="px-8"
                  disabled={isSaving || isLoading}
                >
                  <Save className="mr-2" size={16} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings