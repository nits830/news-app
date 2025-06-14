'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface Article {
  _id: string;
  title: string;
  summary: string;
  coverImage: string;
  category: string;
  createdAt: string;
  author?: {
    name: string;
    email: string;
  };
}

interface ArticleCardProps {
  article: Article;
  onReadMore: () => void;
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/article/${article._id}`);
  };

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={handleClick}
    >
      {article.coverImage && (
        <div className="relative h-48 w-full">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-[#1e40af]">{article.category}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>
        {article.author && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <UserIcon className="h-4 w-4" />
            <span>{article.author.name}</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReadMore();
          }}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read More
        </button>
      </div>
    </div>
  );
} 