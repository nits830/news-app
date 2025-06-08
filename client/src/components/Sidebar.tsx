'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewspaperIcon } from '@heroicons/react/24/outline';

interface Article {
  _id: string;
  title: string;
  summary: string;
  createdAt: string;
  category: string;
}

interface SidebarProps {
  onArticleSelect: (articleId: string) => void;
  selectedArticleId: string | null;
}

export default function Sidebar({ onArticleSelect, selectedArticleId }: SidebarProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/articles');
        const sortedArticles = response.data.sort((a: Article, b: Article) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setArticles(sortedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200">
      <div className="p-4 border-b border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900">Latest Articles</h2>
      </div>
      <div className="divide-y divide-blue-200">
        {articles.map((article) => (
          <button
            key={article._id}
            onClick={() => onArticleSelect(article._id)}
            className={`w-full p-4 text-left hover:bg-blue-100/70 transition-colors cursor-pointer group ${
              selectedArticleId === article._id ? 'bg-blue-100' : ''
            }`}
          >
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:underline">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {article.summary}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 