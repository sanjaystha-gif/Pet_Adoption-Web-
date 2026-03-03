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
  const baseStyles = 'font-semibold transition-all duration-200 flex items-center justify-center gap-2'

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md',
    ghost: 'text-primary hover:bg-orange-50',
    danger: 'bg-error text-white hover:bg-red-600 shadow-md hover:shadow-lg',
    success: 'bg-success text-white hover:bg-green-600 shadow-md hover:shadow-lg',
    secondary: 'bg-accent text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
  }

  const sizes: Record<string, string> = {
    sm: 'px-5 py-2 text-sm rounded-xl',
    md: 'px-7 py-2.5 text-base rounded-xl',
    lg: 'px-9 py-3.5 text-lg rounded-xl'
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
