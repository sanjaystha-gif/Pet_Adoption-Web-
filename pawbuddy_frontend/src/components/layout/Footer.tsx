import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-700 text-white mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              <span className="text-primary-600">🐾 Paw</span>
              <span>Buddy</span>
            </h3>
            <p className="text-sm text-gray-300">
              Find your perfect furry companion and give them a loving home.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/adopt" className="hover:text-white transition-colors">
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="hover:text-white transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:support@pawbuddy.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-600 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PawBuddy. All rights reserved. Made with ❤️ for pet lovers.</p>
        </div>
      </div>
    </footer>
  )
}
