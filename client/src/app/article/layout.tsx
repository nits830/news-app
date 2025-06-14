'use client';

import HeaderBar from '@/components/HeaderBar';
import CategoryBar from '@/components/CategoryBar';
import Footer from '@/components/Footer';

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200">
      <HeaderBar />
      <CategoryBar />
      <main className="pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
} 