import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser(userData) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with that email');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      passwordHash,
      bio: userData.bio || '',
      avatar: userData.avatar || '/default-avatar.png'
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        avatar: newUser.avatar,
        preferences: newUser.preferences
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        preferences: user.preferences
      }
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function verifyToken(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      preferences: user.preferences
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}