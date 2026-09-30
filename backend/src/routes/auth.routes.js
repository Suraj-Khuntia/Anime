const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyAdmin, verifyUserToken } = require('../middleware/auth.middleware');

// Admin Auth Routes
router.post('/login', authController.login);
router.get('/me', verifyAdmin, authController.getMe);
router.put('/password', verifyAdmin, authController.updatePassword);

// Regular User Auth Routes
router.post('/register', authController.register);
router.post('/user-login', authController.userLogin);
router.post('/user/register', authController.register);
router.post('/user/login', authController.userLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/user/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/user/reset-password', authController.resetPassword);
router.get('/user/me', verifyUserToken, authController.getUserMe);
router.put('/user/profile', verifyUserToken, authController.updateUserProfile);
router.put('/user/password', verifyUserToken, authController.changeUserPassword);

module.exports = router;
