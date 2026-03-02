import { create } from 'zustand'
import type { User, AuthState, RegisterFormData } from '../types'
import { MOCK_USERS } from '../utils/mockData'
import { delay } from '../utils/helpers'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (formData: RegisterFormData) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

// Safe localStorage helpers
const readSavedAuth = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { user: null, isAuthenticated: false }
    const raw = window.localStorage.getItem('pawbuddy_auth')
    if (!raw) return { user: null, isAuthenticated: false }
    const parsed = JSON.parse(raw)
    return { user: parsed.user ?? null, isAuthenticated: !!parsed.isAuthenticated }
  } catch {
    return { user: null, isAuthenticated: false }
  }
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const initial = readSavedAuth()

  return {
    user: initial.user,
    isAuthenticated: initial.isAuthenticated,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null })
      await delay(500)

      try {
        const user = MOCK_USERS.find(u => u.email === email)
        if (!user) throw new Error('User not found')
        if (user.password !== password) throw new Error('Invalid password')

        const userCopy = { ...user }
        delete (userCopy as any).password
        const userWithoutPassword = userCopy
        const authData = { user: userWithoutPassword, isAuthenticated: true }
        try { window.localStorage.setItem('pawbuddy_auth', JSON.stringify(authData)) } catch {}
        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    register: async (formData: RegisterFormData) => {
      set({ isLoading: true, error: null })
      await delay(500)

      try {
        if (MOCK_USERS.find(u => u.email === formData.email)) throw new Error('Email already registered')

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

        // store mock password for local mock auth only
        MOCK_USERS.push({ ...newUser, password: formData.password })

        const userCopy = { ...newUser }
        delete (userCopy as any).password
        const userWithoutPassword = userCopy
        const authData = { user: userWithoutPassword, isAuthenticated: true }
        try { window.localStorage.setItem('pawbuddy_auth', JSON.stringify(authData)) } catch {}

        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    logout: () => {
      try { window.localStorage.removeItem('pawbuddy_auth') } catch {}
      set({ user: null, isAuthenticated: false })
    },

    updateProfile: async (updates: Partial<User>) => {
      set({ isLoading: true, error: null })
      await delay(300)

      try {
        const currentUser = get().user
        if (!currentUser) throw new Error('Not authenticated')

        const updatedUser = { ...currentUser, ...updates }
        const authData = { user: updatedUser, isAuthenticated: true }
        try { window.localStorage.setItem('pawbuddy_auth', JSON.stringify(authData)) } catch {}
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
  const { user, isAuthenticated, isLoading, error, login, register, logout, updateProfile, clearError } = useAuthStore()
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isAdopter: user?.role === 'adopter',
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  }
}
