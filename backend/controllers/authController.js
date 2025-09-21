// Auth Controller
// Handles registration, login, OTP verification
import authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Get user from authenticated request (set by middleware)
    const userId = req.user?.id;

    if (userId) {
      await authService.logout(userId);
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // Token is already verified by middleware, just return success
    res.status(200).json({ 
      valid: true, 
      user: req.user,
      message: 'Token is valid' 
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const createTestAccount = async (req, res) => {
  try {
    const result = await authService.createTestAccount();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  register,
  login,
  verifyOTP,
  refreshToken,
  logout,
  verifyToken,
  createTestAccount
};
