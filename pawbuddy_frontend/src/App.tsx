import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Pages
import HomePage from './pages/public/HomePage'
import AdoptPage from './pages/public/AdoptPage'
import PetDetailPage from './pages/public/PetDetailPage'
import CareGuidePage from './pages/public/CareGuidePage'
import AboutPage from './pages/public/AboutPage'
import NotFoundPage from './pages/public/NotFoundPage'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/user/DashboardPage'
import ProfilePage from './pages/user/ProfilePage'
import MyBookingsPage from './pages/user/MyBookingsPage'
import FavouritesPage from './pages/user/FavouritesPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePetsPage from './pages/admin/ManagePetsPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import ManageBookingsPage from './pages/admin/ManageBookingsPage'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/adopt" element={<AdoptPage />} />
            <Route path="/pet/:id" element={<PetDetailPage />} />
            <Route path="/care-guide" element={<CareGuidePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute role="adopter" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/pets" element={<ManagePetsPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/bookings" element={<ManageBookingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#2D1B14',
            border: '2px solid #E8705A',
            borderRadius: '12px',
            boxShadow: 'rgba(232, 112, 90, 0.15) 0px 4px 12px'
          },
          success: {
            iconTheme: {
              primary: '#A8D5BA',
              secondary: '#FFFFFF'
            }
          }
        }}
      />
    </Router>
  )
}

export default App
