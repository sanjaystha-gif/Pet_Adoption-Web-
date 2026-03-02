// Pet types
export interface Pet {
  id: string
  name: string
  type: 'dog' | 'cat'
  breed: string
  age: number
  ageDisplay: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  color: string
  weight: string
  vaccinated: boolean
  neutered: boolean
  status: 'available' | 'pending' | 'adopted'
  description: string
  personality: string[]
  images: string[]
  location: string
  postedDate: string
  createdBy: string
}

// User types
export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'adopter'
  avatar?: string | null
  phone?: string
  bio?: string
  city?: string
  joinedDate?: string
}

// Auth types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Booking types
export interface Booking {
  id: string
  petId: string
  petName: string
  petImage: string
  adopterId: string
  adopterName: string
  adopterEmail: string
  adopterPhone: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  updatedAt: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface PetFormData {
  name: string
  type: 'dog' | 'cat'
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  color: string
  weight: string
  location: string
  description: string
  personality: string[]
  vaccinated: boolean
  neutered: boolean
  status: 'available' | 'pending' | 'adopted'
  images: string[]
}

export interface BookingFormData {
  petId: string
  petName: string
  petImage: string
  adopterPhone: string
  message: string
  adopterId?: string
  adopterName?: string
  adopterEmail?: string
}

// Filter types
export interface PetFilters {
  type?: string
  breed?: string
  size?: string
  gender?: string
  status?: string
  location?: string
  ageRange?: {
    min: number
    max: number
  }
}

// Component props types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
}

export interface BadgeProps {
  children: React.ReactNode
  variant?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'primary'
    | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface PetCardProps {
  pet: Pet
  onFavourite?: (petId: string) => void
  isFavourited?: boolean
  onMeetClick?: (petId: string) => void
  showStatus?: boolean
}

export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  initials?: string
  className?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginationData {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
