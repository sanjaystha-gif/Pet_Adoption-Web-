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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white to-[#fff8f6] py-12">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <aside className="hidden md:flex flex-col items-start justify-center gap-4 p-10 bg-gradient-to-br from-[#FFEDE9] to-[#FFF8F6]">
          <div className="logo-gradient text-3xl font-extrabold">PawBuddy</div>
          <h3 className="text-2xl font-semibold text-gray-900">Find your furever friend</h3>
          <p className="text-gray-600">Join thousands of adopters who found their companions.</p>
          <div className="mt-6 w-full">
            <img src="https://picsum.photos/seed/login-dog/420/320" alt="Puppy" className="rounded-xl shadow-lg w-full object-cover" />
          </div>
        </aside>

        <main className="p-8 md:p-10 flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to manage your profile, favourites, and bookings.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {error && <p className="text-error">{error}</p>}

              <div className="flex items-center justify-between">
                <Link to="/register" className="text-sm text-primary-600">Create account</Link>
                <Button type="submit" isLoading={isLoading} className="px-6">Login</Button>
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

export default LoginPage
