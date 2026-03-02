import React from 'react'
import { useBooking } from '../../context/bookingStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'

const ManageBookingsPage: React.FC = () => {
  const { bookings, approveBooking, rejectBooking } = useBooking()

  const handleApprove = async (id: string) => {
    try {
      await approveBooking(id)
      showToast.success('Booking approved')
    } catch (err) {
      showToast.error('Failed to approve')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectBooking(id)
      showToast.success('Booking rejected')
    } catch (err) {
      showToast.error('Failed to reject')
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="grid gap-4">
        {bookings.map(b => (
          <Card key={b.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{b.petName} — {b.adopterName}</p>
              <p className="text-sm text-text-secondary">{new Date(b.submittedAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              {b.status === 'pending' && (
                <>
                  <Button variant="primary" size="sm" onClick={() => handleApprove(b.id)}>Approve</Button>
                  <Button variant="danger" size="sm" onClick={() => handleReject(b.id)}>Reject</Button>
                </>
              )}
              {b.status !== 'pending' && <div className="text-sm">{b.status}</div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageBookingsPage
