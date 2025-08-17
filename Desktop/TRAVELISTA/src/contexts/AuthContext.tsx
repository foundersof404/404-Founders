import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification
} from '@/firebase-config';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  token: string;
  birthday?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signupWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  signupWithEmail: (userData: { email: string; password: string; name: string; phone: string; birthday: string }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (profileData: { name?: string; email?: string; phone?: string; birthday?: string; location?: string }) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      api.get('/auth/verify')
        .then(response => {
          if (response.data.status === 'success') {
            setUser({ ...response.data.user, token });
          } else {
            throw new Error('Invalid token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      const response = await api.post('/auth/login', { email, password });

      if (response.data.status === 'success') {
        console.log('Login response:', response.data);
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture || null,
          token: response.data.token,
          phone: response.data.phone || '',
          birthday: response.data.birthday || '',
          location: response.data.location || '',
        };
        
        localStorage.setItem('token', response.data.token);
        setUser(userData);
        
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        return;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // First authenticate with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Send the token to our backend
      const response = await api.post('/auth/google', { idToken });
      
      if (response.data.status === 'success') {
        console.log('Google auth response:', response.data);
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture || null,
          token: response.data.token,
          phone: response.data.phone || '',
          birthday: response.data.birthday || '',
          location: response.data.location || '',
        };
        
        localStorage.setItem('token', response.data.token);
        setUser(userData);
        
        toast({
          title: "Success",
          description: "Logged in with Google successfully",
        });
        
        return userData;
      }
      
      throw new Error(response.data.message || 'Google authentication failed');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate with Google",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local storage and state
      localStorage.removeItem('token');
      setUser(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signupWithEmail = async (userData: { email: string; password: string; name: string; phone: string; birthday: string }) => {
    try {
      // Send data to our backend
      console.log('AuthContext: Sending signup request to backend', userData);
      const response = await api.post('/auth/signup', userData);
      
      console.log('AuthContext: Signup response received', response.data);
      
      if (response.data.status === 'success') {
        console.log('AuthContext: Signup successful');
        
        // Store the email verification token in localStorage for testing/development purposes
        if (response.data.email_verify_token) {
          console.log('AuthContext: Storing verification token:', response.data.email_verify_token);
          localStorage.setItem('dev_email_verify_token', response.data.email_verify_token);
        }
        
        toast({
          title: "Success",
          description: response.data.message || "Account created successfully. Please check your email for verification.",
        });
        return;
      }
      
      throw new Error(response.data.message || 'Failed to create account');
    } catch (error: any) {
      console.error('AuthContext: Signup error', error);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to create account";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await firebaseSendEmailVerification(auth.currentUser);
        toast({
          title: "Success",
          description: "Verification email sent",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to send verification email",
          variant: "destructive",
        });
        throw error;
      }
    }
  };

  const signupWithGoogle = async () => {
    try {
      // This will be the same as signInWithGoogle as the backend will handle
      // creating a new user if one doesn't exist
      return await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account with Google",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (profileData: { name?: string; email?: string; phone?: string; birthday?: string; location?: string }) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.put('/user/profile', profileData);
      
      if (response.data.status === 'success') {
        setUser(prev => prev ? { ...prev, ...response.data.user } : null);
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        
        return;
      }
      
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const updateProfilePicture = async (file: File) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.put('/user/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status === 'success') {
        setUser(prev => prev ? { ...prev, profilePicture: response.data.profilePicture } : null);
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
        
        return;
      }
      
      throw new Error(response.data.message || 'Failed to update profile picture');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile picture";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      signInWithGoogle,
      signupWithGoogle, 
      signOut,
      signupWithEmail,
      sendVerificationEmail,
      updateUserProfile,
      updateProfilePicture
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
