import { create } from 'zustand'
import type { Pet, PetFilters, PetFormData } from '../types'
import api from '../utils/api'

const extractApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const maybeResponse = (error as { response?: { data?: { message?: string; error?: string } } }).response
    const serverMessage = maybeResponse?.data?.message || maybeResponse?.data?.error
    if (serverMessage) return serverMessage
  }

  return error instanceof Error ? error.message : fallback
}

const normalizePetListResponse = (payload: unknown): Pet[] => {
  const envelope = payload as { data?: unknown }
  const data = envelope?.data ?? payload

  if (Array.isArray(data)) return data as Pet[]
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items?: unknown[] }).items)) {
    return (data as { items: Pet[] }).items
  }

  return []
}

const normalizePetResponse = (payload: unknown): Pet => {
  const envelope = payload as { data?: unknown }
  const data = envelope?.data ?? payload
  return data as Pet
}

const formatAgeDisplayFromMonths = (months: number): string => {
  if (!Number.isFinite(months) || months <= 0) return 'Unknown age'
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`

  const years = months / 12
  const rounded = Math.round(years * 10) / 10
  return `${rounded} year${rounded === 1 ? '' : 's'}`
}

interface PetStore {
  pets: Pet[]
  isLoading: boolean
  error: string | null
  getPets: () => Promise<void>
  getPetById: (petId: string) => Pet | undefined
  getAllPets: () => Pet[]
  getAvailablePets: () => Pet[]
  getPetsByType: (type: 'dog' | 'cat') => Pet[]
  addPet: (petData: Omit<PetFormData, 'id'>) => Promise<Pet>
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>
  deletePet: (petId: string) => Promise<void>
  searchPets: (query: string, searchFields?: (keyof Pet)[]) => Pet[]
  filterPets: (filters: PetFilters) => Pet[]
  sortPets: (pets: Pet[], sortBy?: string) => Pet[]
  clearError: () => void
}

export const usePetStore = create<PetStore>((set, get) => {
  return {
    pets: [],
    isLoading: false,
    error: null,

    getPets: async () => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.get('/pets')
        const pets = normalizePetListResponse(response.data)
        set({ pets, isLoading: false })
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Failed to fetch pets')
        set({ error: message, isLoading: false })
      }
    },

    getPetById: (petId: string) => {
      return get().pets.find(pet => pet.id === petId)
    },

    getAllPets: () => {
      return get().pets
    },

    getAvailablePets: () => {
      return get().pets.filter(pet => pet.status === 'available')
    },

    getPetsByType: (type: 'dog' | 'cat') => {
      return get().pets.filter(pet => pet.type === type)
    },

    addPet: async (petData) => {
      set({ isLoading: true, error: null })

      try {
        const response = await api.post('/pets', petData)
        const newPet = normalizePetResponse(response.data)

        set(state => ({
          pets: [...state.pets, newPet],
          isLoading: false
        }))

        return newPet
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Failed to add pet')
        set({ error: message, isLoading: false })
        throw error
      }
    },

    updatePet: async (petId: string, updates: Partial<Pet>) => {
      set({ isLoading: true, error: null })

      try {
        const response = await api.put(`/pets/${petId}`, updates)
        const updatedPet = normalizePetResponse(response.data)

        set(state => ({
          pets: state.pets.map(pet => pet.id === petId ? updatedPet : pet),
          isLoading: false
        }))
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Failed to update pet')
        set({ error: message, isLoading: false })
        throw error
      }
    },

    deletePet: async (petId: string) => {
      set({ isLoading: true, error: null })

      try {
        await api.delete(`/pets/${petId}`)
        
        set(state => ({
          pets: state.pets.filter(pet => pet.id !== petId),
          isLoading: false
        }))
      } catch (error) {
        const message = extractApiErrorMessage(error, 'Failed to delete pet')
        set({ error: message, isLoading: false })
        throw error
      }
    },

    searchPets: (query: string, searchFields?: (keyof Pet)[]) => {
      const fields = searchFields || (['name', 'breed', 'location'] as (keyof Pet)[])
      if (!query || !query.trim()) return get().pets

      const lowerQuery = query.toLowerCase()
      return get().pets.filter(pet =>
        fields.some(field => {
          const value = pet[field]
          return typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
        })
      )
    },

    filterPets: (filters: PetFilters) => {
      let filtered = [...get().pets]

      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(p => p.type === filters.type as 'dog' | 'cat')
      }

      if (filters.breed && filters.breed !== 'all') {
        filtered = filtered.filter(p => p.breed === filters.breed)
      }

      if (filters.size && filters.size !== 'all') {
        filtered = filtered.filter(p => p.size === filters.size as 'small' | 'medium' | 'large')
      }

      if (filters.gender && filters.gender !== 'all') {
        filtered = filtered.filter(p => p.gender === filters.gender as 'male' | 'female')
      }

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === filters.status)
      }

      if (filters.location && filters.location.trim()) {
        filtered = filtered.filter(p =>
          p.location.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      if (filters.ageRange) {
        filtered = filtered.filter(p =>
          p.age >= filters.ageRange!.min && p.age <= filters.ageRange!.max
        )
      }

      return filtered
    },

    sortPets: (pets: Pet[], sortBy: string = 'newest') => {
      const petsCopy = [...pets]

      switch (sortBy) {
        case 'oldest':
          return petsCopy.sort((a, b) =>
            new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
          )
        case 'name-asc':
          return petsCopy.sort((a, b) => a.name.localeCompare(b.name))
        case 'name-desc':
          return petsCopy.sort((a, b) => b.name.localeCompare(a.name))
        case 'newest':
        default:
          return petsCopy.sort((a, b) =>
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          )
      }
    },

    clearError: () => set({ error: null })
  }
})

export const usePets = () => usePetStore()
