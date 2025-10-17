import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  success,
  placeholder,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className="relative">
      {label && (
        <motion.label
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none text-center',
            isFocused || hasValue
              ? 'text-sm text-blue-500 dark:text-blue-400'
              : 'text-lg text-slate-500 dark:text-slate-400'
          )}
          style={{
            transformOrigin: 'center center',
          }}
          animate={{
            y: isFocused || hasValue ? -20 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            x: '-50%', // This is crucial for centering
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'w-full px-3 py-3 bg-white dark:bg-slate-800 border rounded-md transition-all duration-200 focus-ring text-lg', // Added text-lg for larger font
            // Centering placeholder text
            'placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-center',
            // Centering input text when focused or has value
            (isFocused || hasValue) && 'text-center',
            label ? 'pt-6 pb-2' : '',
            error
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400'
              : success
                ? 'border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400'
                : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400',
            isFocused && !error && !success && 'shadow-elevation-low',
            className
          )}
          placeholder={isFocused || hasValue ? '' : placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-green-500 dark:text-green-400"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;