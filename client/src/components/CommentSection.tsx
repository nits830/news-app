'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  articleId: string;
}

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/article/${articleId}`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await api.post('/comments', {
        content: newComment,
        articleId
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error posting comment:', err);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await api.put(`/comments/${commentId}`, {
        content: editContent
      });
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ));
      setEditingCommentId(null);
      setEditContent('');
      setError(null);
    } catch (err) {
      setError('Failed to edit comment');
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      setError(null);
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await api.post(`/comments/${commentId}/like`);
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ));
      setError(null);
    } catch (err) {
      setError('Failed to like comment');
      console.error('Error liking comment:', err);
    }
  };

  const getAuthorInitial = (author: Comment['author']) => {
    return author?.name?.charAt(0) || '?';
  };

  const getAuthorName = (author: Comment['author']) => {
    return author?.name || 'Anonymous';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="comment" className="sr-only">Write a comment</label>
            <textarea
              id="comment"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {comment.author.profilePicture ? (
                  <img
                    src={comment.author.profilePicture}
                    alt={getAuthorName(comment.author)}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {getAuthorInitial(comment.author)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {getAuthorName(comment.author)}
                  </p>
                  <div className="flex items-center space-x-2">
                    {user && comment.author._id === user.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {user && (
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`text-gray-400 hover:text-red-500 ${
                          comment.likes.includes(user.id) ? 'text-red-500' : ''
                        }`}
                      >
                        {comment.likes.includes(user.id) ? (
                          <HeartIconSolid className="h-5 w-5" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">{comment.content}</p>
                )}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {comment.likes.length > 0 && (
                    <span className="ml-2">
                      {comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 