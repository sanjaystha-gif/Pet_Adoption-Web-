import React from 'react'
import clsx from 'clsx'
import type { InputProps } from '../../types'

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  size = 'md',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const sizes: Record<string, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  }

  const generatedId = React.useId()
  const inputId = id ?? generatedId

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary dark:text-primary-light mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <input
        className={clsx(
          'w-full border-2 border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-all duration-300',
          'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900',
          'placeholder-text-secondary/50 dark:placeholder-gray-500',
          sizes[size],
          error && 'border-error focus:border-error focus:ring-error/10',
          disabled && 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-50',
          className
        )}
        id={inputId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  )
}
