import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// Load theme from localStorage
const loadTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('pawbuddy_theme')
    return (stored === 'dark' || stored === 'light') ? stored : 'light'
  } catch {
    return 'light'
  }
}

// Save theme to localStorage
const saveTheme = (theme: Theme) => {
  localStorage.setItem('pawbuddy_theme', theme)
}

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useTheme = create<ThemeState>((set) => {
  // Initialize theme on store creation
  const initialTheme = loadTheme()
  applyTheme(initialTheme)

  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      saveTheme(newTheme)
      applyTheme(newTheme)
      return { theme: newTheme }
    }),
    setTheme: (theme: Theme) => set(() => {
      saveTheme(theme)
      applyTheme(theme)
      return { theme }
    })
  }
})
