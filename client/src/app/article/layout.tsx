'use client';

import { ReactNode } from 'react';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';

export default function ArticleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryBar />
      <main className="pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
} 