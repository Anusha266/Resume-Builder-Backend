const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();



router.route(process.env.SIGNUP_URL).post(authController.signup);
router.route(process.env.LOGIN_URL).post(authController.protect,authController.login);


module.exports = router;
