import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function getUserById(userId) {
  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, userData) {
  try {
    // Remove password from update data if it exists
    const { password, ...updateData } = userData;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function updateUserPreferences(userId, preferences) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}