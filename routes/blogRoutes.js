const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/blogCategoryController');
const {
  createArticle,
  getArticles,
  getRecentArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const blogUpload = require('../middleware/blogUpload');

// ==========================================
// CATEGORY ROUTES
// ==========================================

// Get all categories (Public)
router.get('/categories', getCategories);

// Get single category (Public)
router.get('/categories/:id', getCategoryById);

// Create category (Super Admin & Center Admin only)
router.post('/categories', protect, authorize('super_admin', 'admin'), createCategory);

// Update category (Super Admin & Center Admin only)
router.put('/categories/:id', protect, authorize('super_admin', 'admin'), updateCategory);

// Delete category - Soft delete (Super Admin & Center Admin only)
router.delete('/categories/:id', protect, authorize('super_admin', 'admin'), deleteCategory);

// ==========================================
// ARTICLE ROUTES
// ==========================================

// Get recent 6 articles (Public) - Must be before /:id route
router.get('/articles/recent', getRecentArticles);

// Get all articles with filters & pagination (Public)
router.get('/articles', getArticles);

// Get single article by ID or slug (Public)
router.get('/articles/:id', getArticleById);

// Create article (Super Admin & Center Admin only) - Form Data with file uploads
router.post('/articles', 
  protect, 
  authorize('super_admin', 'admin'), 
  blogUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  createArticle
);

// Update article (Super Admin & Center Admin only) - Form Data with file uploads
router.put('/articles/:id', 
  protect, 
  authorize('super_admin', 'admin'), 
  blogUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  updateArticle
);

// Delete article - Soft delete (Super Admin & Center Admin only)
router.delete('/articles/:id', protect, authorize('super_admin', 'admin'), deleteArticle);

module.exports = router;