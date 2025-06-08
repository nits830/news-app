'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/articles/categories');
        setCategories(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-6 w-20 bg-blue-300/30 animate-pulse rounded" />
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
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedCategories = categories.slice(0, 10);
  const dropdownCategories = categories.slice(10);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 border-b border-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            {displayedCategories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-50 hover:text-white hover:bg-blue-400/30 rounded-md transition-colors"
              >
                <span className="mr-1">{category.emoji}</span>
                {category.name}
              </a>
            ))}
            
            {dropdownCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-50 hover:text-white hover:bg-blue-400/30 rounded-md transition-colors"
                >
                  More
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-blue-500 ring-1 ring-blue-300 ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {dropdownCategories.map((category) => (
                        <a
                          key={category.id}
                          href={`/category/${category.id}`}
                          className="block px-4 py-2 text-sm text-blue-50 hover:bg-blue-400/30 hover:text-white"
                          role="menuitem"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="mr-2">{category.emoji}</span>
                          {category.name}
                        </a>
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