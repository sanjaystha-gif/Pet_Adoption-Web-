import React, { useState } from 'react'
import { useAuth } from '../../context/authStore'
import { Avatar } from '../../components/ui/Avatar'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({ name, phone, bio, city })
      showToast.success('Profile updated')
    } catch (err) {
      showToast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-card p-6 rounded-xl">
        <div className="flex items-center gap-6 mb-6">
          <Avatar src={user?.avatar ?? undefined} alt={user?.name ?? 'User'} size="xl" />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />

          <div className="flex justify-end">
            <Button variant="primary" isLoading={isSaving} onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
