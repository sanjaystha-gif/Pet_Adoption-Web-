import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { showToast } from '../../components/ui/Toast'
import { validateEmail } from '../../utils/helpers'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, isAuthenticated } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => { nameRef.current?.focus() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !phone || !password || !confirm) {
      setError('Please fill all fields')
      if (!name) nameRef.current?.focus()
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
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
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, confirmPassword: confirm })
      showToast.success('Registered successfully')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
      showToast.error(err?.message || 'Registration failed')
    }
  }

  return (
    <div className="container py-20 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={error ? 'register-error' : undefined}>
        <Input ref={nameRef} id="register-name" name="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required aria-required="true" />
        <Input id="register-email" name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
        <Input id="register-phone" name="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required aria-required="true" />
        <Input id="register-password" name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" />
        <Input id="register-confirm" name="confirm" label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required aria-required="true" />

        {error && <p id="register-error" role="alert" className="text-error">{error}</p>}

        <div className="flex items-center justify-between">
          <Link to="/login" className="text-sm text-primary-600">Already have an account? Login</Link>
          <Button type="submit" isLoading={isLoading} aria-disabled={isLoading}>Register</Button>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
