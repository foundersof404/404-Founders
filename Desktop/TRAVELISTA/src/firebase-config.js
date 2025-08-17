// firebase-config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized before
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

// Google sign-in function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Capture Google user data
    const userData = {
      name: user.displayName,
      email: user.email,
      profilePicture: user.photoURL,
      location: '', // You can use a library like 'geolocation' to fetch location if needed
      phone: '', // Google doesn't provide phone number by default
      birthday: '', // Google doesn't provide birthday info, so it needs to be added manually
      emailVerified: user.emailVerified,
    };
    
    return userData;
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error(error.message);
  }
};

// Email signup function
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send verification email
    await sendEmailVerification(user);
    
    return user;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message);
  }
};

// Email verification function
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(error.message);
  }
};

// Email sign-in function
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Signin error:', error);
    throw new Error(error.message);
  }
};

// Export everything needed
export { 
  auth, 
  storage, 
  db, 
  googleProvider,
  signInWithPopup,
  sendEmailVerification,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};
