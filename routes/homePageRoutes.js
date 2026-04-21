const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  saveHomePage,
  getHomePage
} = require('../controllers/homePageController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public route
router.get('/', getHomePage);

// Protected route (Super Admin only) - accepts multipart/form-data
// Use upload.any() to accept all fields, then filter in controller
router.post(
  '/',
  protect,
  allowRoles('super_admin'),
  upload.any(),
  saveHomePage
);

module.exports = router;
