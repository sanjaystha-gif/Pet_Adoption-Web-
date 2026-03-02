import React from 'react'
import clsx from 'clsx'
import type { BadgeProps } from '../../types'

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', size = 'md', className = '' }) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    success: 'bg-accent/20 text-green-700',
    warning: 'bg-warning/20 text-yellow-700',
    error: 'bg-error/20 text-red-700',
    info: 'bg-info/20 text-blue-700',
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700'
  }

  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      role="status"
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
