import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePets } from '../../context/petStore'
import { useAuth } from '../../context/authStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { useBooking } from '../../context/bookingStore'
import { showToast } from '../../components/ui/Toast'

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPetById } = usePets()
  const { isAuthenticated, user } = useAuth()
  const { createBooking } = useBooking()

  const pet = id ? getPetById(id) : undefined
  const [isModalOpen, setModalOpen] = useState(false)
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [message, setMessage] = useState('')

  if (!pet) return <div className="container py-20">Pet not found</div>

  const handleRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await createBooking({
        petId: pet.id,
        petName: pet.name,
        petImage: pet.images?.[0] ?? '',
        adopterId: user!.id,
        adopterName: user!.name,
        adopterEmail: user!.email,
        adopterPhone: phone,
        message,
      })

      setModalOpen(false)
      showToast.success('Adoption request submitted')
    } catch {
      showToast.error('Failed to submit request')
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
          <div className="bg-card p-6 rounded-2xl">
            <div className="mb-4">
              <p className="text-sm text-text-secondary">Location</p>
              <p className="font-semibold">{pet.location}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-text-secondary">Health</p>
              <p className="text-sm">{pet.vaccinated ? 'Vaccinated' : 'Not vaccinated'} • {pet.neutered ? 'Neutered' : 'Not neutered'}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-text-secondary">Status</p>
              <p className="font-semibold">{pet.status}</p>
            </div>

            <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>Request Adoption</Button>
          </div>
        </aside>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Adoption request for ${pet.name}`}>
        <div className="space-y-4">
          <Input
            id="booking-phone"
            label="Phone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          />

          <Textarea
            id="booking-message"
            label="Message"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PetDetailPage
