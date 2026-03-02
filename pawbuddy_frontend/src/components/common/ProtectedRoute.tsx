import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/authStore'
import { Loader } from '../ui/Loader'

interface ProtectedRouteProps {
  role?: string | null
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return <Loader fullPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
