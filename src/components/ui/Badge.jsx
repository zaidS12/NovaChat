import React from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = {
  default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
}

const sizeVariants = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
}

const Badge = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'sm',
  children, 
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        badgeVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export { Badge }
export default Badge