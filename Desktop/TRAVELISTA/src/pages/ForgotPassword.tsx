import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import AuthBackground from '@/components/AuthBackground';
import PageTransition from '@/components/PageTransition';
import { Loader2, Mail, Globe, Plane, MapPin, Compass, ArrowLeft } from 'lucide-react';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      if (response.data.status === 'success') {
        toast({
          title: "Reset email sent",
          description: "Please check your email to reset your password",
        });
        setEmail('');
      } else {
        throw new Error(response.data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Failed to send reset email",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-800">Reset Your Password</h1>
              <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-input-wrapper">
                <Label htmlFor="email" className="form-label text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input pl-10 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>

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

export default ForgotPassword; 