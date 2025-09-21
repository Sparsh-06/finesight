// JWT Authentication Middleware
import { verifyAccessToken } from '../services/authService.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user info
    next();
  }
};