'use client';

import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Article {
  _id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: string;
}

interface ArticleCardProps {
  article: Article;
  onReadMore: (articleId: string) => void;
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-4 hover:shadow-xl transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span>•</span>
          <span className="text-[#1e40af] font-medium">{article.category}</span>
        </div>
        
        <h3 className="font-medium text-gray-900 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {article.summary}
        </p>
        
        <button
          onClick={() => onReadMore(article._id)}
          className="flex items-center text-sm text-[#1e40af] hover:text-white font-medium group relative overflow-hidden rounded-md px-3 py-1.5 transition-all duration-300 ease-in-out hover:bg-[#1e40af] cursor-pointer"
        >
          <span className="relative z-10">Read more</span>
          <ChevronRightIcon className="h-4 w-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
          <div className="absolute inset-0 bg-[#1e40af] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"></div>
        </button>
      </div>
    </div>
  );
} 