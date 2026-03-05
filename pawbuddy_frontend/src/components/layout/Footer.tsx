import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-50 via-white to-purple-50 text-gray-700 mt-20 border-t border-orange-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <img
              src="https://res.cloudinary.com/dthfai8ky/image/upload/v1772738742/Logo_wxtsej.png"
              alt="PawBuddy"
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm text-gray-600">
              Find your perfect furry companion and give them a loving home.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/adopt" className="hover:text-primary transition-colors">
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="hover:text-primary transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="mailto:support@pawbuddy.com" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay in touch</h4>
            <p className="text-sm text-gray-600 mb-4">Subscribe for pet updates.</p>
            <form className="flex gap-2">
              <input aria-label="Email" type="email" placeholder="Your email" className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-primary" />
              <button type="submit" className="btn-primary px-4 py-2 text-sm">Join</button>
            </form>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>&copy; 2024 PawBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
