// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | null;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<PaginatedData<T>> {}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'adopter';
}

// User Types
export type UserRole = 'admin' | 'adopter';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  city?: string;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

// Pet Types
export type PetType = 'dog' | 'cat';
export type Gender = 'male' | 'female';
export type Size = 'small' | 'medium' | 'large';
export type PetStatus = 'available' | 'pending' | 'adopted';

export interface PetResponse {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number; // in months
  ageDisplay: string;
  gender: Gender;
  size: Size;
  color: string;
  weight: string;
  vaccinated: boolean;
  neutered: boolean;
  status: PetStatus;
  description: string;
  personality: string[];
  images: string[];
  location: string;
  postedDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface CurrentPet {
  type: string;
  breed: string;
  name: string;
}

export interface BookingResponse {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  message: string;
  homeType?: string;
  yardStatus?: string;
  workSchedule?: string;
  currentPets?: CurrentPet[];
  petExperience?: string;
  lifetimeCommitment?: boolean;
  status: BookingStatus;
  submittedAt: string;
  updatedAt: string;
  createdAt: string;
}

// Favourite Types
export interface FavouriteResponse {
  id: string;
  userId: string;
  petId: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination Query Types
export interface PaginationQuery {
  page?: number | string;
  pageSize?: number | string;
  sort?: string;
}

// Pet Filter Query Types
export type AgeRange = 'baby' | 'young' | 'adult' | 'senior';

export interface PetFilterQuery extends PaginationQuery {
  q?: string;
  type?: PetType;
  breed?: string;
  gender?: Gender;
  size?: Size;
  status?: PetStatus;
  color?: string;
  location?: string;
  ageRange?: AgeRange;
  sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc';
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}

// Adoption types
export interface Adoption {
  id: string;
  petId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
