import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    required: false
  },
  otpExpiry: {
    type: Date,
    required: false
  },
  refreshToken: {
    type: String,
    required: false
  },
  refreshTokenExpiry: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;