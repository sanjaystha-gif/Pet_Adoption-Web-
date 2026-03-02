import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'
import { validateEmail } from '../../utils/helpers'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => { emailRef.current?.focus() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please provide email and password')
      if (!email) emailRef.current?.focus()
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      emailRef.current?.focus()
      return
    }

    try {
      await login(email.trim(), password)
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
      <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={error ? 'login-error' : undefined}>
        <Input ref={emailRef} id="login-email" name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
        <Input id="login-password" name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" />

        {error && <p id="login-error" role="alert" className="text-error">{error}</p>}

        <div className="flex items-center justify-between">
          <Link to="/register" className="text-sm text-primary-600">Don't have an account? Register</Link>
          <Button type="submit" isLoading={isLoading} aria-disabled={isLoading}>Login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
