'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard';

interface Article {
  _id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: string;
}

interface RecommendedArticlesProps {
  currentArticleId: string | null;
  onArticleSelect: (articleId: string) => void;
}

export default function RecommendedArticles({ currentArticleId, onArticleSelect }: RecommendedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/articles');
        // Filter out the current article and get random articles
        const filteredArticles = response.data.filter((article: Article) => article._id !== currentArticleId);
        const randomArticles = filteredArticles
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setArticles(randomArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentArticleId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-blue-200 rounded w-1/4"></div>
              <div className="h-6 bg-blue-200 rounded w-3/4"></div>
              <div className="h-4 bg-blue-200 rounded w-full"></div>
              <div className="h-4 bg-blue-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Articles</h2>
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onReadMore={onArticleSelect}
        />
      ))}
    </div>
  );
} 