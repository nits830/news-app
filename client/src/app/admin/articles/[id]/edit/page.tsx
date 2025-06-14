'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  originalSource: string;
  summary: string;
  explanation: string;
  tags: string[];
  category: string;
  coverImage: string;
  published: boolean;
  slug: string;
}

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchArticle();
    }
  }, [resolvedParams.id]);

  const extractImagesFromText = (text: string) => {
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    const matches = text.match(imageRegex) || [];
    return matches;
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (article) {
      setArticle({ ...article, explanation: text });
      const images = extractImagesFromText(text);
      setPreviewImages(images);
    }
  };

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/articles/${resolvedParams.id}`);
      setArticle(response.data);
      if (response.data.explanation) {
        const images = extractImagesFromText(response.data.explanation);
        setPreviewImages(images);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/articles/${resolvedParams.id}`, article);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Original Source URL
              </label>
              <input
                type="url"
                value={article.originalSource}
                onChange={(e) => setArticle({ ...article, originalSource: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="https://www.example.com/article-title"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Summary
              </label>
              <textarea
                value={article.summary}
                onChange={(e) => setArticle({ ...article, summary: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Explanation
              </label>
              <textarea
                value={article.explanation}
                onChange={handleExplanationChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
                required
                placeholder="Write your explanation here. You can include image URLs that will be automatically displayed."
              />
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview Images:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {previewImages.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-video">
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                value={article.category}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="Technology">Technology</option>
                <option value="Politics">Politics</option>
                <option value="World">World</option>
                <option value="National">National</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Science">Science</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gaming">Gaming</option>
                <option value="Art">Art</option>
                <option value="Law">Law</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Books">Books</option>
                <option value="Children">Children</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Environment">Environment</option>
                <option value="Opinion">Opinion</option>
                <option value="Elections">Elections</option>
                <option value="Local">Local</option>
                <option value="Interviews">Interviews</option>
                <option value="Explainers">Explainers</option>
                <option value="Events">Events</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={article.coverImage}
                onChange={(e) => setArticle({ ...article, coverImage: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="https://www.example.com/image.jpg"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={article.published}
                  onChange={(e) => setArticle({ ...article, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 