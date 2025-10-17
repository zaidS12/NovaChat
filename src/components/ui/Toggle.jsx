import React from 'react'
import { motion } from 'framer-motion'

const Toggle = ({ checked, onChange, disabled = false, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  }
  
  const thumbSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  const translateValues = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7'
  }

  return (
    <button
      type="button"
      className={`relative inline-flex items-center ${sizes[size]} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked 
          ? 'bg-blue-600' 
          : 'bg-slate-200 dark:bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <motion.span
        className={`${thumbSizes[size]} bg-white rounded-full shadow-lg transform transition-transform`}
        animate={{
          x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      />
    </button>
  )
}

export default Toggle
