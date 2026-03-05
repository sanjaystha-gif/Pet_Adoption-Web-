import type { User, Pet, Booking } from '../types'

// Mock auth users
export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@pawbuddy.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    phone: '555-0001',
    bio: 'PawBuddy Administrator',
    city: 'San Francisco',
    joinedDate: '2024-01-01'
  },
  {
    id: 'user-1',
    name: 'Samantha Smith',
    email: 'sam@email.com',
    password: 'user123',
    role: 'adopter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=samantha',
    phone: '555-0002',
    bio: 'Dog lover and cat enthusiast',
    city: 'San Francisco',
    joinedDate: '2024-02-15'
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john@email.com',
    password: 'user123',
    role: 'adopter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    phone: '555-0003',
    bio: 'Looking for a furry friend',
    city: 'Los Angeles',
    joinedDate: '2024-03-20'
  },
  {
    id: 'user-3',
    name: 'Test User',
    email: 'jhole12@gmail.com',
    password: 'password123',
    role: 'adopter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jhole12',
    phone: '555-0004',
    bio: 'Pet adoption enthusiast',
    city: 'New York',
    joinedDate: '2024-11-01'
  },
  {
    id: 'user-4',
    name: 'Puskas User',
    email: 'puskas1@gmail.com',
    password: 'password123',
    role: 'adopter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=puskas1',
    phone: '555-0005',
    bio: 'Pet lover',
    city: 'Tech City',
    joinedDate: '2024-11-15'
  }
]

// Mock pets - Empty array, will be populated when admin adds pets
export const MOCK_PETS: Pet[] = []

// Mock bookings - Empty array, bookings are now persisted in localStorage
export const MOCK_BOOKINGS: Booking[] = []
