import React from 'react'
import clsx from 'clsx'
import type { TextareaProps } from '../../types'

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  required = false,
  rows = 4,
  className = '',
  id,
  ...props
}) => {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={clsx(
          'w-full border-2 border-border rounded-lg transition-all duration-300',
          'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'placeholder-text-secondary/50 resize-vertical',
          'p-4 text-base font-body',
          error && 'border-error focus:border-error focus:ring-error/10',
          className
        )}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  )
}
