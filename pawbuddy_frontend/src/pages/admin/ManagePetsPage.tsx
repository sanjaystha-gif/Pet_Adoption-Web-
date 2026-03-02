import React, { useEffect, useRef, useState } from 'react'
import type { PetFormData } from '../../types'
import { usePets } from '../../context/petStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { showToast } from '../../components/ui/Toast'

const defaultForm = (): PetFormData => ({ name: '', type: 'dog', breed: '', age: 12, gender: 'male', size: 'medium', color: '', weight: '', location: '', description: '', personality: [], vaccinated: false, neutered: false, status: 'available', images: [] })

const ManagePetsPage: React.FC = () => {
  const { getAllPets, addPet, updatePet, deletePet } = usePets()
  const pets = getAllPets()

  const [isOpen, setOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PetFormData>(defaultForm())
  const nameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { if (isOpen) nameRef.current?.focus() }, [isOpen])

  const openAdd = () => {
    setEditingId(null)
    setForm(defaultForm())
    setOpen(true)
  }

  const openEdit = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    if (!pet) return
    setEditingId(petId)
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
      personality: pet.personality ?? [],
      vaccinated: pet.vaccinated,
      neutered: pet.neutered,
      status: pet.status,
      images: pet.images ?? []
    })
    setOpen(true)
  }

  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim() || !form.breed.trim() || !form.location.trim()) {
      showToast.error('Please fill required fields: name, breed, location')
      return
    }
    if (typeof form.age !== 'number' || form.age < 0) {
      showToast.error('Please provide a valid age')
      return
    }

    try {
      if (editingId) {
        await updatePet(editingId, { ...form, ageDisplay: `${Math.floor(form.age / 12)} yr${Math.floor(form.age / 12) !== 1 ? 's' : ''}` })
        showToast.success('Pet updated')
      } else {
        await addPet(form)
        showToast.success('Pet added')
      }
      setOpen(false)
    } catch {
      showToast.error('Failed to save pet')
    }
  }

  const confirmDelete = (petId: string) => { setDeleteTarget(petId); setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePet(deleteTarget)
      showToast.success('Pet deleted')
    } catch {
      showToast.error('Failed to delete pet')
    } finally {
      setDeleteOpen(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Pets</h1>
        <Button onClick={openAdd}>Add New Pet</Button>
      </div>

      <div className="grid gap-4">
        {pets.map(p => (
          <Card key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-text-secondary">{p.breed} • {p.ageDisplay}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(p.id)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => confirmDelete(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={editingId ? 'Edit Pet' : 'Add Pet'}>
        <div className="space-y-3">
          <Input ref={nameRef} label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} aria-required="true" />
          <Input label="Breed" value={form.breed} onChange={(e) => setForm(f => ({ ...f, breed: e.target.value }))} aria-required="true" />
          <Input label="Location" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} aria-required="true" />
          <Input label="Age (months)" type="number" value={String(form.age)} onChange={(e) => setForm(f => ({ ...f, age: Number(e.target.value) }))} />
          <Input label="Image URLs (comma separated)" value={(form.images || []).join(', ')} onChange={(e) => setForm(f => ({ ...f, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <div className="space-y-3">
          <p>Are you sure you want to delete this pet? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManagePetsPage
