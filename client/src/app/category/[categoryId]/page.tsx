'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types/article';
import CategoryBar from '@/components/CategoryBar';
import { NewspaperIcon } from '@heroicons/react/24/outline';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCategoryName = (category: string) => {
    return category
      .toString()
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(`http://localhost:5000/api/category/${categoryId}`);
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid response format from server');
        }
        
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('No articles found in this category');
          } else {
            setError(err.response?.data?.message || 'Failed to fetch articles');
          }
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [categoryId, searchParams]);

  const handleReadMore = (slug: string) => {
    if (!slug) return;
    router.push(`/article/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CategoryBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {formatCategoryName(categoryId as string)}
          </h1>
          
          {error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <NewspaperIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {error === 'No articles found in this category' 
                  ? 'No Articles Available'
                  : 'Error Loading Articles'}
              </h2>
              <p className="text-gray-600 mb-6">
                {error === 'No articles found in this category'
                  ? `We couldn't find any articles in the ${formatCategoryName(categoryId as string)} category at the moment.`
                  : error}
              </p>
              <div className="space-y-4">
                <p className="text-gray-500">You might want to:</p>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => router.push('/')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Browse other categories
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/search')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Search for specific topics
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.slug} 
                    article={article} 
                    onReadMore={() => handleReadMore(article.slug)}
                  />
                ))}
              </div>
              {articles.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <NewspaperIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No Articles Available
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any articles in the {formatCategoryName(categoryId as string)} category at the moment.
                  </p>
                  <div className="space-y-4">
                    <p className="text-gray-500">You might want to:</p>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => router.push('/')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Browse other categories
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => router.push('/search')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Search for specific topics
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 