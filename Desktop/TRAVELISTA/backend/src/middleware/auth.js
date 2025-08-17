const { verifyToken, extractToken } = require('../utils/jwt');
const User = require('../models/User');
const firebaseService = require('../services/firebase');

// Middleware to authenticate JWT tokens
async function authenticate(req, res, next) {
  try {
    // Extract token from request
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No authorization token provided' });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }

    // Find user in database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ status: 'error', message: 'Email not verified' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ status: 'error', message: 'Authentication failed' });
  }
}

// Middleware to verify Firebase token
async function verifyFirebaseToken(req, res, next) {
  try {
    // Extract token from request
    const firebaseToken = req.headers.firebase_token;
    
    if (!firebaseToken) {
      return res.status(401).json({ status: 'error', message: 'No Firebase token provided' });
    }

    // Verify Firebase token
    const decodedToken = await firebaseService.verifyIdToken(firebaseToken);
    
    if (!decodedToken) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired Firebase token' });
    }

    // Find user in database by Firebase UID
    const user = await User.findByFirebaseUid(decodedToken.uid);
    
    // If user doesn't exist in our database yet, we'll handle creation in the controller
    if (!user) {
      // Attach decoded token to request for user creation in controller
      req.firebaseUser = decodedToken;
      return next();
    }

    // Attach user to request object
    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase authentication error:', error);
    res.status(500).json({ status: 'error', message: 'Firebase authentication failed' });
  }
}

module.exports = {
  authenticate,
  verifyFirebaseToken
}; 