/**
 * Simulates an async API call with delay
 */
export const delay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Calculate pet age in display format
 */
export const calculateAgeDisplay = (ageMonths: number): string => {
  if (ageMonths < 12) {
    return `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`
  }
  const years = Math.floor(ageMonths / 12)
  const months = ageMonths % 12
  let display = `${years} year${years !== 1 ? 's' : ''}`
  if (months > 0) {
    display += ` ${months} month${months !== 1 ? 's' : ''}`
  }
  return display
}

/**
 * Group array of objects by a key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, obj) => {
    const group = obj[key] as string
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(obj)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Filter array with multiple conditions
 */
export const multiFilter = <T extends Record<string, any>>(
  array: T[],
  filters: Record<string, any>
): T[] => {
  return array.filter(item => {
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined || value === '') continue
      if (typeof value === 'string' && value.toLowerCase() === 'all') continue

      if (Array.isArray(value)) {
        if (!value.includes(item[key])) return false
      } else if (typeof value === 'object') {
        if (value.min !== undefined && item[key] < value.min) return false
        if (value.max !== undefined && item[key] > value.max) return false
      } else {
        if (item[key] !== value) return false
      }
    }
    return true
  })
}

/**
 * Search in array of objects
 */
export const searchInArray = <T extends Record<string, any>>(
  array: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!query || !query.trim()) return array

  const lowerQuery = query.toLowerCase()
  return array.filter(item => {
    return searchFields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery)
      }
      return false
    })
  })
}

/**
 * Sort array
 */
export const sortArray = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    if (typeof a[key] === 'string') {
      return direction === 'asc'
        ? (a[key] as string).localeCompare(b[key] as string)
        : (b[key] as string).localeCompare(a[key] as string)
    }
    return direction === 'asc'
      ? (a[key] as number) - (b[key] as number)
      : (b[key] as number) - (a[key] as number)
  })
}

/**
 * Generate UUID
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return `${prefix}${timestamp}${randomStr}`
}

/**
 * Validate email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined
  return (...args: Parameters<T>) => {
    if (timeout !== undefined) clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), delay)
  }
}

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const mergeObjects = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  return Object.assign({}, target, ...sources)
}

/**
 * Get value from nested object with path
 */
export const getNestedValue = (
  obj: Record<string, any>,
  path: string
): any => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

/**
 * Capitalize string
 */
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'available': 'bg-accent/20 text-green-700',
    'pending': 'bg-warning/20 text-yellow-700',
    'adopted': 'bg-error/20 text-red-700',
    'approved': 'bg-accent/20 text-green-700',
    'rejected': 'bg-error/20 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Get status badge
 */
export const getStatusBadge = (
  status: string
): { text: string; color: string } => {
  const badges: Record<string, { text: string; color: string }> = {
    'available': { text: 'Available', color: 'success' },
    'pending': { text: 'Pending', color: 'warning' },
    'adopted': { text: 'Adopted', color: 'error' },
    'approved': { text: 'Approved', color: 'success' },
    'rejected': { text: 'Rejected', color: 'error' }
  }
  return badges[status] || { text: status, color: 'info' }
}
