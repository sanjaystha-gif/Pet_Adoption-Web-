import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePets } from '../../context/petStore'
import { useAuth } from '../../context/authStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useBooking } from '../../context/bookingStore'
import { showToast } from '../../components/ui/Toast'

interface FormData {
  phone: string
  message: string
  homeType: string
  yardStatus: string
  workSchedule: string
  currentPets: Array<{ type: string; breed: string; name: string }>
  petExperience: string
  lifetimeCommitment: boolean
}

interface FormErrors {
  phone?: string
  message?: string
  homeType?: string
  yardStatus?: string
  workSchedule?: string
  petExperience?: string
  lifetimeCommitment?: string
}

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPetById } = usePets()
  const { isAuthenticated, user } = useAuth()
  const { createBooking } = useBooking()

  const pet = id ? getPetById(id) : undefined
  const [isModalOpen, setModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<FormData>({
    phone: user?.phone ? (user.phone.startsWith('+977') ? user.phone : '+977' + user.phone) : '+977',
    message: '',
    homeType: '',
    yardStatus: '',
    workSchedule: '',
    currentPets: [],
    petExperience: '',
    lifetimeCommitment: false,
  })

  const [newPet, setNewPet] = useState({ type: '', breed: '', name: '' })

  if (!pet) return <div className="container py-20">Pet not found</div>

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      if (!formData.message.trim()) {
        newErrors.message = 'Please tell us about your home'
      } else if (formData.message.length < 20) {
        newErrors.message = 'Please provide at least 20 characters'
      }
    }

    if (step === 2) {
      if (!formData.homeType) {
        newErrors.homeType = 'Please select home type'
      }
      if (!formData.yardStatus) {
        newErrors.yardStatus = 'Please select yard status'
      }
      if (!formData.workSchedule) {
        newErrors.workSchedule = 'Please select work schedule'
      }
    }

    if (step === 3) {
      if (!formData.petExperience) {
        newErrors.petExperience = 'Please select your pet experience level'
      }
      if (!formData.lifetimeCommitment) {
        newErrors.lifetimeCommitment = 'You must commit to caring for this pet'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const addCurrentPet = () => {
    if (newPet.type && newPet.breed && newPet.name) {
      setFormData({
        ...formData,
        currentPets: [...formData.currentPets, newPet],
      })
      setNewPet({ type: '', breed: '', name: '' })
    }
  }

  const removeCurrentPet = (index: number) => {
    setFormData({
      ...formData,
      currentPets: formData.currentPets.filter((_, i) => i !== index),
    })
  }

  const handleRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!validateStep(3)) return

    setIsLoading(true)
    try {
      await createBooking({
        petId: pet.id,
        petName: pet.name,
        petImage: pet.images?.[0] ?? '',
        adopterId: user!.id,
        adopterName: user!.name,
        adopterEmail: user!.email,
        adopterPhone: formData.phone,
        message: formData.message,
      })

      setModalOpen(false)
      setCurrentStep(1)
      setFormData({
        phone: user?.phone ? (user.phone.startsWith('+977') ? user.phone : '+977' + user.phone) : '+977',
        message: '',
        homeType: '',
        yardStatus: '',
        workSchedule: '',
        currentPets: [],
        petExperience: '',
        lifetimeCommitment: false,
      })
      setErrors({})
      showToast.success('Adoption request submitted! We\'ll be in touch soon.')
    } catch (err) {
      showToast.error('Failed to submit request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl overflow-hidden">
            <img src={pet.images?.[0] ?? 'https://picsum.photos/seed/pet/600/400'} alt={pet.name} className="w-full h-96 object-cover" />
          </div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{pet.name}</h1>
            <p className="text-text-secondary mb-4">{pet.breed} • {pet.ageDisplay} • {pet.gender}</p>
            <div className="mb-4">
              {pet.personality.map((p) => (
                <span key={p} className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full mr-2 mb-2">{p}</span>
              ))}
            </div>
            <p className="text-sm text-text-secondary mb-6">{pet.description}</p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-50 to-purple-50 p-8 rounded-2xl sticky top-20">
            <div className="mb-6">
              <p className="text-sm text-text-secondary">Location</p>
              <p className="font-semibold text-lg">{pet.location}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-text-secondary">Health</p>
              <p className="text-sm font-medium">{pet.vaccinated ? '✓ Vaccinated' : 'Not vaccinated'} • {pet.neutered ? '✓ Neutered' : 'Not neutered'}</p>
            </div>

            <div className="mb-8">
              <p className="text-sm text-text-secondary">Status</p>
              <p className="font-semibold text-lg capitalize">{pet.status}</p>
            </div>

            <Button variant="primary" size="lg" onClick={() => setModalOpen(true)} className="w-full text-lg py-3">Book Now</Button>
          </div>
        </aside>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="" size="md">
        <div className="space-y-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white p-6 rounded-t-2xl -m-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Adoption Application</h2>
                <p className="text-orange-100 text-sm mt-1">Step {currentStep} of 4</p>
              </div>
              <div className="text-5xl">🐾</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 px-0">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-orange-500 text-white scale-110'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {step === 1 ? 'Contact' : step === 2 ? 'Home' : step === 3 ? 'Pets' : 'Review'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pet Quick Info */}
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-orange-200 flex items-center gap-4">
            <img 
              src={pet.images?.[0] ?? 'https://picsum.photos/seed/pet/100/100'} 
              alt={pet.name}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div>
              <p className="text-xs text-gray-600 font-semibold tracking-wide">ADOPTING</p>
              <h3 className="font-black text-2xl text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-700">{pet.breed} • {pet.ageDisplay}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            {/* STEP 1: Contact Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-800">📞 Phone Number</label>
                    <span className="text-xs font-semibold text-red-500">REQUIRED</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="tel"
                      placeholder="+977 98xxxxxxxx"
                      className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                        errors.phone 
                          ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-400'
                      }`}
                      value={formData.phone} 
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        if (errors.phone) setErrors({ ...errors, phone: '' })
                      }}
                    />
                    {!errors.phone && formData.phone && <span className="absolute right-4 top-3.5 text-green-500 font-bold">✓</span>}
                  </div>
                  {errors.phone && <p className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">⚠️ {errors.phone}</p>}
                </div>

                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-800">🏡 About Your Home</label>
                    <span className={`text-xs font-semibold ${formData.message.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                      {formData.message.length}/500
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Tell us about your living situation and why you'd be a great home for {pet.name}</p>
                  <textarea 
                    placeholder="e.g., We have a spacious home with a garden, 2 kids aged 10+, and lots of experience with pets..."
                    className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none resize-none ${
                      errors.message 
                        ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-400'
                    }`}
                    rows={4}
                    value={formData.message} 
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (errors.message) setErrors({ ...errors, message: '' })
                    }}
                  />
                  {errors.message && <p className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">⚠️ {errors.message}</p>}
                  {formData.message.length >= 20 && !errors.message && (
                    <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">✓ Good to go!</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Home Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="group">
                  <label className="text-sm font-bold text-gray-800 mb-2 block">🏠 Home Type</label>
                  <select 
                    className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                      errors.homeType 
                        ? 'border-red-400 bg-red-50 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:ring-4 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    value={formData.homeType}
                    onChange={(e) => {
                      setFormData({ ...formData, homeType: e.target.value })
                      if (errors.homeType) setErrors({ ...errors, homeType: '' })
                    }}
                  >
                    <option value="">Select home type...</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="condo">Condo</option>
                  </select>
                  {errors.homeType && <p className="text-red-600 text-xs font-bold mt-2">⚠️ {errors.homeType}</p>}
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-gray-800 mb-2 block">🌳 Yard Status</label>
                  <select 
                    className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                      errors.yardStatus 
                        ? 'border-red-400 bg-red-50 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:ring-4 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    value={formData.yardStatus}
                    onChange={(e) => {
                      setFormData({ ...formData, yardStatus: e.target.value })
                      if (errors.yardStatus) setErrors({ ...errors, yardStatus: '' })
                    }}
                  >
                    <option value="">Select yard status...</option>
                    <option value="no-yard">No Yard</option>
                    <option value="small-unfenced">Small (Unfenced)</option>
                    <option value="small-fenced">Small (Fenced)</option>
                    <option value="large-unfenced">Large (Unfenced)</option>
                    <option value="large-fenced">Large (Fenced)</option>
                  </select>
                  {errors.yardStatus && <p className="text-red-600 text-xs font-bold mt-2">⚠️ {errors.yardStatus}</p>}
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-gray-800 mb-2 block">⏰ Work Schedule</label>
                  <select 
                    className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                      errors.workSchedule 
                        ? 'border-red-400 bg-red-50 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:ring-4 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    value={formData.workSchedule}
                    onChange={(e) => {
                      setFormData({ ...formData, workSchedule: e.target.value })
                      if (errors.workSchedule) setErrors({ ...errors, workSchedule: '' })
                    }}
                  >
                    <option value="">Select work schedule...</option>
                    <option value="work-from-home">Work from Home</option>
                    <option value="part-time">Part-time (1-3 hrs away)</option>
                    <option value="full-time">Full-time (8 hrs away)</option>
                    <option value="frequent-travel">Frequent Travel</option>
                  </select>
                  {errors.workSchedule && <p className="text-red-600 text-xs font-bold mt-2">⚠️ {errors.workSchedule}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: Pet Experience */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="group">
                  <label className="text-sm font-bold text-gray-800 mb-2 block">🐾 Pet Experience</label>
                  <select 
                    className={`w-full px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                      errors.petExperience 
                        ? 'border-red-400 bg-red-50 focus:ring-4 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 bg-white focus:ring-4 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    value={formData.petExperience}
                    onChange={(e) => {
                      setFormData({ ...formData, petExperience: e.target.value })
                      if (errors.petExperience) setErrors({ ...errors, petExperience: '' })
                    }}
                  >
                    <option value="">Select experience level...</option>
                    <option value="first-time">First time pet owner</option>
                    <option value="some-experience">Some experience</option>
                    <option value="very-experienced">Very experienced</option>
                  </select>
                  {errors.petExperience && <p className="text-red-600 text-xs font-bold mt-2">⚠️ {errors.petExperience}</p>}
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-gray-800 mb-3 block">🐕 Your Current Pets</label>
                  <div className="space-y-3">
                    {formData.currentPets.length > 0 && (
                      <div className="space-y-2">
                        {formData.currentPets.map((pet, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <span className="text-sm font-semibold">{pet.name} ({pet.type}, {pet.breed})</span>
                            <button
                              onClick={() => removeCurrentPet(idx)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Pet type (dog/cat)"
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-200"
                          value={newPet.type}
                          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Breed"
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-200"
                          value={newPet.breed}
                          onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Name"
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-200"
                          value={newPet.name}
                          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                        />
                      </div>
                      <button
                        onClick={addCurrentPet}
                        className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition"
                      >
                        + Add Pet
                      </button>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded accent-orange-500"
                      checked={formData.lifetimeCommitment}
                      onChange={(e) => {
                        setFormData({ ...formData, lifetimeCommitment: e.target.checked })
                        if (errors.lifetimeCommitment) setErrors({ ...errors, lifetimeCommitment: '' })
                      }}
                    />
                    <span className="text-sm font-bold text-gray-800">
                      💕 I commit to care for this pet for its entire lifetime
                    </span>
                  </label>
                  {errors.lifetimeCommitment && <p className="text-red-600 text-xs font-bold mt-2 ml-8">⚠️ {errors.lifetimeCommitment}</p>}
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-800 mb-3">✓ Almost done! Review your information:</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-semibold">{formData.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Home:</span><span className="font-semibold">{formData.homeType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Yard:</span><span className="font-semibold">{formData.yardStatus}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Work Schedule:</span><span className="font-semibold">{formData.workSchedule}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Experience:</span><span className="font-semibold">{formData.petExperience}</span></div>
                    {formData.currentPets.length > 0 && (
                      <div className="flex justify-between"><span className="text-gray-600">Current Pets:</span><span className="font-semibold">{formData.currentPets.length}</span></div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between pt-6 border-t-2 border-gray-100 mt-6">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? () => setModalOpen(false) : handlePrevStep}
              disabled={isLoading}
              size="sm"
              className="font-bold"
            >
              {currentStep === 1 ? '✕ Close' : '← Back'}
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 4 && (
                <Button 
                  variant="primary" 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  size="sm"
                  className="font-bold"
                >
                  Next →
                </Button>
              )}
              {currentStep === 4 && (
                <Button 
                  variant="primary" 
                  onClick={handleRequest}
                  disabled={isLoading}
                  size="sm"
                  className="font-bold px-6 shadow-lg"
                >
                  {isLoading ? '⏳ Processing...' : '🚀 Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PetDetailPage
