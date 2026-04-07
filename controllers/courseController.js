const Course = require('../models/Course');
const Center = require('../models/Center');
const Category = require('../models/Category');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../config/cloudinary');

// Helper function to delete old image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
};

// @desc    Create new course
// @route   POST /api/admin/course
// @access  Private (Super Admin, Center Admin)
exports.createCourse = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      center,
      category,
      description,
      startDate,
      duration,
      onlineFees,
      offlineFees,
      modes,
      keyHighlights,
      whyChoose,
      howItHelps
    } = req.body;

    // Validate required fields
    if (!title || !center || !category) {
      return res.status(400).json({ 
        message: 'Required fields missing: title, center, and category are required' 
      });
    }

    // Parse startDate if provided (handle various date formats)
    let parsedStartDate = null;
    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ 
          message: 'Invalid date format for startDate. Use YYYY-MM-DD format (e.g., 2026-03-27)' 
        });
      }
    }

    // Validate center exists
    const centerDoc = await Center.findById(center);
    
    if (!centerDoc) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Role-based access check with center admin validation
    if (user.role === 'center_admin') {
      // Check if user is actually the admin of this center
      if (!centerDoc.centerAdmin || !centerDoc.centerAdmin.equals(user._id)) {
        return res.status(403).json({ 
          message: 'Access denied. You are not the admin of this center.' 
        });
      }
    }

    // Validate banner image
    const files = req.files;
    
    if (!files || !files.banner) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    // Upload all files in PARALLEL for faster processing
    const uploadPromises = [];

    // Upload banner image (required)
    uploadPromises.push(
      uploadToCloudinary(files.banner[0], 'courses/banners')
        .then(result => ({ type: 'banner', result }))
    );

    // Upload highlight image (optional)
    if (files.highlight) {
      uploadPromises.push(
        uploadToCloudinary(files.highlight[0], 'courses/highlights')
          .then(result => ({ type: 'highlight', result }))
      );
    }

    // Upload section image (optional)
    if (files.section) {
      uploadPromises.push(
        uploadToCloudinary(files.section[0], 'courses/sections')
          .then(result => ({ type: 'section', result }))
      );
    }

    // Upload gallery images (optional)
    if (files.gallery) {
      files.gallery.forEach((file, index) => {
        uploadPromises.push(
          uploadToCloudinary(file, 'courses/gallery')
            .then(result => ({ type: 'gallery', index, result }))
        );
      });
    }

    // Upload promo video (optional)
    if (files.video) {
      uploadPromises.push(
        uploadToCloudinary(files.video[0], 'courses/videos')
          .then(result => ({ type: 'video', result }))
      );
    }

    // Upload brochure PDF (optional)
    if (files.brochure) {
      uploadPromises.push(
        uploadToCloudinary(files.brochure[0], 'courses/brochures', 'raw', 'pdf')
          .then(result => ({ type: 'brochure', result }))
      );
    }

    // Wait for all uploads to complete in parallel
    const uploadResults = await Promise.all(uploadPromises);

    // Process upload results
    let bannerImage = null;
    let highlightImage = null;
    let sectionImage = null;
    let galleryImages = [];
    let promoVideo = null;
    let brochure = null;

    for (const upload of uploadResults) {
      switch (upload.type) {
        case 'banner':
          bannerImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'highlight':
          highlightImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'section':
          sectionImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'gallery':
          galleryImages.push({ url: upload.result.url, public_id: upload.result.public_id });
          break;
        case 'video':
          promoVideo = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'brochure':
          brochure = { url: upload.result.url, public_id: upload.result.public_id };
          break;
      }
    }

    // Parse content sections with safe parsing
    let parsedKeyHighlights = {};
    if (req.body.keyHighlights) {
      try {
        parsedKeyHighlights = typeof req.body.keyHighlights === 'string' 
          ? JSON.parse(req.body.keyHighlights) 
          : req.body.keyHighlights;
      } catch (err) {
        console.error('❌ keyHighlights parse error:', err);
      }
    }

    let parsedWhyChoose = {};
    if (req.body.whyChoose) {
      try {
        parsedWhyChoose = typeof req.body.whyChoose === 'string' 
          ? JSON.parse(req.body.whyChoose) 
          : req.body.whyChoose;
      } catch (err) {
        console.error('❌ whyChoose parse error:', err);
      }
    }

    let parsedHowItHelps = {};
    if (req.body.howItHelps) {
      console.log('RAW howItHelps:', req.body.howItHelps);
      try {
        parsedHowItHelps = typeof req.body.howItHelps === 'string' 
          ? JSON.parse(req.body.howItHelps) 
          : req.body.howItHelps;
        console.log('PARSED howItHelps:', parsedHowItHelps);
      } catch (err) {
        console.error('❌ howItHelps parse error:', err);
      }
    }

    // Create course
    const course = await Course.create({
      title,
      center,
      category,
      description,
      startDate: parsedStartDate,
      duration,
      fees: {
        online: onlineFees,
        offline: offlineFees
      },
      modes: modes ? (typeof modes === 'string' ? JSON.parse(modes) : modes) : ['online', 'offline'],
      bannerImage: { url: bannerImage.url, public_id: bannerImage.public_id },
      highlightImage: highlightImage ? { url: highlightImage.url, public_id: highlightImage.public_id } : null,
      sectionImage: sectionImage ? { url: sectionImage.url, public_id: sectionImage.public_id } : null,
      galleryImages,
      promoVideo,
      brochure,
      keyHighlights: parsedKeyHighlights,
      whyChoose: parsedWhyChoose,
      howItHelps: parsedHowItHelps,
      createdBy: user._id
    });

    // Populate center and category before returning
    const populatedCourse = await Course.findById(course._id)
      .populate('center', 'name')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    });

  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ 
      message: 'Error creating course', 
      error: error.message 
    });
  }
};

// @desc    Get all courses (with filters)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { center, category, isActive, isFeatured, centerName, categoryName, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    
    // Support both ID-based and name-based filtering
    if (center) filter.center = center;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFeatured) filter.isFeatured = true;

    // Name-based filters (will query after getting IDs)
    let centerQuery = {};
    let categoryQuery = {};

    if (centerName) {
      const centers = await Center.find({ name: new RegExp(centerName, 'i') });
      if (centers.length > 0) {
        filter.center = { $in: centers.map(c => c._id) };
      } else {
        // No matching centers
        return res.json({
          success: true,
          count: 0,
          courses: [],
          message: `No courses found for center: ${centerName}`
        });
      }
    }

    if (categoryName) {
      const categories = await Category.find({ name: new RegExp(categoryName, 'i') });
      if (categories.length > 0) {
        filter.category = { $in: categories.map(c => c._id) };
      } else {
        // No matching categories
        return res.json({
          success: true,
          count: 0,
          courses: [],
          message: `No courses found for category: ${categoryName}`
        });
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(filter)
      .populate('center', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      courses
    });

  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ 
      message: 'Error fetching courses', 
      error: error.message 
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('center', 'name')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching course', 
      error: error.message 
    });
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('center', 'name')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching course', 
      error: error.message 
    });
  }
};

// @desc    Update course
// @route   PUT /api/admin/course/:id
// @access  Private (Super Admin, Center Admin)
exports.updateCourse = async (req, res) => {
  try {
    const user = req.user;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check access with proper center admin validation
    if (user.role === 'center_admin') {
      const centerDoc = await Center.findById(course.center);
      
      if (!centerDoc || !centerDoc.centerAdmin || !centerDoc.centerAdmin.equals(user._id)) {
        return res.status(403).json({ 
          message: 'Access denied. You can only edit courses for your center.' 
        });
      }
    }

    // Update fields
    const updates = req.body;
    
    // Handle file uploads (if any new files) and delete old ones
    if (req.files) {
      const files = req.files;
      
      // First, delete all old files in parallel
      const deletePromises = [];
      
      if (files.banner) {
        deletePromises.push(deleteFromCloudinary(course.bannerImage?.public_id));
      }
      if (files.highlight) {
        deletePromises.push(deleteFromCloudinary(course.highlightImage?.public_id));
      }
      if (files.section) {
        deletePromises.push(deleteFromCloudinary(course.sectionImage?.public_id));
      }
      if (files.gallery && course.galleryImages && course.galleryImages.length > 0) {
        course.galleryImages.forEach(img => {
          deletePromises.push(deleteFromCloudinary(img.public_id));
        });
      }
      if (files.video) {
        deletePromises.push(deleteFromCloudinary(course.promoVideo?.public_id));
      }
      if (files.brochure) {
        deletePromises.push(deleteFromCloudinary(course.brochure?.public_id));
      }
      
      // Delete old files in parallel
      await Promise.all(deletePromises);
      
      // Now upload new files in parallel
      const uploadPromises = [];
      
      if (files.banner) {
        uploadPromises.push(
          uploadToCloudinary(files.banner[0], 'courses/banners')
            .then(result => ({ type: 'banner', result }))
        );
      }
      
      if (files.highlight) {
        uploadPromises.push(
          uploadToCloudinary(files.highlight[0], 'courses/highlights')
            .then(result => ({ type: 'highlight', result }))
        );
      }
      
      if (files.section) {
        uploadPromises.push(
          uploadToCloudinary(files.section[0], 'courses/sections')
            .then(result => ({ type: 'section', result }))
        );
      }
      
      if (files.gallery) {
        files.gallery.forEach((file, index) => {
          uploadPromises.push(
            uploadToCloudinary(file, 'courses/gallery')
              .then(result => ({ type: 'gallery', index, result }))
          );
        });
      }
      
      if (files.video) {
        uploadPromises.push(
          uploadToCloudinary(files.video[0], 'courses/videos')
            .then(result => ({ type: 'video', result }))
        );
      }
      
      if (files.brochure) {
        uploadPromises.push(
          uploadToCloudinary(files.brochure[0], 'courses/brochures', 'raw', 'pdf')
            .then(result => ({ type: 'brochure', result }))
        );
      }
      
      // Wait for all uploads to complete in parallel
      const uploadResults = await Promise.all(uploadPromises);
      
      // Process upload results
      let newGalleryImages = [];
      
      for (const upload of uploadResults) {
        switch (upload.type) {
          case 'banner':
            updates.bannerImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'highlight':
            updates.highlightImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'section':
            updates.sectionImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'gallery':
            newGalleryImages.push({ url: upload.result.url, public_id: upload.result.public_id });
            break;
          case 'video':
            updates.promoVideo = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'brochure':
            updates.brochure = { url: upload.result.url, public_id: upload.result.public_id };
            break;
        }
      }
      
      // Set gallery images if any were uploaded
      if (newGalleryImages.length > 0) {
        updates.galleryImages = newGalleryImages;
      }
    }

    // Parse JSON strings for array fields with safe parsing
    if (updates.keyHighlights) {
      try {
        if (typeof updates.keyHighlights === 'string') {
          updates.keyHighlights = JSON.parse(updates.keyHighlights);
        }
      } catch (err) {
        console.error('❌ keyHighlights parse error:', err);
      }
    }
    if (updates.whyChoose) {
      try {
        if (typeof updates.whyChoose === 'string') {
          updates.whyChoose = JSON.parse(updates.whyChoose);
        }
      } catch (err) {
        console.error('❌ whyChoose parse error:', err);
      }
    }
    if (updates.howItHelps) {
      try {
        if (typeof updates.howItHelps === 'string') {
          updates.howItHelps = JSON.parse(updates.howItHelps);
        }
      } catch (err) {
        console.error('❌ howItHelps parse error:', err);
      }
    }
    if (updates.modes && typeof updates.modes === 'string') {
      updates.modes = JSON.parse(updates.modes);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('center', 'name')
     .populate('category', 'name');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ 
      message: 'Error updating course', 
      error: error.message 
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/admin/course/:id
// @access  Private (Super Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const user = req.user;
    
    // Only Super Admin can delete
    if (user.role !== 'super_admin') {
      return res.status(403).json({ 
        message: 'Access denied. Only Super Admin can delete courses.' 
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all associated images/videos from Cloudinary
    await deleteFromCloudinary(course.bannerImage?.public_id);
    await deleteFromCloudinary(course.highlightImage?.public_id);
    await deleteFromCloudinary(course.sectionImage?.public_id);
    
    if (course.galleryImages && course.galleryImages.length > 0) {
      for (let img of course.galleryImages) {
        await deleteFromCloudinary(img.public_id);
      }
    }
    
    await deleteFromCloudinary(course.promoVideo?.public_id);
    await deleteFromCloudinary(course.brochure?.public_id);

    // Delete course from database
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting course', 
      error: error.message 
    });
  }
};
