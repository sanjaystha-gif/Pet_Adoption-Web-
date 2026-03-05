import React, { useMemo, useState, useCallback } from 'react'
import type { Pet, PetFormData } from '../../types'
import { usePets } from '../../context/petStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Badge } from '../../components/ui/Badge'
import { showToast } from '../../components/ui/Toast'
import { openCloudinaryWidget } from '../../utils/cloudinary'
import { FiMapPin } from 'react-icons/fi'

const commonBreeds = [
  'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Beagle', 'Pug', 'Dachshund',
  'Persian', 'Siamese', 'British Shorthair', 'Maine Coon', 'Calico', 'Mixed Breed'
]

const commonColors = [
  'Black', 'White', 'Brown', 'Golden', 'Gray', 'Orange', 'Cream', 'Tan', 'Spotted', 'Striped'
]

const commonLocations = [
  'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Biratnagar', 'Butwal', 'Dharan'
]

const ManagePetsPage: React.FC = () => {
  const { getAllPets, addPet, updatePet, deletePet } = usePets()
  const pets = getAllPets()

  const [isOpen, setOpen] = useState(false)
  const [editingPetId, setEditingPetId] = useState<string | null>(null)
  const [form, setForm] = useState<PetFormData>({
    name: '',
    type: 'dog',
    breed: '',
    age: 12,
    gender: 'male',
    size: 'medium',
    color: '',
    weight: '',
    location: '',
    description: '',
    personality: [],
    vaccinated: false,
    neutered: false,
    status: 'available',
    images: []
  })
  const [personalityInput, setPersonalityInput] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const breedOptions = useMemo(() => {
    const unique = Array.from(new Set([...commonBreeds, ...pets.map((pet) => pet.breed), form.breed].filter(Boolean)))
    return unique.sort().map((breed) => ({ value: breed, label: breed }))
  }, [form.breed])

  const colorOptions = useMemo(() => {
    const unique = Array.from(new Set([...commonColors, ...pets.map((pet) => pet.color), form.color].filter(Boolean)))
    return unique.sort().map((color) => ({ value: color, label: color }))
  }, [form.color])

  const locationOptions = useMemo(() => {
    const unique = Array.from(new Set([...commonLocations, ...pets.map((pet) => pet.location), form.location].filter(Boolean)))
    return unique.sort().map((location) => ({ value: location, label: location }))
  }, [form.location])

  const resetForm = () => {
    setForm({
      name: '',
      type: 'dog',
      breed: '',
      age: 12,
      gender: 'male',
      size: 'medium',
      color: '',
      weight: '',
      location: '',
      description: '',
      personality: [],
      vaccinated: false,
      neutered: false,
      status: 'available',
      images: []
    })
    setPersonalityInput('')
    setImageUrlInput('')
  }

  // Memoized handlers to prevent input re-renders and focus loss during typing
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, name: e.target.value }))
  }, [])

  const handleBreedChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, breed: e.target.value }))
  }, [])

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, type: e.target.value as 'dog' | 'cat' }))
  }, [])

  const handleGenderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' }))
  }, [])

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, size: e.target.value as 'small' | 'medium' | 'large' }))
  }, [])

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, status: e.target.value as 'available' | 'pending' | 'adopted' }))
  }, [])

  const handleAgeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, age: Number(e.target.value) || 0 }))
  }, [])

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, color: e.target.value }))
  }, [])

  const handleWeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, weight: e.target.value }))
  }, [])

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, location: e.target.value }))
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, description: e.target.value }))
  }, [])

  const handlePersonalityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalityInput(e.target.value)
  }, [])

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value)
  }, [])

  const handleVaccinatedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, vaccinated: e.target.checked }))
  }, [])

  const handleNeuteredChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, neutered: e.target.checked }))
  }, [])

  const handleOpenModal = () => {
    setEditingPetId(null)
    resetForm()
    setOpen(true)
  }

  const handleOpenEditModal = (pet: Pet) => {
    setEditingPetId(pet.id)
    setForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      color: pet.color,
      weight: pet.weight,
      location: pet.location,
      description: pet.description,
      personality: pet.personality,
      vaccinated: pet.vaccinated,
      neutered: pet.neutered,
      status: pet.status,
      images: pet.images
    })
    setPersonalityInput((pet.personality || []).join(', '))
    setImageUrlInput('')
    setOpen(true)
  }

  const handleCloseModal = useCallback(() => {
    setOpen(false)
    setEditingPetId(null)
  }, [])

  const addImageFromUrl = () => {
    const trimmed = imageUrlInput.trim()
    if (!trimmed) return
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }))
    setImageUrlInput('')
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }))
  }

  const handleUploadImages = () => {
    openCloudinaryWidget(
      (url) => {
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
      },
      () => {
        showToast.error('Image upload failed')
      }
    )
  }

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required'
    if (!form.breed.trim()) return 'Breed is required'
    if (!form.color.trim()) return 'Color is required'
    if (!form.weight.trim()) return 'Weight is required'
    if (!form.location.trim()) return 'Location is required'
    const description = form.description.trim()
    if (!description) return 'Description is required'
    if (description.length < 10) return 'Description must be at least 10 characters'
    if (form.age <= 0) return 'Age must be greater than 0'
    if (form.images.length === 0) return 'Please add at least one image'
    return null
  }

  const handleAdd = async () => {
    const validationError = validateForm()
    if (validationError) {
      showToast.error(validationError)
      return
    }

    const personalityList = personalityInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const payload: PetFormData = {
      ...form,
      name: form.name.trim(),
      breed: form.breed.trim(),
      color: form.color.trim(),
      weight: form.weight.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      personality: personalityList
    }

    setIsSubmitting(true)
    try {
      if (editingPetId) {
        await updatePet(editingPetId, payload)
        showToast.success('Pet updated')
      } else {
        await addPet(payload)
        showToast.success('Pet added')
      }
      handleCloseModal()
      resetForm()
    } catch (err) {
      const apiMessage =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { data?: { message?: string; error?: string } } }).response?.data
          ? (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ||
            (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error
          : null

      const fallbackMessage = editingPetId ? 'Failed to update' : 'Failed to add'
      showToast.error(apiMessage || fallbackMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (pet: Pet) => {
    const confirmed = window.confirm(`Delete ${pet.name}? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await deletePet(pet.id)
      showToast.success('Pet deleted')
    } catch (err) {
      const apiMessage =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { data?: { message?: string; error?: string } } }).response?.data
          ? (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ||
            (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error
          : null

      showToast.error(apiMessage || 'Failed to delete')
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Manage Pets</h1>
          <p className="text-gray-600 mt-1">Create and manage pets with the same card details shown on public pages.</p>
        </div>
        <Button onClick={handleOpenModal}>Add New Pet</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-purple-50">
              <img
                src={pet.images?.[0] || 'https://picsum.photos/seed/pet/800/600'}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed} • {pet.ageDisplay}</p>
                </div>
                <Badge
                  variant={pet.status === 'available' ? 'success' : pet.status === 'pending' ? 'warning' : 'error'}
                  size="sm"
                >
                  {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" size="sm">{pet.gender}</Badge>
                <Badge variant="secondary" size="sm">{pet.size}</Badge>
                {pet.vaccinated && <Badge variant="info" size="sm">Vaccinated</Badge>}
                {pet.neutered && <Badge variant="info" size="sm">Neutered</Badge>}
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiMapPin size={14} />
                {pet.location}
              </p>

              <p className="text-sm text-gray-700 line-clamp-2">{pet.description}</p>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(pet)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(pet)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} title={editingPetId ? 'Edit Pet' : 'Add Pet'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={handleNameChange} autoFocus required />
            <Select
              label="Breed"
              value={form.breed}
              onChange={handleBreedChange}
              options={breedOptions}
              placeholder="Select breed"
              required
            />

            <Select
              label="Type"
              value={form.type}
              onChange={handleTypeChange}
              options={[
                { value: 'dog', label: 'Dog' },
                { value: 'cat', label: 'Cat' }
              ]}
            />

            <Select
              label="Gender"
              value={form.gender}
              onChange={handleGenderChange}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
            />

            <Select
              label="Size"
              value={form.size}
              onChange={handleSizeChange}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />

            <Select
              label="Status"
              value={form.status}
              onChange={handleStatusChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'pending', label: 'Pending' },
                { value: 'adopted', label: 'Adopted' }
              ]}
            />

            <Input
              label="Age (in months)"
              type="number"
              min={1}
              value={form.age}
              onChange={handleAgeChange}
              required
            />

            <Input label="Weight" placeholder="e.g., 12 kg" value={form.weight} onChange={handleWeightChange} required />
            <Select
              label="Color"
              value={form.color}
              onChange={handleColorChange}
              options={colorOptions}
              placeholder="Select color"
              required
            />
            <Select
              label="Location"
              value={form.location}
              onChange={handleLocationChange}
              options={locationOptions}
              placeholder="Select location"
              required
            />
          </div>

          <Textarea
            label="Description"
            rows={4}
            value={form.description}
            onChange={handleDescriptionChange}
            required
          />

          <Input
            label="Personality Traits (comma separated)"
            placeholder="Friendly, Playful, Loyal"
            value={personalityInput}
            onChange={handlePersonalityChange}
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Images</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste image URL"
                value={imageUrlInput}
                onChange={handleImageUrlChange}
              />
              <Button variant="outline" onClick={addImageFromUrl}>Add URL</Button>
              <Button variant="secondary" onClick={handleUploadImages}>Upload</Button>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {form.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative rounded-lg overflow-hidden border border-border">
                    <img src={image} alt={`pet-${index}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-xs bg-white/90 rounded px-2 py-0.5 border border-gray-200"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={form.vaccinated}
                onChange={handleVaccinatedChange}
              />
              Vaccinated
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={form.neutered}
                onChange={handleNeuteredChange}
              />
              Neutered
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} isLoading={isSubmitting}>{editingPetId ? 'Update Pet' : 'Save Pet'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManagePetsPage
