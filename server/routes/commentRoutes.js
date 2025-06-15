const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth, isCommentAuthor, isAuthenticated } = require('../middleware/userMiddleware');

// Get comments for an article
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      article: req.params.articleId,
      parentComment: null // Only get top-level comments
    })
    .populate('author', 'name profilePicture')
    .populate({
      path: 'likes',
      select: '_id'
    })
    .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Get replies for a comment
router.get('/:commentId/replies', async (req, res) => {
  try {
    const replies = await Comment.find({ 
      parentComment: req.params.commentId 
    })
    .populate('author', 'name profilePicture')
    .populate({
      path: 'likes',
      select: '_id'
    })
    .sort({ createdAt: 1 });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replies', error: error.message });
  }
});

// Add a new comment
router.post('/', auth, isAuthenticated, async (req, res) => {
  try {
    const { content, articleId, parentCommentId } = req.body;
    
    const comment = new Comment({
      content,
      article: articleId,
      author: req.user.id,
      parentComment: parentCommentId || null
    });

    await comment.save();
    
    // Populate author details before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture')
      .populate({
        path: 'likes',
        select: '_id'
      });
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

// Update a comment
router.put('/:commentId', auth, isAuthenticated, isCommentAuthor, async (req, res) => {
  try {
    const comment = req.comment; // Set by isCommentAuthor middleware
    comment.content = req.body.content;
    await comment.save();
    
    // Populate author details before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture')
      .populate({
        path: 'likes',
        select: '_id'
      });
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
});

// Delete a comment
router.delete('/:commentId', auth, isAuthenticated, isCommentAuthor, async (req, res) => {
  try {
    await req.comment.deleteOne(); // Set by isCommentAuthor middleware
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

// Like/Unlike a comment
router.post('/:commentId/like', auth, isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);
    
    if (likeIndex === -1) {
      // Like the comment
      comment.likes.push(req.user.id);
    } else {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    
    // Populate author details before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture')
      .populate({
        path: 'likes',
        select: '_id'
      });
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating like status', error: error.message });
  }
});

module.exports = router; 