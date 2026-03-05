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
  }
]

// Mock pets - Empty array, will be populated when admin adds pets
export const MOCK_PETS: Pet[] = []

// Mock bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    petId: 'dog-1',
    petName: 'Max',
    petImage: 'https://picsum.photos/seed/dog1/400/300',
    adopterId: 'user-1',
    adopterName: 'Samantha Smith',
    adopterEmail: 'sam@email.com',
    adopterPhone: '555-0002',
    message: 'I love outdoor activities and Max seems perfect for me!',
    status: 'approved',
    submittedAt: '2024-11-01',
    updatedAt: '2024-11-02'
  },
  {
    id: 'booking-2',
    petId: 'cat-2',
    petName: 'Luna',
    petImage: 'https://picsum.photos/seed/cat2/400/300',
    adopterId: 'user-2',
    adopterName: 'John Doe',
    adopterEmail: 'john@email.com',
    adopterPhone: '555-0003',
    message: 'Luna seems like the perfect companion for my apartment.',
    status: 'pending',
    submittedAt: '2024-11-14',
    updatedAt: '2024-11-14'
  },
  {
    id: 'booking-3',
    petId: 'dog-3',
    petName: 'Charlie',
    petImage: 'https://picsum.photos/seed/dog3/400/300',
    adopterId: 'user-1',
    adopterName: 'Samantha Smith',
    adopterEmail: 'sam@email.com',
    adopterPhone: '555-0002',
    message: 'Charlie\'s energy matches mine perfectly!',
    status: 'rejected',
    submittedAt: '2024-10-28',
    updatedAt: '2024-10-30'
  }
]
