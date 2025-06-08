'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, UserIcon, TagIcon, ClockIcon, ShareIcon, BookmarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

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
  createdAt: string;
  content?: {
    type: 'markdown' | 'html';
    data: string;
  };
  images?: {
    url: string;
    alt: string;
    caption?: string;
  }[];
}

interface ArticleViewProps {
  articleId: string | null;
}

export default function ArticleView({ articleId }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically also update the backend
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-blue-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-blue-200 rounded w-full"></div>
              <div className="h-4 bg-blue-200 rounded w-5/6"></div>
              <div className="h-4 bg-blue-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Select an article to view</p>
      </div>
    );
  }

  const wordCount = article.summary.split(/\s+/).length + 
    (article.content?.data || article.explanation).split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="w-full">
      <article className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200">
        {/* Article Header */}
        <header className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-[#1e40af]">{article.category}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{readingTime} min read</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {article.author && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <UserIcon className="h-4 w-4" />
              <span>By {article.author.name}</span>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="p-6 border-b border-blue-200">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-6 prose prose-lg max-w-none">
          {/* Summary Section */}
          <div className="mb-8 p-4 bg-blue-100/70 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{article.summary}</p>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            {article.content ? (
              <div className="rich-content">
                {article.content.type === 'markdown' ? (
                  <div className="text-gray-700 leading-relaxed">
                    {article.content.data}
                  </div>
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.content.data }}
                    className="rich-content text-gray-700 leading-relaxed"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">{article.explanation}</p>
            )}
          </div>

          {/* Additional Images */}
          {article.images && article.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {article.images.map((image, index) => (
                <figure key={index} className="relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {image.caption && (
                    <figcaption className="text-sm text-gray-600 mt-2">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100/70 text-[#1e40af] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Footer */}
          <div className="border-t border-blue-200 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {article.originalSource && (
                  <a
                    href={article.originalSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e40af] hover:text-[#1e3a8a] font-medium"
                  >
                    Read original article
                  </a>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="text-gray-600 hover:text-gray-900"
                  title="Share article"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`${
                    isBookmarked 
                      ? 'text-[#1e40af] hover:text-[#1e3a8a]' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => {/* Implement comment functionality */}}
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
} 