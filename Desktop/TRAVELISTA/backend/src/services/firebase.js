const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
let firebaseAdmin;
try {
  // Extract the private key from environment variable
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined;

  // Project credentials
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'project-id';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'client@email.com';

  console.log('Firebase Project ID:', projectId);
  console.log('Firebase Client Email:', clientEmail);
  console.log('Firebase Private Key available:', privateKey ? true : false);

  // Initialize the app
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

// Verify a Firebase ID token
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase ID token verification error:', error);
    return null;
  }
}

// Create a custom Firebase auth user
async function createFirebaseUser(email, password, displayName) {
  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
    
    console.log('Successfully created Firebase user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating Firebase user:', error);
    throw error;
  }
}

// Generate email verification link
async function generateEmailVerificationLink(email) {
  try {
    const actionCodeSettings = {
      url: `${process.env.APP_URL}/verify-email-success`,
      handleCodeInApp: true,
    };
    
    const link = await firebaseAdmin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    console.log('Generated email verification link for', email);
    return link;
  } catch (error) {
    console.error('Error generating email verification link:', error);
    throw error;
  }
}

// Check if a user's email is verified
async function isEmailVerified(uid) {
  try {
    const userRecord = await firebaseAdmin.auth().getUser(uid);
    return userRecord.emailVerified;
  } catch (error) {
    console.error('Error checking email verification status:', error);
    return false;
  }
}

// Generate password reset link
async function generatePasswordResetLink(email) {
  try {
    const actionCodeSettings = {
      url: `${process.env.APP_URL}/reset-password`,
      handleCodeInApp: true,
    };
    
    const link = await firebaseAdmin.auth().generatePasswordResetLink(email, actionCodeSettings);
    console.log('Generated password reset link for', email);
    return link;
  } catch (error) {
    console.error('Error generating password reset link:', error);
    throw error;
  }
}

// Update a user's Firebase profile
async function updateUserProfile(uid, updateData) {
  try {
    await firebaseAdmin.auth().updateUser(uid, updateData);
    console.log('Successfully updated Firebase user profile:', uid);
    return true;
  } catch (error) {
    console.error('Error updating Firebase user profile:', error);
    return false;
  }
}

module.exports = {
  auth: firebaseAdmin ? firebaseAdmin.auth() : null,
  verifyIdToken,
  createFirebaseUser,
  generateEmailVerificationLink,
  isEmailVerified,
  generatePasswordResetLink,
  updateUserProfile
}; 