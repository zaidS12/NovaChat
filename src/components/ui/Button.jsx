import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-elevation-medium hover:shadow-elevation-high',
  secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-elevation-medium hover:shadow-elevation-high'
}

const sizeVariants = {
  sm: 'px-3 py-1.5 text-base',
  md: 'px-4 py-2 text-lg',
  lg: 'px-6 py-3 text-xl'
}

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-fast focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.12 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button