// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/parents', categoryController.getParentCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:parentId/children', categoryController.getChildrenCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes (temporarily disabled auth for testing)
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
