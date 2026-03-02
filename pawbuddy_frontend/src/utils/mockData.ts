import type { User, Pet, Booking } from '../types'
import { buildCloudinaryUrl, getPlaceholderImage } from './cloudinary'

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

// Raw pets use simple public ids (or fallbacks) which we'll map to Cloudinary URLs below
const RAW_PETS: Pet[] = [
  {
    id: 'dog-1',
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 24,
    ageDisplay: '2 years',
    gender: 'male',
    size: 'large',
    color: 'Golden',
    weight: '32 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Max is a friendly and energetic Golden Retriever who loves to play fetch and swim. He's great with families and other dogs.",
    personality: ['Playful', 'Friendly', 'Loyal', 'Energetic'],
    images: ['dog-1'],
    location: 'San Francisco',
    postedDate: '2024-11-15',
    createdBy: 'admin-1'
  },
  {
    id: 'dog-2',
    name: 'Bella',
    type: 'dog',
    breed: 'Labrador Retriever',
    age: 36,
    ageDisplay: '3 years',
    gender: 'female',
    size: 'large',
    color: 'Black',
    weight: '28 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Bella is a calm and affectionate Labrador who enjoys long walks and cuddles on the couch. Perfect for families!",
    personality: ['Calm', 'Affectionate', 'Intelligent', 'Gentle'],
    images: ['dog-2'],
    location: 'Los Angeles',
    postedDate: '2024-11-10',
    createdBy: 'admin-1'
  },
  {
    id: 'dog-3',
    name: 'Charlie',
    type: 'dog',
    breed: 'Beagle',
    age: 12,
    ageDisplay: '1 year',
    gender: 'male',
    size: 'small',
    color: 'Brown and White',
    weight: '10 kg',
    vaccinated: true,
    neutered: false,
    status: 'available',
    description:
      "Charlie is a curious and playful young Beagle with lots of energy. He loves puzzle toys and treats!",
    personality: ['Playful', 'Curious', 'Energetic', 'Social'],
    images: ['dog-3'],
    location: 'New York',
    postedDate: '2024-11-12',
    createdBy: 'admin-1'
  },
  {
    id: 'dog-4',
    name: 'Buddy',
    type: 'dog',
    breed: 'German Shepherd',
    age: 48,
    ageDisplay: '4 years',
    gender: 'male',
    size: 'large',
    color: 'Black and Tan',
    weight: '35 kg',
    vaccinated: true,
    neutered: true,
    status: 'pending',
    description:
      "Buddy is an intelligent and loyal German Shepherd. He's well-trained and protective of his family.",
    personality: ['Loyal', 'Protective', 'Intelligent', 'Alert'],
    images: ['dog-4'],
    location: 'Seattle',
    postedDate: '2024-11-05',
    createdBy: 'admin-1'
  },
  {
    id: 'dog-5',
    name: 'Daisy',
    type: 'dog',
    breed: 'Dachshund',
    age: 18,
    ageDisplay: '1.5 years',
    gender: 'female',
    size: 'small',
    color: 'Brown',
    weight: '5 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Daisy is a sweet and sassy Dachshund who loves cuddles and short walks. She's perfect for apartment living!",
    personality: ['Sweet', 'Sassy', 'Affectionate', 'Independent'],
    images: ['dog-5'],
    location: 'Austin',
    postedDate: '2024-11-14',
    createdBy: 'admin-1'
  },
  {
    id: 'dog-6',
    name: 'Rocky',
    type: 'dog',
    breed: 'Rottweiler',
    age: 60,
    ageDisplay: '5 years',
    gender: 'male',
    size: 'large',
    color: 'Black and Brown',
    weight: '40 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Rocky is a gentle giant despite his intimidating appearance. He's a big softie who loves his family.",
    personality: ['Gentle', 'Protective', 'Calm', 'Loyal'],
    images: ['dog-6'],
    location: 'Denver',
    postedDate: '2024-11-08',
    createdBy: 'admin-1'
  },
  // Cats
  {
    id: 'cat-1',
    name: 'Whiskers',
    type: 'cat',
    breed: 'Persian',
    age: 30,
    ageDisplay: '2.5 years',
    gender: 'male',
    size: 'medium',
    color: 'Orange',
    weight: '4.5 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Whiskers is a majestic Persian cat with a luxurious coat. He enjoys lounging in sunny spots and gentle petting.",
    personality: ['Calm', 'Independent', 'Affectionate', 'Graceful'],
    images: ['cat-1'],
    location: 'San Francisco',
    postedDate: '2024-11-13',
    createdBy: 'admin-1'
  },
  {
    id: 'cat-2',
    name: 'Luna',
    type: 'cat',
    breed: 'Siamese',
    age: 24,
    ageDisplay: '2 years',
    gender: 'female',
    size: 'small',
    color: 'Cream and Brown',
    weight: '3 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Luna is a vocal and social Siamese cat who loves attention. She's playful and enjoys interactive toys.",
    personality: ['Social', 'Playful', 'Vocal', 'Intelligent'],
    images: ['cat-2'],
    location: 'Portland',
    postedDate: '2024-11-11',
    createdBy: 'admin-1'
  },
  {
    id: 'cat-3',
    name: 'Mittens',
    type: 'cat',
    breed: 'British Shorthair',
    age: 36,
    ageDisplay: '3 years',
    gender: 'female',
    size: 'medium',
    color: 'Gray',
    weight: '4 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Mittens is a sturdy British Shorthair with a calm demeanor. She's perfect for families and gets along with other pets.",
    personality: ['Calm', 'Friendly', 'Reliable', 'Peaceful'],
    images: ['cat-3'],
    location: 'Boston',
    postedDate: '2024-11-09',
    createdBy: 'admin-1'
  },
  {
    id: 'cat-4',
    name: 'Shadow',
    type: 'cat',
    breed: 'Black Domestic Shorthair',
    age: 18,
    ageDisplay: '1.5 years',
    gender: 'male',
    size: 'small',
    color: 'Black',
    weight: '3.5 kg',
    vaccinated: true,
    neutered: true,
    status: 'pending',
    description:
      "Shadow is a mysterious and playful young cat full of energy. He loves to hunt toys and climb cat trees.",
    personality: ['Playful', 'Curious', 'Energetic', 'Mischievous'],
    images: ['cat-4'],
    location: 'Chicago',
    postedDate: '2024-11-06',
    createdBy: 'admin-1'
  },
  {
    id: 'cat-5',
    name: 'Fluffy',
    type: 'cat',
    breed: 'Maine Coon',
    age: 48,
    ageDisplay: '4 years',
    gender: 'male',
    size: 'large',
    color: 'Ginger',
    weight: '6.5 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Fluffy is a gentle giant Maine Coon with a personality to match. Despite his size, she's a lap cat!",
    personality: ['Gentle', 'Affectionate', 'Intelligent', 'Social'],
    images: ['cat-5'],
    location: 'Miami',
    postedDate: '2024-11-07',
    createdBy: 'admin-1'
  },
  {
    id: 'cat-6',
    name: 'Patches',
    type: 'cat',
    breed: 'Calico',
    age: 42,
    ageDisplay: '3.5 years',
    gender: 'female',
    size: 'small',
    color: 'Calico',
    weight: '3.8 kg',
    vaccinated: true,
    neutered: true,
    status: 'available',
    description:
      "Patches is a spunky calico with a big personality. She's independent but loves her quiet cuddle time.",
    personality: ['Spunky', 'Independent', 'Affectionate', 'Spirited'],
    images: ['cat-6'],
    location: 'San Diego',
    postedDate: '2024-11-04',
    createdBy: 'admin-1'
  }
]

// Map raw image ids to full Cloudinary URLs (fallback to placeholder)
export const MOCK_PETS: Pet[] = RAW_PETS.map((p) => {
  const images = p.images.map((img) => {
    if (typeof img === 'string' && img.startsWith('http')) return img
    try {
      return buildCloudinaryUrl(String(img))
    } catch {
      return getPlaceholderImage(String(img))
    }
  })
  return { ...p, images }
})

// Mock bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    petId: 'dog-1',
    petName: 'Max',
    petImage: buildCloudinaryUrl('dog-1'),
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
    petImage: buildCloudinaryUrl('cat-2'),
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
    petImage: buildCloudinaryUrl('dog-3'),
    adopterId: 'user-1',
    adopterName: 'Samantha Smith',
    adopterEmail: 'sam@email.com',
    adopterPhone: '555-0002',
    message: "Charlie's energy matches mine perfectly!",
    status: 'rejected',
    submittedAt: '2024-10-28',
    updatedAt: '2024-10-30'
  }
]
