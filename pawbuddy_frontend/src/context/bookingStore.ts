import { create } from 'zustand'
import type { Booking, BookingFormData } from '../types'
import { MOCK_BOOKINGS } from '../utils/mockData'
import { delay, generateId } from '../utils/helpers'

interface BookingStore {
  bookings: Booking[]
  favourites: string[]
  isLoading: boolean
  error: string | null
  getBookings: () => Promise<void>
  getBookingById: (bookingId: string) => Booking | undefined
  getUserBookings: (userId: string) => Booking[]
  createBooking: (bookingData: Omit<BookingFormData, 'id'>) => Promise<Booking>
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>
  approveBooking: (bookingId: string) => Promise<void>
  rejectBooking: (bookingId: string) => Promise<void>
  cancelBooking: (bookingId: string) => Promise<void>
  toggleFavourite: (petId: string) => void
  addFavourite: (petId: string) => void
  removeFavourite: (petId: string) => void
  isFavourite: (petId: string) => boolean
  getFavourites: () => string[]
  getPendingBookings: () => Booking[]
  getBookingsByStatus: (status: Booking['status']) => Booking[]
  clearError: () => void
}

export const useBookingStore = create<BookingStore>((set, get) => {
  return {
    bookings: [...MOCK_BOOKINGS],
    favourites: localStorage.getItem('pawbuddy_favourites')
      ? JSON.parse(localStorage.getItem('pawbuddy_favourites')!)
      : [],
    isLoading: false,
    error: null,

    getBookings: async () => {
      set({ isLoading: true, error: null })
      await delay(300)
      try {
        set({ isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch bookings'
        set({ error: message, isLoading: false })
      }
    },

    getBookingById: (bookingId: string) => {
      return get().bookings.find(b => b.id === bookingId)
    },

    getUserBookings: (userId: string) => {
      return get().bookings.filter(b => b.adopterId === userId)
    },

    createBooking: async (bookingData) => {
      set({ isLoading: true, error: null })
      await delay(300)

      try {
        const newBooking: Booking = {
          id: generateId('booking-'),
          petId: bookingData.petId,
          petName: bookingData.petName,
          petImage: bookingData.petImage,
          adopterId: bookingData.adopterId ?? '',
          adopterName: bookingData.adopterName ?? '',
          adopterEmail: bookingData.adopterEmail ?? '',
          adopterPhone: bookingData.adopterPhone,
          message: bookingData.message,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        set(state => ({
          bookings: [...state.bookings, newBooking],
          isLoading: false
        }))

        return newBooking
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create booking'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
      set({ isLoading: true, error: null })
      await delay(300)

      try {
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId
              ? { ...b, status, updatedAt: new Date().toISOString() }
              : b
          ),
          isLoading: false
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update booking'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    approveBooking: async (bookingId: string) => {
      return get().updateBookingStatus(bookingId, 'approved')
    },

    rejectBooking: async (bookingId: string) => {
      return get().updateBookingStatus(bookingId, 'rejected')
    },

    cancelBooking: async (bookingId: string) => {
      set({ isLoading: true, error: null })
      await delay(300)

      try {
        set(state => ({
          bookings: state.bookings.filter(b => b.id !== bookingId),
          isLoading: false
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to cancel booking'
        set({ error: message, isLoading: false })
        throw error
      }
    },

    toggleFavourite: (petId: string) => {
      set(state => {
        const favourites = state.favourites.includes(petId)
          ? state.favourites.filter(id => id !== petId)
          : [...state.favourites, petId]

        localStorage.setItem('pawbuddy_favourites', JSON.stringify(favourites))
        return { favourites }
      })
    },

    addFavourite: (petId: string) => {
      set(state => {
        if (state.favourites.includes(petId)) {
          return state
        }

        const favourites = [...state.favourites, petId]
        localStorage.setItem('pawbuddy_favourites', JSON.stringify(favourites))
        return { favourites }
      })
    },

    removeFavourite: (petId: string) => {
      set(state => {
        const favourites = state.favourites.filter(id => id !== petId)
        localStorage.setItem('pawbuddy_favourites', JSON.stringify(favourites))
        return { favourites }
      })
    },

    isFavourite: (petId: string) => {
      return get().favourites.includes(petId)
    },

    getFavourites: () => {
      return get().favourites
    },

    getPendingBookings: () => {
      return get().bookings.filter(b => b.status === 'pending')
    },

    getBookingsByStatus: (status: Booking['status']) => {
      return get().bookings.filter(b => b.status === status)
    },

    clearError: () => set({ error: null })
  }
})

export const useBooking = () => useBookingStore()
