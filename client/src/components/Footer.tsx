'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
            <p className="text-gray-600">
              Your trusted source for the latest news and insights across various categories.
              Stay informed with our comprehensive coverage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/technology" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/science" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Science
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: contact@newsapp.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 News Street, City, Country</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-blue-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} News App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 