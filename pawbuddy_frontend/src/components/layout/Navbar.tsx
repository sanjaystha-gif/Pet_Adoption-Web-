import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
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
    <nav className="sticky top-0 z-40 nav-glass shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center focus:outline-none"
        >
          <img
            src="https://res.cloudinary.com/dthfai8ky/image/upload/v1772738742/Logo_wxtsej.png"
            alt="PawBuddy"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-gray-700 hover:text-primary focus:text-primary focus:outline-none font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="user-menu"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-md transition-colors"
                >
                  <Avatar
                    src={user?.avatar ?? undefined}
                    initials={getInitials(user?.name || 'U')}
                    size="sm"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div id="user-menu" role="menu" className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
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
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 border-t border-gray-200 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-gray-700 font-medium hover:text-primary focus:text-primary focus:outline-none">
                Login
              </Link>
              <Link to="/register" className="hidden sm:block btn-primary px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
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
            className="md:hidden p-2 focus:outline-none hover:bg-gray-100 rounded-md transition-colors"
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
        <div id="mobile-menu" className="md:hidden bg-gray-50 border-t border-gray-200 p-4 space-y-3">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-gray-700 hover:text-primary focus:text-primary focus:outline-none font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="flex-1 text-center py-2 border-2 border-primary text-primary rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 bg-primary text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
