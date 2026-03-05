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
  const [imageError, setImageError] = React.useState(false)

  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  }

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
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
        'rounded-full bg-gradient-to-br from-primary to-primary-dark',
        'flex items-center justify-center font-bold text-white shadow-sm',
        sizes[size],
        className
      )}
    >
      <span aria-hidden="true">{resolvedInitials}</span>
    </div>
  )
}
