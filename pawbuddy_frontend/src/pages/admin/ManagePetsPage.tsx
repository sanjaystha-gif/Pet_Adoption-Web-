import React, { useState } from 'react'
import type { Pet, PetFormData } from '../../types'
import { usePets } from '../../context/petStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { showToast } from '../../components/ui/Toast'
import { openCloudinaryWidget } from '../../utils/cloudinary'

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

  const handleCloseModal = () => {
    setOpen(false)
    setEditingPetId(null)
  }

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
    if (!form.description.trim()) return 'Description is required'
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
      showToast.error(editingPetId ? 'Failed to update' : 'Failed to add')
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
      showToast.error('Failed to delete')
    }
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Pets</h1>
        <Button onClick={handleOpenModal}>Add New Pet</Button>
      </div>

      <div className="grid gap-4">
        {pets.map(p => (
          <Card key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-text-secondary">{p.breed} • {p.ageDisplay}</p>
              <p className="text-xs text-text-secondary mt-1 capitalize">{p.status} • {p.location}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(p)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(p)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} title={editingPetId ? 'Edit Pet' : 'Add Pet'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Breed" value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} required />

            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'dog' | 'cat' }))}
              options={[
                { value: 'dog', label: 'Dog' },
                { value: 'cat', label: 'Cat' }
              ]}
            />

            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' }))}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
            />

            <Select
              label="Size"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value as 'small' | 'medium' | 'large' }))}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'available' | 'pending' | 'adopted' }))}
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
              onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) || 0 }))}
              required
            />

            <Input label="Weight" placeholder="e.g., 12 kg" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} required />
            <Input label="Color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} required />
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required />
          </div>

          <Textarea
            label="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />

          <Input
            label="Personality Traits (comma separated)"
            placeholder="Friendly, Playful, Loyal"
            value={personalityInput}
            onChange={(e) => setPersonalityInput(e.target.value)}
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Images</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste image URL"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
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
                onChange={(e) => setForm((f) => ({ ...f, vaccinated: e.target.checked }))}
              />
              Vaccinated
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={form.neutered}
                onChange={(e) => setForm((f) => ({ ...f, neutered: e.target.checked }))}
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
