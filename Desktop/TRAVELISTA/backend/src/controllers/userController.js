const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // User is already attached from auth middleware
    const user = req.user;

    res.status(200).json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        location: user.location,
        profilePicture: user.profile_picture,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch user profile',
      error: error.message 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, birthday, location } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!userId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User ID is required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== existingUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is already in use'
        });
      }
    }

    // Update user data
    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (phone) userData.phone = phone;
    if (birthday) userData.birthday = birthday;
    if (location !== undefined) userData.location = location;

    // If no data to update
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No data provided for update'
      });
    }

    console.log('Updating profile with data:', userData);

    // Update user in database
    const updatedUser = await User.update(userId, userData);

    // Format profile picture URL
    const profilePicture = updatedUser.profile_picture ? 
      (updatedUser.profile_picture.startsWith('http') ? 
        updatedUser.profile_picture : 
        `${process.env.API_URL || 'http://localhost:5000'}${updatedUser.profile_picture}`) 
      : null;

    console.log('Profile updated successfully for user:', updatedUser.email);
    console.log('Profile data after update:', {
      location: updatedUser.location || null,
      profilePicture: profilePicture
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthday: updatedUser.birthday,
        location: updatedUser.location || null,
        profilePicture: profilePicture,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update user profile',
      error: error.message 
    });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded' 
      });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      // Remove uploaded file if user doesn't exist
      fs.unlinkSync(req.file.path);
      
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Delete old profile picture if exists
    if (existingUser.profile_picture) {
      try {
        const oldPicturePath = path.join(__dirname, '../../uploads', path.basename(existingUser.profile_picture));
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      } catch (deleteError) {
        console.error('Error deleting old profile picture:', deleteError);
        // Continue with update even if old file deletion fails
      }
    }

    // Generate profile picture URL
    const profilePictureRelative = `/uploads/${req.file.filename}`;
    
    // Update user in database
    const updatedUser = await User.update(userId, { profile_picture: profilePictureRelative });

    // Format full URL for response
    const profilePictureUrl = `${process.env.API_URL || 'http://localhost:5000'}${profilePictureRelative}`;
    
    console.log('Profile picture updated successfully for user:', updatedUser.email);
    console.log('New profile picture URL:', profilePictureUrl);

    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully',
      profilePicture: profilePictureUrl
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    
    // Remove uploaded file in case of error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error removing uploaded file after error:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update profile picture',
      error: error.message 
    });
  }
}; 