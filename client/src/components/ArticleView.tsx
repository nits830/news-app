'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

interface Article {
  _id: string;
  title: string;
  summary: string;
  explanation: string;
  originalSource: string;
  category: string;
  tags: string[];
  coverImage: string;
  author?: {
    name: string;
    email: string;
  };
  publishedAt: string;
}

interface ArticleViewProps {
  articleId: string | null;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setArticle(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/articles/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!articleId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select an article to view</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        {article.author && (
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>{article.author.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <TagIcon className="h-4 w-4" />
          <span>{article.category}</span>
        </div>
      </div>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="prose prose-lg max-w-none">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-gray-700">{article.summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Explanation</h2>
          <p className="text-gray-700">{article.explanation}</p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {article.originalSource && (
          <div className="mt-6 pt-6 border-t">
            <a
              href={article.originalSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Read original article →
            </a>
          </div>
        )}
      </div>
    </article>
  );
} 