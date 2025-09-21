import express from 'express';
const router = express.Router();
import authController from '../../controllers/authController.js';
import validateFields from '../../middleware/validateFields.js';
import { authenticateToken } from '../../middleware/auth.js';

// Register
router.post('/register', validateFields(['username', 'email', 'password']), authController.register);

// Login
router.post('/login', validateFields(['email', 'password']), authController.login);

// Verify OTP
router.post('/verify-otp', validateFields(['email', 'otp']), authController.verifyOTP);

// Refresh token
router.post('/refresh', validateFields(['refreshToken']), authController.refreshToken);

// Verify token (requires authentication)
router.get('/verify-token', authenticateToken, authController.verifyToken);

// Logout (requires authentication)
router.post('/logout', authenticateToken, authController.logout);

// Create test account for demo
router.post('/create-test-account', authController.createTestAccount);

export default router;
