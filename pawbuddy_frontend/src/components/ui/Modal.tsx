import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import clsx from 'clsx'
import type { ModalProps } from '../../types'

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '', size = 'md' }) => {
  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  const dialogRef = React.useRef<HTMLDivElement | null>(null)
  const titleId = React.useId()

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    // focus the dialog for accessibility
    dialogRef.current?.focus()
    // prevent body scroll
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        ref={dialogRef}
        tabIndex={-1}
        className={clsx(
          'relative bg-white rounded-2xl shadow-2xl p-8 w-full mx-4',
          sizes[size],
          'transform transition-all duration-300 scale-100 opacity-100',
          className
        )}
      >
        {/* Header */}
        {title ? (
          <div className="flex items-center justify-between mb-6">
            <h2 id={titleId} className="text-2xl font-bold text-primary">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Close modal"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <AiOutlineClose size={24} />
          </button>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
