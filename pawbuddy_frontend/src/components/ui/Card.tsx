import React from 'react'
import clsx from 'clsx'
import type { CardProps } from '../../types'

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200',
        hover && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
