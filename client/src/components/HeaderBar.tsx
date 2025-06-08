'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HeaderBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 border-b border-blue-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Website Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">NewsApp</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-100"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-blue-100" />
              </div>
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-white hover:text-blue-100 font-medium">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 