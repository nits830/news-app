const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const { isAdmin } = require('../middleware/adminMiddleware');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Admin signup route (no auth required)
router.post('/auth/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if password meets requirements
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new admin user
    const user = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token in body
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin account',
      error: error.message
    });
  }
});

// Admin login route (no auth required)
router.post('/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token in body
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Apply auth middleware to all other admin routes


// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user by ID
router.get('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user role
router.patch('/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'author'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.adminUser._id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get all articles (including unpublished)
router.get('/articles', isAdmin, async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

// Get article by ID
router.get('/articles/:id', isAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
});

// Update any article
router.put('/articles/:id', isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article updated successfully', article });
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
});

// Delete any article
router.delete('/articles/:id', isAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ published: true });
    const unpublishedArticles = await Article.countDocuments({ published: false });
    
    // Get user role distribution
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const authorUsers = await User.countDocuments({ role: 'author' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Get recent articles with more details
    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name email')
      .select('title slug published createdAt author');

    // Get recent users with more details
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    // Get articles by status
    const articlesByStatus = {
      published: publishedArticles,
      unpublished: unpublishedArticles,
      total: totalArticles
    };

    // Get users by role
    const usersByRole = {
      admin: adminUsers,
      author: authorUsers,
      regular: regularUsers,
      total: totalUsers
    };

    res.json({
      success: true,
      data: {
        statistics: {
          articles: articlesByStatus,
          users: usersByRole
        },
        recentActivity: {
          articles: recentArticles,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Example admin-only route for managing articles
router.post('/articles', isAdmin, async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.adminUser._id // Using the admin user from middleware
    });
    await article.save();
    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
});

// Example admin-only route for managing categories
router.put('/categories/:id', isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

module.exports = router; 