'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ArticleView from './ArticleView';

export default function ArticleLayout() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  return (
    <div className="flex">
      <Sidebar onArticleSelect={setSelectedArticleId} />
      <ArticleView articleId={selectedArticleId} />
    </div>
  );
} 