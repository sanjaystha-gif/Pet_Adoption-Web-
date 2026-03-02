// Cloudinary configuration and utilities
declare global {
  interface Window {
    cloudinary: any
  }
}

const CLOUD_NAME = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
const UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'pawbuddy'

/**
 * Opens Cloudinary upload widget
 */
export const openCloudinaryWidget = (
  onSuccess?: (url: string) => void,
  onError?: (error: any) => void
): void => {
  if (!window.cloudinary) {
    console.error('Cloudinary widget not loaded')
    onError?.('Cloudinary not available')
    return
  }

  window.cloudinary.openUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      sources: ['local', 'instagram', 'twitter', 'url'],
      multiple: true,
      maxFiles: 5,
      folder: 'pawbuddy/pets',
      cropping: 'free',
      resourceType: 'image',
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#E8705A',
          tabIcon: '#E8705A',
          menuIcons: '#7A6A65',
          textDark: '#2D1B14',
          textLight: '#FFFFFF',
          link: '#E8705A',
          action: '#E8705A',
          inactiveTabIcon: '#7A6A65',
          error: '#F44235',
          inProgress: '#E8705A',
          complete: '#A8D5BA',
          sourceBg: '#FFF8F6'
        }
      }
    },
    (error: any, result: any) => {
      if (error) {
        console.error('Cloudinary error:', error)
        onError?.(error)
      } else if (result && result.event === 'success') {
        onSuccess?.(result.info.secure_url)
      }
    }
  )
}

/**
 * Optimizes Cloudinary URL with transformations
 */
export const optimizeCloudinaryUrl = (
  url: string | undefined | null,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  } = {}
): string | null => {
  if (!url) return null

  const {
    width = 400,
    height = 300,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options

  // If it's a demo Cloudinary URL, return as is
  if (url.includes('res.cloudinary.com/demo')) {
    return url
  }

  // For other Cloudinary URLs, add transformations
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${parts[1]}`
    }
  }

  return url
}

/**
 * Generate a placeholder image URL
 */
export const getPlaceholderImage = (seed: string): string => {
  return `https://picsum.photos/seed/${seed}/400/300`
}
