import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !phone || !password || !confirm) {
      setError('Please fill all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      await register({ name, email, phone, password, confirmPassword: confirm })
      showToast.success('Registered successfully')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
      showToast.error(err?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <aside className="hidden md:flex flex-col items-start justify-center gap-4 p-10 bg-gradient-to-br from-[#FFF7EE] to-[#FFFDFB]">
          <img
            src="https://res.cloudinary.com/dthfai8ky/image/upload/v1772738742/Logo_wxtsej.png"
            alt="PawBuddy"
            className="h-12 w-auto"
          />
          <h3 className="text-2xl font-semibold text-gray-900">Join our community</h3>
          <p className="text-gray-600">Create an account to save favourites and book visits.</p>
          <div className="mt-6 w-full">
            <img src="https://res.cloudinary.com/dthfai8ky/image/upload/v1772358071/DogPic_vo8toz.png" alt="Puppy" className="rounded-xl shadow-lg w-full object-cover" />
          </div>
        </aside>

        <main className="p-8 md:p-10 flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">Sign up to start adopting and managing your bookings.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

              {error && <p className="text-error">{error}</p>}

              <div className="flex items-center justify-between">
                <Link to="/login" className="text-sm text-primary-600">Already have an account?</Link>
                <Button type="submit" isLoading={isLoading} className="px-6">Register</Button>
              </div>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="px-3 text-sm text-gray-400">Or continue with</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:shadow-sm bg-white">
                <FaGoogle className="text-red-500"/> <span className="text-sm">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:shadow-sm bg-white">
                <FaFacebookF className="text-blue-600"/> <span className="text-sm">Facebook</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default RegisterPage
