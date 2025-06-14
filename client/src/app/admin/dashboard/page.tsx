'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import axios from 'axios';
import Image from 'next/image';

interface Article {
  _id: string;
  title: string;
  slug: string;
  originalSource: string;
  summary: string;
  explanation: string;
  tags: string[];
  category: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewArticleForm, setShowNewArticleForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    originalSource: '',
    summary: '',
    explanation: '',
    tags: [] as string[],
    category: 'Technology',
    coverImage: '',
    published: false
  });
  const [tagInput, setTagInput] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articles');
      console.log('Articles response:', response.data);
      // The server sends articles directly in the response
      setArticles(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.response?.data?.message || 'Failed to fetch articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/articles', newArticle);
      console.log('Create article response:', response.data);
      setShowNewArticleForm(false);
      setNewArticle({
        title: '',
        originalSource: '',
        summary: '',
        explanation: '',
        tags: [],
        category: 'Technology',
        coverImage: '',
        published: false
      });
      setTagInput('');
      fetchArticles();
    } catch (err: any) {
      console.error('Error creating article:', err);
      setError(err.response?.data?.message || 'Failed to create article');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newArticle.tags.includes(tagInput.trim())) {
      setNewArticle({
        ...newArticle,
        tags: [...newArticle.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewArticle({
      ...newArticle,
      tags: newArticle.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const toggleArticleStatus = async (articleId: string, currentStatus: boolean) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/articles/${articleId}/${currentStatus ? 'unpublish' : 'publish'}`);
      console.log('Toggle status response:', response.data);
      fetchArticles();
    } catch (err: any) {
      console.error('Error toggling article status:', err);
      setError(err.response?.data?.message || 'Failed to update article status');
    }
  };

  const extractImagesFromText = (text: string) => {
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    const matches = text.match(imageRegex) || [];
    return matches;
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNewArticle({ ...newArticle, explanation: text });
    const images = extractImagesFromText(text);
    setPreviewImages(images);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setShowNewArticleForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              New Article
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* New Article Form */}
        {showNewArticleForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Create New Article</h3>
                <button
                  onClick={() => setShowNewArticleForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleNewArticleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Original Source URL
                  </label>
                  <input
                    type="url"
                    value={newArticle.originalSource}
                    onChange={(e) => setNewArticle({ ...newArticle, originalSource: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://www.example.com/article-title"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Example: https://www.bbc.com/news/world-us-canada-12345678
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Summary
                  </label>
                  <textarea
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Explanation
                  </label>
                  <textarea
                    value={newArticle.explanation}
                    onChange={handleExplanationChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
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
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
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
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newArticle.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newArticle.coverImage}
                    onChange={(e) => setNewArticle({ ...newArticle, coverImage: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newArticle.published}
                      onChange={(e) => setNewArticle({ ...newArticle, published: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Publish immediately</span>
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Create Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-6 py-4 text-center text-gray-500">Loading articles...</li>
              ) : articles.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">No articles found</li>
              ) : (
                articles.map((article) => (
                  <li key={article._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          By {article.author?.name || 'Unknown'} • {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleArticleStatus(article._id, article.published)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            article.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {article.published ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/articles/${article._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 