import React from 'react'
import clsx from 'clsx'
import type { AvatarProps } from '../../types'

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  initials = '',
  className = ''
}) => {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    )
  }
  const resolvedInitials = initials || alt.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      role="img"
      aria-label={alt}
      className={clsx(
        'rounded-full bg-gradient-to-br from-primary-600 to-primary-700',
        'flex items-center justify-center font-bold text-white',
        sizes[size],
        className
      )}
    >
      <span aria-hidden="true">{resolvedInitials}</span>
    </div>
  )
}
