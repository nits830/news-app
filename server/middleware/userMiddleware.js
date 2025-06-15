const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Middleware to verify JWT token and attach user to request
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is the author of a comment
const isCommentAuthor = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    req.comment = comment;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking comment ownership', error: error.message });
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

module.exports = {
  auth,
  isCommentAuthor,
  isAuthenticated
}; 