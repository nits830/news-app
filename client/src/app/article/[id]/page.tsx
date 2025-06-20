'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { CalendarIcon, UserIcon, TagIcon, ClockIcon, ShareIcon, BookmarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import RecommendedArticles from '@/components/RecommendedArticles';
import CommentSection from '@/components/CommentSection';

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
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/articles/${params.id}`);
        setArticle(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

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
  };

  const calculateWordCount = (text: string | undefined) => {
    if (!text) return 0;
    return text.split(/\s+/).length;
  };

  const renderExplanationWithImages = (text: string | undefined) => {
    if (!text) return null;
    
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    const parts = text.split(imageRegex);
    
    return parts.map((part, index) => {
      if (part.match(imageRegex)) {
        return (
          <div key={index} className="my-6">
            <img
              src={part}
              alt={`Article image ${index + 1}`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        );
      }
      return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{part}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6">
          <p className="text-gray-600">Article not found</p>
        </div>
      </div>
    );
  }

  const wordCount = calculateWordCount(article.summary) + 
    calculateWordCount(article.content?.data || article.explanation);
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
              <div className="text-gray-700 leading-relaxed">
                {renderExplanationWithImages(article.explanation)}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Link */}
          {article.originalSource && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Original source:{' '}
                <a
                  href={article.originalSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {article.originalSource}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Article Footer */}
        <footer className="p-6 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-2 transition-colors ${
                  isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <BookmarkIcon className="h-5 w-5" />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection articleId={params.id as string} />
      </div>

      {/* Recommended Articles */}
      <div className="mt-12">
        <RecommendedArticles currentArticleId={params.id as string} />
      </div>
    </div>
  );
} 