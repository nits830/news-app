'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
}

interface SidebarProps {
  onArticleSelect: (articleId: string) => void;
}

export default function Sidebar({ onArticleSelect }: SidebarProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/articles');
        setArticles(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load latest articles');
        setIsLoading(false);
        console.error('Error fetching articles:', err);
      }
    };

    fetchLatestArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-[var(--primary)] mb-4">Latest Articles</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-[var(--primary)] mb-4">Latest Articles</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-[var(--primary)] mb-4">Latest Articles</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <button
            key={article._id}
            onClick={() => onArticleSelect(article._id)}
            className="w-full text-left group"
          >
            <h3 className="text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {article.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
} 