import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import TravelistaLayout from '@/components/TravelistaLayout';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Camera,
  Clock,
  Heart,
  History,
  LogOut,
  Upload,
  Save,
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, signOut, updateUserProfile, updateProfilePicture } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
    location: user?.location || '',
  });
  
  const [securityInfo, setSecurityInfo] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false);
  const [isSecurityEditing, setIsSecurityEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        location: user.location || '',
      });
      
      setSecurityInfo({
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setProfilePicture(user.profilePicture);
    }
  }, [loading, isAuthenticated, navigate, user]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting profile data:', personalInfo);
    
    // Update user profile with form data
    updateUserProfile(personalInfo)
      .then(() => {
        console.log('Profile updated successfully');
        setIsPersonalInfoEditing(false);
        
        // Show success message
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
        toast({
          title: "Error",
          description: "Failed to update your profile",
          variant: "destructive",
        });
      });
  };

  const handleSecurityInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would verify the current password
    // and update the password in the backend
    toast({
      title: "Security information updated",
      description: "Your security information has been updated successfully",
    });
    
    setIsSecurityEditing(false);
    setSecurityInfo(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoadingImage(true);
    
    // Create a temporary URL for the selected image
    // This shows the image immediately while it uploads
    const imageUrl = URL.createObjectURL(file);
    setProfilePicture(imageUrl);
    
    // Upload the image to the server
    updateProfilePicture(file)
      .then(() => {
        console.log('Profile picture updated successfully');
        setIsLoadingImage(false);
      })
      .catch((error) => {
        console.error('Failed to update profile picture:', error);
        // Revert to previous profile picture on error
        setProfilePicture(user?.profilePicture);
        setIsLoadingImage(false);
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          variant: "destructive",
        });
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to detect location
  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get country from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=0&addressdetails=1`
          );
          
          const data = await response.json();
          
          if (data && data.address && data.address.country) {
            setPersonalInfo(prev => ({
              ...prev,
              location: data.address.country
            }));
            
            toast({
              title: "Location Detected",
              description: `Your location has been set to ${data.address.country}`,
            });
          } else {
            throw new Error('Could not determine country');
          }
        } catch (error) {
          console.error('Error getting location:', error);
          toast({
            title: "Error",
            description: "Failed to detect your location",
            variant: "destructive",
          });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Error",
          description: "Failed to detect your location. Please check your location permissions.",
          variant: "destructive",
        });
        setIsDetectingLocation(false);
      }
    );
  };

  if (loading) {
    return (
      <TravelistaLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-12 w-48 mb-6" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
            </div>
          </div>
        </div>
      </TravelistaLayout>
    );
  }

  return (
    <TravelistaLayout>
      <style jsx>{`
        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
          color: #4b5563;
        }
        
        .profile-menu-item:hover {
          background-color: #f3f4f6;
        }
        
        .profile-menu-item.active {
          background-color: rgb(59, 121, 201, 0.1);
          color: rgb(59, 121, 201);
          font-weight: 500;
        }
        
        .form-input-wrapper {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          line-height: 1.5;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <div className="rounded-lg bg-white border border-gray-200 p-5 sticky top-24 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <div 
                    className={`w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-50 flex items-center justify-center ${isLoadingImage ? 'animate-pulse' : ''}`}
                  >
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt={user?.name || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
                    aria-label="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-800">{user?.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-700 mb-4">
                  {user?.location ? (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-gray-700" />
                      <span>{user.location}</span>
                    </>
                  ) : user?.birthday ? (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-gray-700" />
                      <span>{new Date(user.birthday).toLocaleDateString()}</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-gray-700" />
                      <span>{user?.email}</span>
                    </>
                  )}
                </div>
                <div className="w-full border-t border-gray-200 pt-4 mt-2">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('personal')}
                      className={`profile-menu-item w-full text-left ${activeTab === 'personal' ? 'active' : ''}`}
                    >
                      <User className="w-4 h-4" />
                      <span>Personal Information</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('booking')}
                      className={`profile-menu-item w-full text-left ${activeTab === 'booking' ? 'active' : ''}`}
                    >
                      <History className="w-4 h-4" />
                      <span>Booking History</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`profile-menu-item w-full text-left ${activeTab === 'wishlist' ? 'active' : ''}`}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`profile-menu-item w-full text-left ${activeTab === 'security' ? 'active' : ''}`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Security</span>
                    </button>
                    <button
                      onClick={signOut}
                      className="profile-menu-item w-full text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    {!isPersonalInfoEditing ? (
                      <Button 
                        onClick={() => setIsPersonalInfoEditing(true)} 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsPersonalInfoEditing(false)} 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 border-gray-400 text-gray-500 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </Button>
                    )}
                  </div>
                  
                  <form onSubmit={handlePersonalInfoSubmit}>
                    <div className="space-y-4">
                      <div className="form-input-wrapper">
                        <Label htmlFor="name" className="form-label">Name</Label>
                        {isPersonalInfoEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={personalInfo.name}
                            onChange={handlePersonalInfoChange}
                            className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Your full name"
                          />
                        ) : (
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">{personalInfo.name}</div>
                        )}
                      </div>
                      
                      <div className="form-input-wrapper">
                        <Label htmlFor="email" className="form-label">Email</Label>
                        {isPersonalInfoEditing ? (
                          <Input
                            id="email"
                            name="email"
                            value={personalInfo.email}
                            onChange={handlePersonalInfoChange}
                            className="form-input border-gray-300"
                            placeholder="Your email address"
                            disabled
                          />
                        ) : (
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">{personalInfo.email}</div>
                        )}
                      </div>
                      
                      <div className="form-input-wrapper">
                        <Label htmlFor="phone" className="form-label">Phone</Label>
                        {isPersonalInfoEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handlePersonalInfoChange}
                            className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Your phone number"
                          />
                        ) : (
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">{personalInfo.phone}</div>
                        )}
                      </div>
                      
                      <div className="form-input-wrapper">
                        <Label htmlFor="birthday" className="form-label">Date of Birth</Label>
                        {isPersonalInfoEditing ? (
                          <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            value={personalInfo.birthday}
                            onChange={handlePersonalInfoChange}
                            className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">
                            {personalInfo.birthday ? new Date(personalInfo.birthday).toLocaleDateString() : 'Not specified'}
                          </div>
                        )}
                      </div>
                      
                      <div className="form-input-wrapper">
                        <Label htmlFor="location" className="form-label">Location</Label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={detectLocation}
                            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                            disabled={isDetectingLocation}
                          >
                            {isDetectingLocation ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Detecting...
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4" />
                                Detect Location
                              </>
                            )}
                          </button>
                        </div>
                        {isPersonalInfoEditing ? (
                          <Input
                            id="location"
                            name="location"
                            value={personalInfo.location}
                            onChange={handlePersonalInfoChange}
                            className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Your location"
                          />
                        ) : (
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">{personalInfo.location || 'Not specified'}</div>
                        )}
                      </div>
                      
                      {isPersonalInfoEditing && (
                        <Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Booking History */}
              {activeTab === 'booking' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Booking History</h2>
                  <div className="p-8 text-center text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium mb-2 text-gray-800">No bookings yet</h3>
                    <p className="mb-4">You haven't made any bookings with us yet.</p>
                    <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                      <a href="/destinations">Explore Destinations</a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {activeTab === 'wishlist' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Wishlist</h2>
                  <div className="p-8 text-center text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Your wishlist is empty</h3>
                    <p className="mb-4">Save your favorite destinations to plan your next adventure.</p>
                    <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                      <a href="/destinations">Explore Destinations</a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                    {!isSecurityEditing ? (
                      <Button 
                        onClick={() => setIsSecurityEditing(true)} 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsSecurityEditing(false)} 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 border-gray-400 text-gray-500 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </Button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSecurityInfoSubmit}>
                    <div className="space-y-4">
                      <div className="form-input-wrapper">
                        <Label htmlFor="securityEmail" className="form-label">Email</Label>
                        <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">{securityInfo.email}</div>
                        <p className="text-xs text-gray-600 mt-1">Your email cannot be changed.</p>
                      </div>
                      
                      {isSecurityEditing && (
                        <>
                          <div className="form-input-wrapper">
                            <Label htmlFor="currentPassword" className="form-label">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={securityInfo.currentPassword}
                              onChange={handleSecurityInfoChange}
                              className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter current password"
                              required
                            />
                          </div>
                          
                          <div className="form-input-wrapper">
                            <Label htmlFor="newPassword" className="form-label">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={securityInfo.newPassword}
                              onChange={handleSecurityInfoChange}
                              className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter new password"
                              required
                            />
                          </div>
                          
                          <div className="form-input-wrapper">
                            <Label htmlFor="confirmPassword" className="form-label">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={securityInfo.confirmPassword}
                              onChange={handleSecurityInfoChange}
                              className="form-input border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Confirm new password"
                              required
                            />
                          </div>
                          
                          <Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Update Password
                          </Button>
                        </>
                      )}
                      
                      {!isSecurityEditing && (
                        <div className="form-input-wrapper">
                          <Label htmlFor="password" className="form-label">Password</Label>
                          <div className="form-input bg-gray-50 text-gray-800 border border-gray-200 rounded-md">••••••••</div>
                        </div>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TravelistaLayout>
  );
};

export default ProfilePage;
