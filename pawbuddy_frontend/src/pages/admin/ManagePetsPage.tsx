import React, { useState } from 'react'
import type { PetFormData } from '../../types'
import { usePets } from '../../context/petStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { showToast } from '../../components/ui/Toast'

const ManagePetsPage: React.FC = () => {
  const { getAllPets, addPet, updatePet, deletePet } = usePets()
  const pets = getAllPets()

  const [isOpen, setOpen] = useState(false)
  const [form, setForm] = useState<PetFormData>({ name: '', type: 'dog', breed: '', age: 12, gender: 'male', size: 'medium', color: '', weight: '', location: '', description: '', personality: [], vaccinated: false, neutered: false, status: 'available', images: [] })

  const handleAdd = async () => {
    try {
      await addPet(form)
      showToast.success('Pet added')
      setOpen(false)
    } catch (err) {
      showToast.error('Failed to add')
    }
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Pets</h1>
        <Button onClick={() => setOpen(true)}>Add New Pet</Button>
      </div>

      <div className="grid gap-4">
        {pets.map(p => (
          <Card key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-text-secondary">{p.breed} • {p.ageDisplay}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { /* edit flow */ }}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => deletePet(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Add Pet">
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Breed" value={form.breed} onChange={(e) => setForm(f => ({ ...f, breed: e.target.value }))} />
          <Input label="Location" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManagePetsPage
