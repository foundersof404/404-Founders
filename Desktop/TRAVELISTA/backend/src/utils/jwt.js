const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'travel_agency_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

// Extract token from request
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  return null;
}

module.exports = {
  generateToken,
  verifyToken,
  extractToken
}; 