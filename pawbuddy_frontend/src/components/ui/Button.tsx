import React from 'react'
import clsx from 'clsx'
import type { ButtonProps } from '../../types'

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'font-semibold transition-all duration-300 flex items-center justify-center gap-2'

  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 disabled:opacity-50',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
    danger: 'bg-error text-white hover:bg-red-600 active:scale-95',
    success: 'bg-accent text-white hover:bg-green-600 active:scale-95',
    secondary: 'bg-secondary-700 text-white hover:bg-secondary-800 active:scale-95'
  }

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-lg rounded-full'
  }

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <>
          <div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
