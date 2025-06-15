'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronDownIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId);
    router.replace(`/category/${categoryId}`);
    setIsDropdownOpen(false);
  };

  // Split categories into displayed and dropdown
  const displayedCategories = categories.slice(0, 8); // Show 8 categories
  const dropdownCategories = categories.slice(8); // Rest go in dropdown

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-6 w-20 bg-blue-400 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 border-b border-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-4 w-full">
            <div className="flex items-center space-x-4 min-w-0">
              <button
                onClick={() => router.push('/')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  pathname === '/'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-50 hover:bg-blue-600/50 hover:text-white'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </button>
              {displayedCategories.map((category) => {
                const isActive = pathname === `/category/${category.id}`;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-50 hover:bg-blue-600/50 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.name}
                  </button>
                );
              })}
            </div>
            
            {dropdownCategories.length > 0 && (
              <div className="relative flex-shrink-0 ml-auto" ref={dropdownRef}>
                <button
                  ref={moreButtonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-50 hover:bg-blue-600/50 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  More
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 max-h-[calc(100vh-200px)] overflow-y-auto" role="menu" aria-orientation="vertical">
                      {dropdownCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                          role="menuitem"
                        >
                          <span className="mr-2">{category.emoji}</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 