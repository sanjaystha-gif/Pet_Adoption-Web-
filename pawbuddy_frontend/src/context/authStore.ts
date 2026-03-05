import { create } from 'zustand'
import type { User, AuthState, LoginFormData, RegisterFormData } from '../types'
import { MOCK_USERS } from '../utils/mockData'
import { delay } from '../utils/helpers'
import api from '../utils/api'

const extractApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const maybeResponse = (error as { response?: { data?: { message?: string; error?: string } } }).response
    const serverMessage = maybeResponse?.data?.message || maybeResponse?.data?.error
    if (serverMessage) return serverMessage
  }

  return error instanceof Error ? error.message : fallback
}

const withDefaultAvatar = (user: User): User => {
  if (user.avatar) return user
  const seed = user.email || user.name || user.id || 'user'
  return {
    ...user,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
  }
}

const persistAuthState = (user: User, token?: string, refreshToken?: string) => {
  const normalizedUser = withDefaultAvatar(user)
  const authData = { user: normalizedUser, isAuthenticated: true }
  localStorage.setItem('pawbuddy_auth', JSON.stringify(authData))

  if (token) {
    localStorage.setItem('authToken', token)
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (formData: RegisterFormData) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Initialize from localStorage
  const savedAuth = localStorage.getItem('pawbuddy_auth')
  const initialState = savedAuth ? JSON.parse(savedAuth) : {
    user: null,
    isAuthenticated: false
  }

  return {
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null })

      try {
        try {
          // Prefer backend auth so protected APIs (e.g. POST /pets) receive a valid bearer token.
          const response = await api.post('/auth/login', { email, password })
          const data = response.data?.data || response.data
          const user = data?.user as User | undefined
          const accessToken = data?.accessToken as string | undefined
          const refreshToken = data?.refreshToken as string | undefined

          if (!user || !accessToken) {
            throw new Error('Invalid login response from server')
          }

          const normalizedUser = withDefaultAvatar(user)
          persistAuthState(normalizedUser, accessToken, refreshToken)
          set({ user: normalizedUser, isAuthenticated: true, isLoading: false })
          return
        } catch (apiError) {
          // Keep existing mock-auth behavior as a fallback when backend auth is unavailable.
          await delay(500)

          const user = MOCK_USERS.find(u => u.email === email)

          if (!user) {
            const message = extractApiErrorMessage(apiError, 'User not found')
            throw new Error(message)
          }

          if (user.password !== password) {
            throw new Error('Invalid password')
          }

          const { password: _, ...userWithoutPassword } = user
          const normalizedUser = withDefaultAvatar(userWithoutPassword)
          persistAuthState(normalizedUser)
          set({ user: normalizedUser, isAuthenticated: true, isLoading: false })
        }
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Login failed')
        set({ error: message, isLoading: false })
        throw error
      }
    },

    register: async (formData: RegisterFormData) => {
      set({ isLoading: true, error: null })
      await delay(500)

      try {
        if (MOCK_USERS.find(u => u.email === formData.email)) {
          throw new Error('Email already registered')
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: 'adopter',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
          bio: '',
          city: '',
          joinedDate: new Date().toISOString()
        }

        MOCK_USERS.push({ ...newUser, password: formData.password })

        const { password: _, ...userWithoutPassword } = newUser
        const normalizedUser = withDefaultAvatar(userWithoutPassword)
        persistAuthState(normalizedUser)
        set({ user: normalizedUser, isAuthenticated: true, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    logout: () => {
      localStorage.removeItem('pawbuddy_auth')
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false })
    },

    updateProfile: async (updates: Partial<User>) => {
      set({ isLoading: true, error: null })
      await delay(300)

      try {
        const currentUser = get().user
        if (!currentUser) throw new Error('Not authenticated')

        const updatedUser = withDefaultAvatar({ ...currentUser, ...updates })
        const existingToken = localStorage.getItem('authToken') || undefined
        const existingRefreshToken = localStorage.getItem('refreshToken') || undefined
        persistAuthState(updatedUser, existingToken, existingRefreshToken)
        set({ user: updatedUser, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    clearError: () => set({ error: null })
  }
})

// Hook for component usage
interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isAdopter: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (formData: RegisterFormData) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuth = (): UseAuthReturn => {
  const { user, isAuthenticated, isLoading, error, ...actions } = useAuthStore()
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isAdopter: user?.role === 'adopter',
    isLoading,
    error,
    ...actions
  }
}
