import React from 'react'
import { useAuth } from '../../context/authStore'
import { useBooking } from '../../context/bookingStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBooking()

  const myBookings = user ? getUserBookings(user.id) : []

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id)
      showToast.success('Booking canceled')
    } catch (err) {
      showToast.error('Failed to cancel')
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {myBookings.length === 0 ? (
        <Card className="p-6 text-center">You have no bookings. <a href="/adopt" className="text-primary-600">Browse pets</a></Card>
      ) : (
        <div className="grid gap-4">
          {myBookings.map(b => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.petName}</p>
                <p className="text-sm text-text-secondary">{new Date(b.submittedAt).toLocaleString()}</p>
                <p className="text-sm">{b.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-semibold">{b.status}</div>
                {b.status === 'pending' && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(b.id)}>Cancel</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage
