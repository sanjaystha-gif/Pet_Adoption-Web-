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
        'bg-card rounded-2xl shadow-branded p-6 transition-all duration-300',
        hover && 'hover:shadow-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
