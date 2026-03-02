import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineBell } from 'react-icons/ai'
import { useAuth } from '../../context/authStore'
import { Avatar } from '../ui/Avatar'
import { getInitials } from '../../utils/helpers'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  // Close menus on Escape and when clicking outside
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setMobileMenuOpen(false)
      }
    }
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  const publicNavLinks = [
    { label: 'Adopt', href: '/adopt' },
    { label: 'Care Guide', href: '/care-guide' },
    { label: 'About', href: '/about' }
  ]

  return (
    <nav className="bg-white shadow-branded sticky top-0 z-40">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-bold"
        >
          <span className="text-primary-600">🐾 Paw</span>
          <span className="text-secondary-700">Buddy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-text-secondary hover:text-primary-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <button aria-label="Notifications" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <AiOutlineBell size={24} className="text-text-secondary" aria-hidden="true" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-error rounded-full" aria-hidden="true" />
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="user-menu"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Avatar
                    src={user?.avatar ?? undefined}
                    initials={getInitials(user?.name || 'U')}
                    size="sm"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div id="user-menu" role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-primary">{user?.name}</p>
                      <p className="text-sm text-text-secondary">{user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/pets"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Manage Pets
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Manage Bookings
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/favourites"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Favourites
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-error border-t border-border transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-primary-600 font-semibold hover:text-primary-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:block btn-primary text-sm px-6 py-2"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={24} aria-hidden="true" />
            ) : (
              <AiOutlineMenu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-secondary-50 border-t border-border p-4 space-y-3">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-text-secondary hover:text-primary-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Link
                to="/login"
                className="flex-1 text-center py-2 border-2 border-primary-600 text-primary-600 rounded-full font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 bg-primary-600 text-white rounded-full font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

// Close menus on Escape key for accessibility
// and ensure mobile menu closes when route changes is handled by Link onClick handlers above
export default Navbar
