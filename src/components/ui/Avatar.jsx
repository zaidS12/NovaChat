import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const sizeVariants = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg'
}

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt, 
  fallback,
  size = 'md',
  online = false,
  ...props 
}, ref) => {
  const initials = fallback || (alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase() : '?')
  
  return (
    <div className={cn('relative inline-block', className)} ref={ref} {...props}>
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden',
          sizeVariants[size]
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div 
          className={cn(
            'flex h-full w-full items-center justify-center font-medium text-slate-600 dark:text-slate-300',
            src ? 'hidden' : 'flex'
          )}
        >
          {initials}
        </div>
      </motion.div>
      
      {online && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-800"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar