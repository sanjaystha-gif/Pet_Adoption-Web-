import React, { useState } from 'react'
import { useBooking } from '../../context/bookingStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'

const ManageBookingsPage: React.FC = () => {
  const { bookings, approveBooking, rejectBooking } = useBooking()
  const [detail, setDetail] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null)

  const handleApprove = async (id: string) => {
    try {
      await approveBooking(id)
      showToast.success('Booking approved')
    } catch {
      showToast.error('Failed to approve')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectBooking(id)
      showToast.success('Booking rejected')
    } catch {
      showToast.error('Failed to reject')
    }
  }

  const handleConfirmAction = async () => {
    if (!confirm) return
    const { id, action } = confirm
    setConfirm(null)
    if (action === 'approve') return handleApprove(id)
    return handleReject(id)
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
              <Button size="sm" variant="outline" onClick={() => setDetail(b.message)}>View</Button>
              {b.status === 'pending' && (
                <>
                  <Button variant="primary" size="sm" onClick={() => setConfirm({ id: b.id, action: 'approve' })}>Approve</Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirm({ id: b.id, action: 'reject' })}>Reject</Button>
                </>
              )}
              {b.status !== 'pending' && <div className="text-sm">{b.status}</div>}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Booking Message">
        <div className="space-y-3">
          <p>{detail}</p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirm Action">
        <div className="space-y-3">
          <p>Are you sure you want to {confirm?.action} this booking?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirmAction}>Yes</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageBookingsPage
