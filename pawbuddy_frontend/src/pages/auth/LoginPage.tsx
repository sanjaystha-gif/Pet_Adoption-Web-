import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please provide email and password')
      return
    }

    try {
      await login(email, password)
      showToast.success('Logged in')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed')
      showToast.error(err?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left visual */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 p-8">
          <div className="max-w-xs text-center">
            <div className="text-3xl logo-gradient font-bold mb-4">PawBuddy</div>
            <p className="text-gray-600">Find your furever friend — fast, safe, and loving</p>
            <div className="mt-6">
              <img src="https://picsum.photos/seed/login-dog/360/300" alt="Cute dog" className="rounded-xl shadow-lg mx-auto" />
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Login to access your dashboard and manage bookings.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && <p className="text-error">{error}</p>}

            <div className="flex items-center justify-between">
              <Link to="/register" className="text-sm text-primary-600">Create account</Link>
              <Button type="submit" isLoading={isLoading}>Login</Button>
            </div>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="px-3 text-sm text-gray-400">Or continue with</div>
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

export default LoginPage
