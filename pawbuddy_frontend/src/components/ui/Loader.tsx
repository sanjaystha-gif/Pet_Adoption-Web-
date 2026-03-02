import React from 'react'
import clsx from 'clsx'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullPage = false }) => {
  const sizes: Record<string, string> = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-2">
          <div
            className={clsx('border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin', sizes['lg'])}
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div role="status" aria-live="polite" className="flex items-center gap-2">
        <div
          className={clsx('border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin', sizes[size])}
          aria-hidden="true"
        />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  )
}
