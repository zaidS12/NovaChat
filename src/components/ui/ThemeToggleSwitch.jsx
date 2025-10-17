import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

const ThemeToggleSwitch = ({ value, onChange, className = '' }) => {
  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ]

  const currentTheme = themes.find(theme => theme.value === value) || themes[0]
  const currentIndex = themes.findIndex(theme => theme.value === value)

  const handleToggle = () => {
    const nextIndex = (currentIndex + 1) % themes.length
    onChange(themes[nextIndex].value)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Switch Container */}
      <motion.button
        className="relative w-24 h-12 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-blue-300 dark:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Toggle Handle */}
        <motion.div
          className="absolute top-1 left-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            x: currentIndex * 32 // 32px spacing between positions
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        >
          {React.createElement(currentTheme.icon, { 
            size: 20, 
            className: currentTheme.value === 'light' ? 'text-yellow-500' : 
                      currentTheme.value === 'dark' ? 'text-blue-500' : 
                      'text-slate-500' 
          })}
        </motion.div>

      </motion.button>

      {/* Theme Label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {currentTheme.label}
        </span>
      </div>
    </div>
  )
}

export default ThemeToggleSwitch
