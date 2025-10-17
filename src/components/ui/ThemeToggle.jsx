import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../utils/cn'

const ThemeToggle = ({ className, ...props }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      className={cn(
        'relative inline-flex h-10 w-18 items-center rounded-full transition-all duration-300',
        'bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-700/80 dark:hover:bg-slate-600/80',
        'border border-slate-300/50 dark:border-slate-600/50',
        'backdrop-blur-sm shadow-sm hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800',
        'transform hover:scale-105 active:scale-95',
        'z-10 relative',
        'min-w-[4.5rem] flex-shrink-0',
        className
      )}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {/* Toggle Circle */}
      <motion.div
        className="absolute left-1 top-1 h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-600"
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
        }}
      >
        <motion.div
          animate={{ 
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon size={16} className="text-blue-400" />
          ) : (
            <Sun size={16} className="text-yellow-500" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-3">
        <motion.div
          className="flex items-center justify-center"
          animate={{
            opacity: isDark ? 0.4 : 0.8,
            scale: isDark ? 0.7 : 1,
            rotate: isDark ? -20 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Sun size={14} className="text-amber-500 dark:text-amber-400" />
        </motion.div>
        <motion.div
          className="flex items-center justify-center"
          animate={{
            opacity: isDark ? 0.8 : 0.4,
            scale: isDark ? 1 : 0.7,
            rotate: isDark ? 0 : 20,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Moon size={14} className="text-indigo-500 dark:text-indigo-400" />
        </motion.div>
      </div>
    </motion.button>
  )
}

export default ThemeToggle