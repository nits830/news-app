'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ArticleView from './ArticleView';
import RecommendedArticles from './RecommendedArticles';

export default function ArticleLayout() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Fixed width */}
          <div className="w-1/4">
            <Sidebar onArticleSelect={setSelectedArticleId} selectedArticleId={selectedArticleId} />
          </div>

          {/* Article View - Flexible width */}
          <div className="w-1/2">
            <ArticleView articleId={selectedArticleId} />
          </div>

          {/* Recommended Articles - Fixed width */}
          <div className="w-1/4">
            <RecommendedArticles 
              currentArticleId={selectedArticleId} 
              onArticleSelect={setSelectedArticleId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 