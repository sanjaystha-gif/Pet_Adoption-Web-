import React from 'react'
import { usePets } from '../../context/petStore'
import { useBooking } from '../../context/bookingStore'
import { useAuth } from '../../context/authStore'
import { Card } from '../../components/ui/Card'
import { Link } from 'react-router-dom'

const AdminDashboard: React.FC = () => {
  const { getAllPets } = usePets()
  const { bookings } = useBooking()
  const { user } = useAuth()

  const totalPets = getAllPets().length
  const pending = bookings.filter(b => b.status === 'pending').length

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>Signed in as <strong>{user?.name}</strong></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-text-secondary">Total Pets</p>
          <p className="text-2xl font-bold">{totalPets}</p>
          <Link to="/admin/pets" className="text-primary-600 text-sm">Manage Pets</Link>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Pending Requests</p>
          <p className="text-2xl font-bold">{pending}</p>
          <Link to="/admin/bookings" className="text-primary-600 text-sm">Manage Bookings</Link>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Users</p>
          <p className="text-2xl font-bold">—</p>
          <Link to="/admin/users" className="text-primary-600 text-sm">Manage Users</Link>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
