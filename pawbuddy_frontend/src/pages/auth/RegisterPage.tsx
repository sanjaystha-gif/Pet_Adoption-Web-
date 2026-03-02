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
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="text-center">
            <div className="text-3xl logo-gradient font-bold mb-4">Furry Friends</div>
            <p className="text-gray-600">Join PawBuddy and help animals find loving homes.</p>
            <div className="mt-6">
              <img src="https://picsum.photos/seed/register-dog/360/300" alt="Puppy" className="rounded-xl shadow-lg mx-auto" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Sign up to save favourites, request meetings, and more.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

            {error && <p className="text-error">{error}</p>}

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-primary-600">Already have an account? Login</Link>
              <Button type="submit" isLoading={isLoading}>Register</Button>
            </div>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="px-3 text-sm text-gray-400">Or sign up with</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:shadow-sm">
              <FaGoogle /> <span className="text-sm">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:shadow-sm">
              <FaFacebookF /> <span className="text-sm">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
