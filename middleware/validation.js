const Joi = require('joi');

// Validation schemas
const validations = {
  // Super Admin Login
  superAdminLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // Regular Login (Center Admin & Employee)
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // Send OTP
  sendOtp: Joi.object({
    mobile: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .messages({ 'string.pattern.base': 'Invalid Indian mobile number' }),
    email: Joi.string().email(),
  }).or('mobile', 'email').messages({
    'object.missing': 'Either mobile or email is required'
  }),

  // Verify OTP
  verifyOtp: Joi.object({
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/),
    email: Joi.string().email(),
    otp: Joi.string().length(6).pattern(/^\d{6}$/).required()
      .messages({ 
        'string.length': 'OTP must be 6 digits',
        'string.pattern.base': 'OTP must contain only numbers'
      })
  }).or('mobile', 'email').messages({
    'object.missing': 'Either mobile or email is required'
  }),

  // Student Signup
  studentSignup: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/)
      .messages({ 'string.pattern.base': 'Invalid Indian mobile number' }),
    email: Joi.string().email(),
    parentName: Joi.string().min(2).max(100).required(),
    parentMobile: Joi.string().pattern(/^[6-9]\d{9}$/).required()
      .messages({ 'string.pattern.base': 'Invalid Indian mobile number' }),
    parentEmail: Joi.string().email()
  }).or('mobile', 'email').messages({
    'object.missing': 'Either mobile or email is required'
  }),

  // Parent Login Request (Improved)
  parentLoginRequest: Joi.object({
    studentMobile: Joi.string().pattern(/^[6-9]\d{9}$/).required()
      .messages({ 'string.pattern.base': 'Invalid student mobile number' }),
    parentMobile: Joi.string().pattern(/^[6-9]\d{9}$/).required()
      .messages({ 'string.pattern.base': 'Invalid parent mobile number' })
  }),

  // Create Center Admin
  createCenterAdmin: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
      .messages({ 'string.min': 'Password must be at least 8 characters' }),
    location: Joi.string().valid('Hyderabad', 'New Delhi', 'Pune').required()
  }),

  // Create Employee
  createEmployee: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
      .messages({ 'string.min': 'Password must be at least 8 characters' }),
    permissions: Joi.array().items(Joi.string()),
    center: Joi.string().valid('Hyderabad', 'New Delhi', 'Pune')
  }),

  // Update User Status
  updateUserStatus: Joi.object({
    isActive: Joi.boolean().required()
  }),

  // Update Profile
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/)
      .messages({ 'string.pattern.base': 'Invalid Indian mobile number' })
  }).min(1),

  // Change Password
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
      .messages({ 'string.min': 'New password must be at least 8 characters' })
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: details
      });
    }

    // Replace req.body with validated/sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validations,
  validate
};
