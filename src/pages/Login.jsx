import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Github } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    // Validate form
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Show success message
        alert('Login successful! Welcome back!')
        
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        if (result.field) {
          setErrors({ [result.field]: result.message })
        } else {
          alert(result.message || 'Login failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setLoading(false)
      setShowOTP(false)
      // Handle success
    }, 1500)
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  return (
    <div className="page-background auth-bg min-h-screen flex relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-20 right-10 w-28 h-28 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -15, 0],
          x: [0, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/3 left-16 w-20 h-20 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 20, 0],
          x: [0, 15, 0],
          scale: [1, 0.95, 1]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-1/4 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-xl"
        animate={{ 
          rotate: [0, -180, -360]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
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
            Welcome Back
          </motion.h1>
          
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Welcome back — let's pick up where you left off.
          </motion.p>
          
          <motion.div
            className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-slate-400 dark:text-slate-500">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="currentColor">
                <circle cx="60" cy="60" r="50" fillOpacity="0.1" />
                <rect x="40" y="35" width="40" height="50" rx="8" fillOpacity="0.2" />
                <circle cx="60" cy="50" r="12" fillOpacity="0.3" />
                <path d="M45 65h30v15H45z" fillOpacity="0.3" />
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
                  Sign In
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Enter your credentials to access your account
                </p>
              </div>
              
              {!showOTP ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    showPasswordToggle
                    required
                  />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      />
                      <label htmlFor="rememberMe" className="text-base text-slate-600 dark:text-slate-400">
                        Remember me
                      </label>
                    </div>
                    
                    <Link 
                      to="/forgot-password" 
                      className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <Button
                      type="submit"
                      className="w-full transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      loading={loading}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-base">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" type="button">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="secondary" type="button">
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.form 
                  onSubmit={handleOTPSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>
                  
                  <Input
                    label="Verification Code"
                    name="otpCode"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    required
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                  >
                    Verify Code
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowOTP(false)}
                  >
                    Back to Login
                  </Button>
                </motion.form>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* OTP Modal Backdrop */}
      {showOTP && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  )
}

export default Login