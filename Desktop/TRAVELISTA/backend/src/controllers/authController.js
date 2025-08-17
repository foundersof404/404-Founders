const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const emailService = require('../services/email');
const firebaseService = require('../services/firebase');
const validator = require('validator');

// Handle user registration
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, birthday } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !birthday) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'All fields are required' 
      });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid email address' 
      });
    }

    // Check if password is strong enough
    if (password.length < 8) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      // Instead of error, return success with login token
      const token = generateToken({ id: existingUser.id, email: existingUser.email });
      return res.status(200).json({
        status: 'success',
        message: 'User already exists, logged in automatically',
        token,
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        email_verified: true,
        phone: existingUser.phone,
        birthday: existingUser.birthday,
        location: existingUser.location,
        profilePicture: existingUser.profile_picture,
      });
    }

    // Create Firebase user
    let firebaseUser;
    try {
      firebaseUser = await firebaseService.createFirebaseUser(email, password, name);
      console.log('Firebase user created successfully', firebaseUser.uid);
      
      // Set email as verified in Firebase
      if (firebaseUser && firebaseUser.uid) {
        await firebaseService.updateUserProfile(firebaseUser.uid, { emailVerified: true });
      }
    } catch (firebaseError) {
      console.error('Firebase user creation error:', firebaseError);
      
      // Just continue with local account creation for any firebase error
      console.log('Continuing with local account creation despite Firebase error');
    }

    // Create user in our database
    const userData = {
      name,
      email,
      password,
      phone,
      birthday,
      email_verified: true, // Set email as verified automatically
      firebase_uid: firebaseUser ? firebaseUser.uid : null
    };

    const newUser = await User.create(userData);

    // Create token for the new user
    const token = generateToken({ id: newUser.id, email: newUser.email });

    // No need to send verification email since we're auto-verifying

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      email_verified: true,
      phone: newUser.phone,
      birthday: newUser.birthday,
      firebase_uid: firebaseUser ? firebaseUser.uid : null
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to register user',
      error: error.message 
    });
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      });
    }

    // Always set email as verified
    if (!user.email_verified) {
      await User.update(user.id, { email_verified: true });
    }

    // Create JWT token
    const token = generateToken({ id: user.id, email: user.email });

    // Return user data and token with full profile URL for image
    const profilePicture = user.profile_picture ? 
      (user.profile_picture.startsWith('http') ? 
        user.profile_picture : 
        `${process.env.API_URL || 'http://localhost:5000'}${user.profile_picture}`) 
      : null;
    
    console.log('Login successful for:', email);
    console.log('Profile data:', {
      profilePicture: profilePicture,
      location: user.location || null
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified: true,
      phone: user.phone,
      birthday: user.birthday,
      location: user.location || null,
      profilePicture: profilePicture,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to login',
      error: error.message 
    });
  }
};

// Handle Google authentication
exports.googleAuth = async (req, res) => {
  try {
    // Verify Google token from the client
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'ID token is required' 
      });
    }

    // Verify token with Firebase
    const decodedToken = await firebaseService.verifyIdToken(idToken);
    
    if (!decodedToken) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid ID token' 
      });
    }

    // Extract user information from token
    const { uid, email, name, picture } = decodedToken;
    
    // Check if user exists in our database
    let user = await User.findByFirebaseUid(uid);
    
    if (!user) {
      // Create new user if not exists
      const userData = {
        firebase_uid: uid,
        name: name || email.split('@')[0],
        email,
        profile_picture: picture,
        email_verified: true, // Google accounts are already verified
      };

      user = await User.create(userData);
    }

    // Create JWT token
    const token = generateToken({ id: user.id, email: user.email });

    // Return user data and token
    res.status(200).json({
      status: 'success',
      message: 'Google authentication successful',
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      location: user.location,
      profilePicture: user.profile_picture,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to authenticate with Google',
      error: error.message 
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Verification token is required' 
      });
    }

    console.log('Verifying email with token:', token);

    // Verify email using token
    const user = await User.verifyEmail(token);

    if (!user) {
      throw new Error('Invalid verification token');
    }

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      email: user.email
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ 
      status: 'error', 
      message: 'Failed to verify email',
      error: error.message 
    });
  }
};

// Request password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email is required' 
      });
    }

    // Check if email exists
    const user = await User.findByEmail(email);
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({
        status: 'success',
        message: 'If the email exists, a password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = await User.generateResetToken(email);

    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to send password reset email',
      error: error.message 
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Token and new password are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Reset password using token
    await User.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ 
      status: 'error', 
      message: 'Failed to reset password',
      error: error.message 
    });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    // The authentication is handled by the middleware
    // If the request reaches here, the token is valid
    
    // Format profile picture URL
    const profilePicture = req.user.profile_picture ? 
      (req.user.profile_picture.startsWith('http') ? 
        req.user.profile_picture : 
        `${process.env.API_URL || 'http://localhost:5000'}${req.user.profile_picture}`) 
      : null;
    
    console.log('Token verification successful for:', req.user.email);
    console.log('Profile data:', {
      profilePicture: profilePicture,
      location: req.user.location || null
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        birthday: req.user.birthday,
        location: req.user.location || null,
        profilePicture: profilePicture,
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to verify token',
      error: error.message 
    });
  }
}; 