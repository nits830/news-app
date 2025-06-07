import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'News App',
  description: 'Your trusted source for news and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="py-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[var(--primary)]">News App</h1>
              <div className="flex items-center space-x-4">
                <input 
                  type="search" 
                  placeholder="Search news..." 
                  className="search-input max-w-xs"
                />
              </div>
            </div>
            <nav className="py-4 border-t border-[var(--border)]">
              <div className="flex justify-between items-center">
                <div className="flex space-x-6">
                  <a href="/" className="nav-link">Home</a>
                  <a href="/categories" className="nav-link">Categories</a>
                  <a href="/latest" className="nav-link">Latest</a>
                  <a href="/search" className="nav-link">Search</a>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/subscribe" className="btn-primary">Subscribe</a>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-[var(--background-alt)] border-t border-[var(--border)]">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)] mb-4">About Us</h3>
                <p className="text-[var(--text-secondary)]">Your trusted source for the latest news and insights from around the world.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">About</a></li>
                  <li><a href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Contact</a></li>
                  <li><a href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><a href="/category/politics" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Politics</a></li>
                  <li><a href="/category/business" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Business</a></li>
                  <li><a href="/category/technology" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Technology</a></li>
                  <li><a href="/category/science" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Science</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Twitter</a>
                  <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Instagram</a>
                  <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Facebook</a>
                </div>
                <div className="mt-4">
                  <a href="/subscribe" className="btn-primary">Subscribe to Newsletter</a>
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border)] mt-8 pt-8 text-center">
              <p className="text-[var(--text-secondary)]">&copy; {new Date().getFullYear()} News App. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
