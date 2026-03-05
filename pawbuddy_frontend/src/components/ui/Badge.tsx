import React from 'react'
import clsx from 'clsx'
import type { BadgeProps } from '../../types'

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', size = 'md', className = '' }) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200',
    error: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
    primary: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200',
    secondary: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
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
