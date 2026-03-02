import React, { useState } from 'react'
import { MOCK_USERS } from '../../utils/mockData'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/authStore'
import { Modal } from '../../components/ui/Modal'
import { showToast } from '../../components/ui/Toast'

const ManageUsersPage: React.FC = () => {
  // For now operate on mock data in-memory
  const [users, setUsers] = useState(() => [...MOCK_USERS])
  const { user: current } = useAuth()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const toggleRole = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'adopter' : 'admin' } : u))
    showToast.success('Role updated')
  }

  const confirmDelete = (id: string) => { setDeleteTarget(id); setDeleteOpen(true) }

  const handleDelete = () => {
    if (!deleteTarget) return
    if (current?.id === deleteTarget) {
      showToast.error('You cannot delete your own account')
      setDeleteOpen(false)
      return
    }
    setUsers(prev => prev.filter(u => u.id !== deleteTarget))
    setDeleteOpen(false)
    setDeleteTarget(null)
    showToast.success('User removed')
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="grid gap-4">
        {users.map(u => (
          <Card key={u.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-text-secondary">{u.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">{u.role}</div>
              <Button size="sm" variant="outline" onClick={() => toggleRole(u.id)} aria-label={`Toggle role for ${u.name}`}>Toggle Role</Button>
              <Button size="sm" variant="danger" onClick={() => confirmDelete(u.id)} aria-label={`Delete ${u.name}`}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <div className="space-y-3">
          <p>Are you sure you want to remove this user?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageUsersPage
