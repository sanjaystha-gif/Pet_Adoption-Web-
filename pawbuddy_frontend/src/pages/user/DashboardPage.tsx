import React from 'react'
import { useAuth } from '../../context/authStore'
import { useBooking } from '../../context/bookingStore'
import { usePets } from '../../context/petStore'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { getUserBookings, bookings } = useBooking()
  const { getAvailablePets } = usePets()

  const myBookings = user ? getUserBookings(user.id) : []
  const available = getAvailablePets().length

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hello, {user?.name ?? 'Guest'}</h1>
        <div className="flex gap-2">
          <Link to="/adopt"><Button variant="outline">Browse Pets</Button></Link>
          <Link to="/profile"><Button variant="ghost">Profile</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-text-secondary">Total Bookings</p>
          <p className="text-2xl font-bold">{myBookings.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Available Pets</p>
          <p className="text-2xl font-bold">{available}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Favourites</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {myBookings.length === 0 ? (
          <Card className="p-6 text-center">You have no bookings yet. <Link to="/adopt" className="text-primary-600">Browse pets</Link></Card>
        ) : (
          <div className="grid gap-4">
            {myBookings.slice(0,5).map(b => (
              <Card key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{b.petName}</p>
                  <p className="text-sm text-text-secondary">{new Date(b.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm">{b.status}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
