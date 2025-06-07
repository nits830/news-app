import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HeaderBar from '@/components/HeaderBar'
import CategoryBar from '@/components/CategoryBar'
import ArticleLayout from '@/components/ArticleLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NewsApp - Your Trusted News Source',
  description: 'Stay informed with the latest news and updates from around the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderBar />
        <CategoryBar />
        <ArticleLayout />
        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
                <p className="text-gray-600">
                  Your trusted source for the latest news and updates from around the world.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-600 hover:text-primary">About</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-primary">Contact</a></li>
                  <li><a href="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-600 hover:text-primary">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><a href="/category/politics" className="text-gray-600 hover:text-primary">Politics</a></li>
                  <li><a href="/category/technology" className="text-gray-600 hover:text-primary">Technology</a></li>
                  <li><a href="/category/business" className="text-gray-600 hover:text-primary">Business</a></li>
                  <li><a href="/category/sports" className="text-gray-600 hover:text-primary">Sports</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-primary">Twitter</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-primary">Facebook</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-primary">Instagram</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-primary">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500">
                © {new Date().getFullYear()} NewsApp. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
