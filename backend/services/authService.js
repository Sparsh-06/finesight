// Auth Service
// Handles user authentication with MongoDB and JWT tokens
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import emailService from './emailService.js';

function generateOTP() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

// Generate access token (short-lived)
function generateAccessToken(user) {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      type: 'access'
    },
    process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '50m' }
  );
}

// Generate refresh token (long-lived)
function generateRefreshToken(user) {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

export const register = async (username, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = new User({
    email: email.toLowerCase(),
    password: hashedPassword,
    name: username,
    isVerified: false
  });

  await user.save();

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send verification email
  try {
    await emailService.sendOTP(email, otp);
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail registration if email fails, but log it
  }

  return {
    message: 'User registered successfully. Please check your email for verification code.',
    userId: user._id
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in database
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = refreshTokenExpiry;
  await user.save();

  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    }
  };
};

export const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    throw new Error('User already verified');
  }

  if (!user.otp || user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP expired');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: 'Email verified successfully' };
};

// Refresh access token using refresh token
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    );

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Check if refresh token is expired
    if (user.refreshTokenExpiry < new Date()) {
      throw new Error('Refresh token expired');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    return {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Verify access token (for middleware)
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_ACCESS_SECRET || 'your-access-secret-key'
    );
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Logout - invalidate refresh token
export const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = undefined;
    user.refreshTokenExpiry = undefined;
    await user.save();
  }
  return { message: 'Logged out successfully' };
};

// Create test account for demo purposes
export const createTestAccount = async () => {
  const testEmail = 'demo@finesight.com';
  const testPassword = 'demo123';
  const testUsername = 'Demo User';

  try {
    // Check if test account already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      // If exists, just return the login credentials
      return {
        message: 'Test account already exists',
        credentials: {
          email: testEmail,
          password: testPassword,
          username: testUsername
        }
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create test user with verified status
    const testUser = new User({
      email: testEmail,
      password: hashedPassword,
      name: testUsername,
      isVerified: true // Pre-verified for demo
    });

    await testUser.save();

    return {
      message: 'Test account created successfully',
      credentials: {
        email: testEmail,
        password: testPassword,
        username: testUsername
      }
    };
  } catch (error) {
    console.error('Error creating test account:', error);
    throw new Error('Failed to create test account');
  }
};

export default {
  register,
  login,
  verifyOTP,
  refreshAccessToken,
  verifyAccessToken,
  logout,
  createTestAccount
};
