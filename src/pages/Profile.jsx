import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Award, 
  Star, 
  MessageCircle, 
  Users, 
  Activity, 
  Settings, 
  ArrowLeft,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/ui/ThemeToggle'

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'AI enthusiast, full-stack developer, and tech innovator. Passionate about creating meaningful digital experiences and exploring the intersection of technology and human creativity.',
    website: 'https://johndoe.dev',
    joinDate: '2023-01-15',
    avatar: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/200',
    
    // Social Links
    social: {
      github: 'johndoe',
      twitter: 'johndoe',
      linkedin: 'johndoe',
      instagram: 'johndoe'
    },
    
    // Stats
    stats: {
      conversations: 1247,
      connections: 892,
      achievements: 15,
      rating: 4.8
    }
  })
  
  const [editForm, setEditForm] = useState({ ...profile })
  
  const achievements = [
    { id: 1, title: 'Early Adopter', description: 'Joined in the first month', icon: '🚀', earned: true },
    { id: 2, title: 'Conversationalist', description: '1000+ conversations', icon: '💬', earned: true },
    { id: 3, title: 'Helper', description: 'Helped 100+ users', icon: '🤝', earned: true },
    { id: 4, title: 'Innovator', description: 'Suggested 10+ features', icon: '💡', earned: false },
    { id: 5, title: 'Community Leader', description: 'Top contributor', icon: '👑', earned: false },
    { id: 6, title: 'Mentor', description: 'Mentored new users', icon: '🎓', earned: true }
  ]
  
  const recentActivity = [
    { id: 1, type: 'conversation', content: 'Started a conversation about AI ethics', time: '2 hours ago' },
    { id: 2, type: 'achievement', content: 'Earned "Helper" achievement', time: '1 day ago' },
    { id: 3, type: 'connection', content: 'Connected with Sarah Johnson', time: '2 days ago' },
    { id: 4, type: 'conversation', content: 'Completed project discussion', time: '3 days ago' }
  ]
  
  const handleSave = () => {
    setProfile({ ...editForm })
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditForm({ ...profile })
    setIsEditing(false)
  }
  
  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://novachat.app/profile/${profile.username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`text-${color}-600 dark:text-${color}-400`} size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </motion.div>
  )
  
  return (
    <div className="page-background min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 right-24 w-36 h-36 bg-violet-200/15 dark:bg-violet-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -35, 0],
          x: [0, 25, 0],
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/3 left-12 w-26 h-26 bg-rose-200/15 dark:bg-rose-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, 28, 0],
          x: [0, -18, 0],
          scale: [1, 0.75, 1]
        }}
        transition={{ 
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      />
      <motion.div 
        className="absolute bottom-28 right-1/6 w-22 h-22 bg-sky-200/15 dark:bg-sky-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -22, 0],
          rotate: [0, -360, 0]
        }}
        transition={{ 
          duration: 19,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute top-2/3 right-16 w-20 h-20 bg-amber-200/15 dark:bg-amber-500/10 rounded-full blur-lg"
        animate={{ 
          y: [0, 18, 0],
          x: [0, 12, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      <motion.div 
        className="absolute bottom-1/5 left-1/5 w-30 h-30 bg-lime-200/15 dark:bg-lime-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 30, 0],
          rotate: [0, 120, 240, 360]
        }}
        transition={{ 
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your personal information and public profile
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={copyProfileLink}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-2">{copied ? 'Copied!' : 'Share Profile'}</span>
            </Button>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
        
        {/* Cover Image */}
        <div className="relative mb-8">
          <div 
            className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl relative overflow-hidden"
            style={{
              backgroundImage: `url(${profile.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <motion.button
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera size={16} />
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <Avatar 
                      src={profile.avatar} 
                      alt={profile.name}
                      fallback={profile.name.split(' ').map(n => n[0]).join('')}
                      size="2xl"
                      className="border-4 border-white dark:border-slate-800 shadow-lg"
                    />
                    <motion.button
                      className="absolute -bottom-2 -right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera size={16} />
                    </motion.button>
                  </div>
                  
                  {/* Name and Username */}
                  {isEditing ? (
                    <div className="space-y-3 mb-4">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="text-center"
                      />
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="text-center"
                        placeholder="@username"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {profile.name}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">@{profile.username}</p>
                    </div>
                  )}
                  
                  {/* Bio */}
                  {isEditing ? (
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 mb-4"
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  {isEditing ? (
                    <div className="flex space-x-3">
                      <Button onClick={handleSave} className="flex-1">
                        <Save size={16} className="mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex-1">
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <Button onClick={() => setIsEditing(true)} className="flex-1">
                        <Edit3 size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline">
                        <Settings size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      label="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <Input
                      label="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Input
                      label="Website"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <Mail size={16} />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <Phone size={16} />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <Globe size={16} />
                      <a href={profile.website} className="hover:text-blue-500 transition-colors">
                        {profile.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <Calendar size={16} />
                      <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { platform: 'github', icon: Github, color: 'slate' },
                    { platform: 'twitter', icon: Twitter, color: 'blue' },
                    { platform: 'linkedin', icon: Linkedin, color: 'blue' },
                    { platform: 'instagram', icon: Instagram, color: 'pink' }
                  ].map(({ platform, icon: Icon, color }) => (
                    <motion.a
                      key={platform}
                      href={`https://${platform}.com/${profile.social[platform]}`}
                      className={`flex items-center space-x-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-${color}-300 dark:hover:border-${color}-600 transition-colors group`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`text-${color}-600 dark:text-${color}-400`} size={16} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                        {profile.social[platform]}
                      </span>
                      <ExternalLink className="text-slate-400 ml-auto" size={12} />
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={MessageCircle} 
                label="Conversations" 
                value={profile.stats.conversations.toLocaleString()} 
                color="blue"
              />
              <StatCard 
                icon={Users} 
                label="Connections" 
                value={profile.stats.connections.toLocaleString()} 
                color="green"
              />
              <StatCard 
                icon={Award} 
                label="Achievements" 
                value={profile.stats.achievements} 
                color="purple"
              />
              <StatCard 
                icon={Star} 
                label="Rating" 
                value={profile.stats.rating} 
                color="yellow"
              />
            </div>
            
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        achievement.earned
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.earned 
                              ? 'text-slate-900 dark:text-slate-100' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.earned 
                              ? 'text-slate-600 dark:text-slate-300' 
                              : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="text-yellow-500">
                            <Award size={16} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity size={20} />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === 'conversation' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'achievement' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {activity.type === 'conversation' && <MessageCircle size={14} className="text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'achievement' && <Award size={14} className="text-yellow-600 dark:text-yellow-400" />}
                        {activity.type === 'connection' && <Users size={14} className="text-green-600 dark:text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-slate-100">{activity.content}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile