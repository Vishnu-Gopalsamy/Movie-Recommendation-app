import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    genres: [String],
    language: {
      type: String,
      default: 'English'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;