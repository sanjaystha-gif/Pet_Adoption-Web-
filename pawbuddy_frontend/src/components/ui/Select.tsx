import React from 'react'
import clsx from 'clsx'
import type { SelectProps } from '../../types'

export const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  error,
  required = false,
  size = 'md',
  disabled = false,
  placeholder = 'Select an option',
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
  const selectId = id ?? generatedId

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <select
        className={clsx(
          'w-full border-2 border-border rounded-lg transition-all duration-300',
          'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'bg-white cursor-pointer',
          sizes[size],
          error && 'border-error focus:border-error focus:ring-error/10',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-50',
          className
        )}
        id={selectId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  )
}
