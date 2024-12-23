const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get(process.env.USER_PROFILE_URL, 
  authController.protect, // Middleware to check authentication
  userController.getUserProfile
);

module.exports = router;