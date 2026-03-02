import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'

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
    <div className="container py-20 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="text-error">{error}</p>}

        <div className="flex items-center justify-between">
          <Link to="/register" className="text-sm text-primary-600">Don't have an account? Register</Link>
          <Button type="submit" isLoading={isLoading}>Login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
