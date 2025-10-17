import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Check, X, Github } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeToTerms: false
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const passwordStrength = {
    score: 0,
    feedback: 'Enter a password'
  }
  
  if (formData.password) {
    let score = 0
    if (formData.password.length >= 8) score++
    if (/[A-Z]/.test(formData.password)) score++
    if (/[0-9]/.test(formData.password)) score++
    if (/[^A-Za-z0-9]/.test(formData.password)) score++
    
    passwordStrength.score = score
    passwordStrength.feedback = [
      'Very weak',
      'Weak', 
      'Fair',
      'Good',
      'Strong'
    ][score]
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    // Validate form
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch('http://localhost/NovaChat/api/auth/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('novachat_user', JSON.stringify(data.user))
        
        // Show success message
        alert('Account created successfully! Please login to continue.')
        
        // Redirect to login page
        window.location.href = '/login'
      } else {
        if (data.field) {
          setErrors({ [data.field]: data.message })
        } else {
          alert(data.message || 'Signup failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  return (
    <div className="page-background auth-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 15, 0],
          x: [0, -15, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-1/3 w-16 h-16 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 20, 0],
          x: [0, 20, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center min-h-screen relative z-10">
        {/* Left Column - Hero */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md text-center">
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">NC</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Welcome to NovaChat
          </motion.h1>
          
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Create your account — get started in seconds.
          </motion.p>
          
          <motion.div
            className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-slate-400 dark:text-slate-500">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="currentColor">
                <circle cx="60" cy="60" r="50" fillOpacity="0.1" />
                <path d="M30 45h60v30H30z" fillOpacity="0.2" />
                <circle cx="45" cy="60" r="8" fillOpacity="0.3" />
                <circle cx="75" cy="60" r="8" fillOpacity="0.3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Create Account
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Join NovaChat and start your journey
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Enter your email address"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a strong password"
                    showPasswordToggle
                    required
                  />
                  
                  {formData.password && (
                    <motion.div 
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score <= 1 ? 'bg-red-500' :
                              passwordStrength.score <= 2 ? 'bg-yellow-500' :
                              passwordStrength.score <= 3 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 min-w-fit">
                          {passwordStrength.feedback}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    success={formData.confirmPassword && formData.password === formData.confirmPassword ? 'Passwords match' : ''}
                    placeholder="Confirm your password"
                    showPasswordToggle
                    required
                  />
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <Input
                    label="Referral Code"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Enter referral code"
                  />
                  <motion.span 
                    className="absolute -top-1 right-0 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
                    initial={{ opacity: 0, scale: 0.8, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Optional
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <motion.input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-200"
                    required
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <label htmlFor="agreeToTerms" className="text-base text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </label>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-full transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    loading={loading}
                    disabled={!formData.agreeToTerms}
                  >
                    Create Account
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="secondary" type="button" className="w-full transition-all duration-200">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="secondary" type="button" className="w-full transition-all duration-200">
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
              
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Signup