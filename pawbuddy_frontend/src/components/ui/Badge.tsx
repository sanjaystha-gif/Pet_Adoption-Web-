import React from 'react'
import clsx from 'clsx'
import type { BadgeProps } from '../../types'

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', size = 'md', className = '' }) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-orange-100 text-orange-700',
    secondary: 'bg-purple-100 text-purple-700'
  }

  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      role="status"
      className={clsx(
        'inline-flex items-center font-semibold rounded-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
