const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'technology', name: 'Technology', emoji: '💻' },
      { id: 'business', name: 'Business', emoji: '💼' },
      { id: 'sports', name: 'Sports', emoji: '⚽' },
      { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
      { id: 'health', name: 'Health', emoji: '🏥' },
      { id: 'science', name: 'Science', emoji: '🔬' },
      { id: 'politics', name: 'Politics', emoji: '🏛️' },
      { id: 'environment', name: 'Environment', emoji: '🌍' },
      { id: 'education', name: 'Education', emoji: '📚' },
      { id: 'travel', name: 'Travel', emoji: '✈️' },
      { id: 'food', name: 'Food', emoji: '🍽️' },
      { id: 'fashion', name: 'Fashion', emoji: '👗' },
      { id: 'art', name: 'Art', emoji: '🎨' },
      { id: 'music', name: 'Music', emoji: '🎵' },
      { id: 'gaming', name: 'Gaming', emoji: '🎮' },
      { id: 'automotive', name: 'Automotive', emoji: '🚗' },
      { id: 'real-estate', name: 'Real Estate', emoji: '🏠' },
      { id: 'finance', name: 'Finance', emoji: '💰' },
      { id: 'agriculture', name: 'Agriculture', emoji: '🌾' },
      { id: 'energy', name: 'Energy', emoji: '⚡' }
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get articles by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Convert categoryId to proper format (e.g., 'technology' -> 'Technology')
    const category = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    const articles = await Article.find({ 
      category: category,
      published: false 
    })
    .select('title slug originalSource summary explanation tags category coverImage createdAt')
    .sort({ createdAt: -1 });

    if (!articles.length) {
      return res.status(404).json({ 
        message: `No articles found in category: ${category}` 
      });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get articles by multiple categories
router.post('/categories', async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories must be an array' });
    }

    const formattedCategories = categories.map(cat => 
      cat.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    );

    const articles = await Article.find({
      category: { $in: formattedCategories },
      published: true
    })
    .select('title slug originalSource summary explanation tags category coverImage createdAt')
    .sort({ createdAt: -1 });

    if (!articles.length) {
      return res.status(404).json({ 
        message: 'No articles found in the selected categories' 
      });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 