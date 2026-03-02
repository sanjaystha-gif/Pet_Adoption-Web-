import React from 'react'
import { MOCK_USERS } from '../../utils/mockData'
import { Card } from '../../components/ui/Card'

const ManageUsersPage: React.FC = () => {
  // For now read-only list from mock data
  const users = MOCK_USERS

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
            <div className="text-sm">{u.role}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageUsersPage
