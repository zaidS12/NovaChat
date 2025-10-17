import React from 'react'
import { motion } from 'framer-motion'

const AccentColorPicker = ({ value, onChange, className = '' }) => {
  const colors = [
    { name: 'blue', bg: 'bg-blue-500', label: 'Blue' },
    { name: 'purple', bg: 'bg-purple-500', label: 'Purple' },
    { name: 'green', bg: 'bg-green-500', label: 'Green' },
    { name: 'red', bg: 'bg-red-500', label: 'Red' },
    { name: 'orange', bg: 'bg-orange-500', label: 'Orange' },
    { name: 'pink', bg: 'bg-pink-500', label: 'Pink' },
    { name: 'indigo', bg: 'bg-indigo-500', label: 'Indigo' },
    { name: 'teal', bg: 'bg-teal-500', label: 'Teal' }
  ]

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {colors.map(({ name, bg, label }) => (
        <motion.div
          key={name}
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={() => onChange(name)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-10 h-10 rounded-full ${bg} ${
            value === name 
              ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-md'
          }`} />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default AccentColorPicker
