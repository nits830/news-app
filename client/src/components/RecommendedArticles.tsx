'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ArticleCard from './ArticleCard';

interface Article {
  _id: string;
  title: string;
  summary: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

interface RecommendedArticlesProps {
  currentArticleId: string;
  category?: string;
}

export default function RecommendedArticles({ currentArticleId, category }: RecommendedArticlesProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/articles');
        let filteredArticles = response.data.filter((article: Article) => article._id !== currentArticleId);
        
        // If category is provided, prioritize articles from the same category
        if (category) {
          const sameCategoryArticles = filteredArticles.filter((article: Article) => article.category === category);
          const otherCategoryArticles = filteredArticles.filter((article: Article) => article.category !== category);
          filteredArticles = [...sameCategoryArticles, ...otherCategoryArticles];
        }
        
        // Take only the first 3 articles
        setArticles(filteredArticles.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentArticleId, category]);

  const handleArticleSelect = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-gray-600">No recommended articles found</p>;
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onReadMore={() => handleArticleSelect(article._id)}
        />
      ))}
    </div>
  );
} 