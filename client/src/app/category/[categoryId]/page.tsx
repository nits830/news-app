'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types/article';
import HeaderBar from '@/components/HeaderBar';
import CategoryBar from '@/components/CategoryBar';
import Sidebar from '@/components/Sidebar';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      if (!categoryId) return;
      
      try {
        console.log('Fetching articles for category:', categoryId);
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(`http://localhost:5000/api/category/${categoryId}`);
        console.log('Fetched articles:', data);
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid response format from server');
        }
        
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch articles');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [categoryId, searchParams]);

  const handleReadMore = (slug: string) => {
    if (!slug) return;
    console.log('Navigating to article:', slug);
    router.push(`/article/${slug}`);
  };

  const handleArticleSelect = (articleId: string) => {
    if (!articleId) return;
    setSelectedArticleId(articleId);
    const article = articles.find(a => a._id === articleId);
    if (article?.slug) {
      router.push(`/article/${article.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBar />
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBar />
        <CategoryBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Articles</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <CategoryBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
              {categoryId?.toString().replace(/-/g, ' ')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCard 
                  key={article.slug} 
                  article={article} 
                  onReadMore={() => handleReadMore(article.slug)}
                />
              ))}
            </div>
            {articles.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No articles found in this category.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <Sidebar 
              onArticleSelect={handleArticleSelect}
              selectedArticleId={selectedArticleId}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 