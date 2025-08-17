import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Loader2, Mail, Lock, User, Phone, Calendar, Globe, RefreshCw, Plane, MapPin, Compass, Eye, EyeOff } from 'lucide-react';
import AuthBackground from '@/components/AuthBackground';
import PageTransition from '@/components/PageTransition';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signupWithEmail, signupWithGoogle, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Phone validation
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s]{10,15}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      errors.phone = 'Phone number is invalid';
    }
    
    // Birthday validation
    if (!formData.birthday) {
      errors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        errors.birthday = 'You must be at least 18 years old';
      }
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      
      console.log('Sending signup request with data:', userData);
      await signupWithEmail(userData);
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account before signing in",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await sendVerificationEmail();
              } catch (error) {
                console.error('Failed to send verification email:', error);
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend verification
          </Button>
        ),
      });
      navigate('/login');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = "Something went wrong";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response error:', error.response.data);
        errorMessage = error.response.data.message || "Server error";
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from server:', error.request);
        errorMessage = "No response from server. Please try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await signupWithGoogle();
      toast({
        title: "Success",
        description: "Account created with Google successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account with Google",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: 'None' };
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { strength, label: labels[strength - 1] || 'None' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <AuthBackground>
      <PageTransition>
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 text-3xl font-bold mb-2 text-gray-900">
                <Globe className="w-8 h-8 text-gray-900" /> 
                <span>Travelista</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Start Your Journey</h1>
              <p className="text-gray-600 mt-2">Create your account and explore the world</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-input-wrapper">
                <Label htmlFor="name" className="form-label text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`form-input pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="email" className="form-label text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-input pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="phone" className="form-label text-gray-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`form-input pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="birthday" className="form-label text-gray-700">Birthday</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    className={`form-input pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.birthday ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {formErrors.birthday && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.birthday}</p>
                )}
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="password" className="form-label text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-input pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Password Strength: {passwordStrength.label}</span>
                    <span className="text-gray-900">{passwordStrength.strength}/5</span>
                  </div>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 0
                          ? 'bg-gray-300'
                          : passwordStrength.strength === 1
                          ? 'bg-red-500'
                          : passwordStrength.strength === 2
                          ? 'bg-orange-500'
                          : passwordStrength.strength === 3
                          ? 'bg-yellow-500'
                          : passwordStrength.strength === 4
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="confirmPassword" className="form-label text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-input pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={handleGoogleSignup}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-900 font-medium hover:text-gray-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-gray-500">
              <div className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                <span className="text-sm">Worldwide Travel</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Best Destinations</span>
              </div>
              <div className="flex items-center gap-1">
                <Compass className="w-4 h-4" />
                <span className="text-sm">Guided Tours</span>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AuthBackground>
  );
};

export default Signup;
