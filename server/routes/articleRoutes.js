const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const slugify = require('slugify');

// Get all available categories
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'politics', name: 'Politics', emoji: '🏛️' },
    { id: 'world', name: 'World', emoji: '🌐' },
    { id: 'national', name: 'National', emoji: '🇮🇳' },
    { id: 'business', name: 'Business', emoji: '💼' },
    { id: 'finance', name: 'Finance', emoji: '📈' },
    { id: 'education', name: 'Education', emoji: '🧠' },
    { id: 'technology', name: 'Technology', emoji: '💻' },
    { id: 'science', name: 'Science', emoji: '🔬' },
    { id: 'health', name: 'Health', emoji: '🚑' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎭' },
    { id: 'gaming', name: 'Gaming', emoji: '🕹️' },
    { id: 'art', name: 'Art', emoji: '🎨' },
    { id: 'law', name: 'Law', emoji: '⚖️' },
    { id: 'lifestyle', name: 'Lifestyle', emoji: '🧘' },
    { id: 'food', name: 'Food', emoji: '👨‍🍳' },
    { id: 'travel', name: 'Travel', emoji: '✈️' },
    { id: 'books', name: 'Books', emoji: '📚' },
    { id: 'children', name: 'Children', emoji: '🧒' },
    { id: 'real-estate', name: 'Real Estate', emoji: '🏠' },
    { id: 'environment', name: 'Environment', emoji: '🔋' },
    { id: 'opinion', name: 'Opinion', emoji: '🎯' },
    { id: 'elections', name: 'Elections', emoji: '🗳️' },
    { id: 'local', name: 'Local', emoji: '🧵' },
    { id: 'interviews', name: 'Interviews', emoji: '🎙️' },
    { id: 'explainers', name: 'Explainers', emoji: '💡' },
    { id: 'events', name: 'Events', emoji: '📅' }
  ];
  res.json(categories);
});

// Create a new article
router.post('/', async (req, res) => {
  try {
    const { title, originalSource, summary, explanation, tags, category, coverImage } = req.body;
    
    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });
    
    const article = new Article({
      title,
      slug,
      originalSource,
      summary,
      explanation,
      tags,
      category,
      coverImage,
      author: req.user.userId
    });

    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
});

// Get all published articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

// Get article by slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name email');
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
});

// Update article
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    const updates = req.body;
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('author', 'name email');

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
});

// Publish article
router.patch('/:id/publish', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to publish this article' });
    }

    article.published = true;
    article.publishedAt = new Date();

    await article.save();
    res.json({ message: 'Article published successfully', article });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing article', error: error.message });
  }
});

// Unpublish article
router.patch('/:id/unpublish', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to unpublish this article' });
    }

    article.published = false;
    article.publishedAt = null;

    await article.save();
    res.json({ message: 'Article unpublished successfully', article });
  } catch (error) {
    res.status(500).json({ message: 'Error unpublishing article', error: error.message });
  }
});

// Delete article (private route - only author or admin can access)
router.delete('/:id/delete', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
});

module.exports = router; 