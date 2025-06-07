const mongoose = require('mongoose');

const CATEGORIES = [
  'Politics',
  'World',
  'National',
  'Business',
  'Finance',
  'Education',
  'Technology',
  'Science',
  'Health',
  'Entertainment',
  'Gaming',
  'Art',
  'Law',
  'Lifestyle',
  'Food',
  'Travel',
  'Books',
  'Children',
  'Real Estate',
  'Environment',
  'Opinion',
  'Elections',
  'Local',
  'Interviews',
  'Explainers',
  'Events'
];

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  originalSource: { type: String }, // Optional link to the source if available
  summary: { type: String },        // Your brief summary
  explanation: { type: String },    // Your detailed explanation
  tags: [String],
  category: { 
    type: String, 
    enum: CATEGORIES,
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Making author optional
  },
  coverImage: String,
  published: { type: Boolean, default: false },
  publishedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
