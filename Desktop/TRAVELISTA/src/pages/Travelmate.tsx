import React, { useState, useRef, useEffect } from 'react';
import TravelistaLayout from '@/components/TravelistaLayout';
import { Button } from '@/components/ui/button';
import { Send, X, Shield, AlertTriangle, Plus, Users, Heart, Globe, Sparkles, Languages, Star, MapPin, Upload, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import travelmateService from '@/services/travelmateService';
import { toast } from 'react-hot-toast';
import { Spinner } from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

// Add calculateAge function
const calculateAge = (birthday: string): string => {
  if (!birthday) return '';
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

interface TravelmateProfile {
  id: string;
  name: string;
  age: number;
  destinations: string[];
  dates: string;
  hobbies: string[];
  bio: string;
  verified?: boolean;
  travelStyle?: string[];
  languages?: string[];
  compatibilityScore?: number;
  profileImage?: string;
  phone?: string;
}

const demoProfiles: TravelmateProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    destinations: ['Japan', 'Thailand'],
    dates: '2024-07-10 to 2024-07-25',
    hobbies: ['Photography', 'Hiking', 'Food', 'Culture'],
    bio: 'Adventure seeker and photography enthusiast. Looking for travel buddies to explore Asia!',
    verified: true,
    travelStyle: ['Adventure', 'Cultural'],
    languages: ['English', 'Japanese'],
    compatibilityScore: 92,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    destinations: ['Australia', 'New Zealand'],
    dates: '2024-08-15 to 2024-09-15',
    hobbies: ['Surfing', 'Camping', 'Nature', 'Adventure'],
    bio: 'Passionate about outdoor activities and meeting new people. Let\'s explore the land down under!',
    verified: true,
    travelStyle: ['Adventure', 'Nature'],
    languages: ['English', 'Mandarin'],
    compatibilityScore: 88,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    phone: '+1987654321'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 25,
    destinations: ['Spain', 'Portugal'],
    dates: '2024-09-01 to 2024-09-20',
    hobbies: ['Art', 'History', 'Food', 'Photography'],
    bio: 'Art lover and foodie. Looking for someone to share the Iberian experience with!',
    verified: true,
    travelStyle: ['Cultural', 'Food'],
    languages: ['English', 'Spanish'],
    compatibilityScore: 85,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    phone: '+1122334455'
  }
];

const allHobbies = Array.from(new Set(demoProfiles.flatMap(p => p.hobbies)));

// Simulate current user (in real app, get from auth)
const currentUser: TravelmateProfile = {
  id: 'me',
  name: 'You',
  age: 30,
  destinations: ['Japan', 'Australia', 'Thailand'],
  dates: 'Flexible',
  hobbies: ['Hiking', 'Beach', 'Food', 'Photography', 'Music', 'Art', 'Nature', 'Travel'],
  bio: 'Excited to meet new travel friends!',
  verified: true,
  travelStyle: ['Mid-range', 'Adventure', 'Cultural', 'Photography'],
  languages: ['English', 'Spanish basics', 'Learning Japanese'],
  profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
};

// Add this style block at the top of the file, after imports, for custom animation
const heroAnimation = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) both;
}
`;

// Add default avatars
const DEFAULT_AVATARS = {
  male: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  other: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
};

const Travelmate = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<TravelmateProfile[]>(demoProfiles);
  const [filterDestination, setFilterDestination] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');
  const [accepted, setAccepted] = useState<{ [id: string]: boolean }>({});
  const [matches, setMatches] = useState<{ [id: string]: boolean }>({});
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [userToReport, setUserToReport] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hobbyInputRef = useRef<HTMLInputElement>(null);
  
  // Create profile state
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [newProfile, setNewProfile] = useState<{
    name: string;
    age: string;
    gender: string;
    destinations: string;
    dates: string;
    bio: string;
    hobbies: string[];
    travelStyle: string[];
    languages: string[];
    profileImage: string;
    phone: string;
  }>({
    name: '',
    age: '',
    gender: '',
    destinations: '',
    bio: '',
    dates: '',
    hobbies: [],
    travelStyle: [],
    languages: [],
    profileImage: DEFAULT_AVATARS.other,
    phone: '',
  });
  const [newProfileHobbyInput, setNewProfileHobbyInput] = useState('');
  const [newProfileLanguageInput, setNewProfileLanguageInput] = useState('');
  
  // Profile loading and checking states
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [myProfile, setMyProfile] = useState<TravelmateProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/travelmate' } });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Check if user has a profile
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const { hasProfile: profileExists, profile } = await travelmateService.checkProfileStatus();
        setHasProfile(profileExists);
        
        if (profileExists) {
          await fetchMyCompleteProfile();
        } else {
          // Set initial values from user profile
          setNewProfile(prev => ({
            ...prev,
            name: user?.name || '',
            phone: user?.phone || '',
            age: user?.birthday ? calculateAge(user.birthday) : '',
            profileImage: user?.profilePicture || prev.profileImage
          }));
          setCreateProfileOpen(true);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        toast.error('Failed to check profile status');
      } finally {
        setLoading(false);
      }
    };
    
    checkProfileStatus();
  }, [isAuthenticated, user]);
  
  // Fetch the complete profile with all related data
  const fetchMyCompleteProfile = async () => {
    try {
      const profileData = await travelmateService.getMyProfile();
      
      // Convert to our UI format
      const uiProfile: TravelmateProfile = {
        id: 'me',
        name: profileData.name,
        age: profileData.age,
        destinations: profileData.destinations || [],
        dates: profileData.dates || 'Flexible',
        hobbies: profileData.hobbies || [],
        bio: profileData.bio || '',
        verified: true,
        travelStyle: profileData.travelStyles || [],
        languages: profileData.languages || [],
        profileImage: profileData.profile_picture
      };
      
      setMyProfile(uiProfile);
      
      // Load potential matches
      fetchMatches();
    } catch (error) {
      console.error('Error fetching complete profile:', error);
      toast.error('Failed to load your profile');
    }
  };
  
  // Fetch potential matches from the backend
  const fetchMatches = async () => {
    try {
      const matches = await travelmateService.getMatches();
      
      // Convert server matches to our UI format
      const uiMatches = matches.map((match: any) => ({
        id: match.id.toString(),
        name: match.name,
        age: match.age,
        destinations: match.destinations,
        dates: match.dates || 'Flexible',
        hobbies: match.hobbies,
        bio: match.bio || '',
        verified: match.verified,
        travelStyle: match.travelStyles,
        languages: match.languages,
        compatibilityScore: match.compatibilityScore,
        profileImage: match.profilePicture
      }));
      
      setProfiles(uiMatches);
      
      // Process connection statuses
      const acceptedMap: {[key: string]: boolean} = {};
      const matchesMap: {[key: string]: boolean} = {};
      
      matches.forEach((match: any) => {
        if (match.connectionStatus === 'outgoing_request') {
          acceptedMap[match.id] = true;
        } else if (match.connectionStatus === 'accepted') {
          matchesMap[match.id] = true;
        }
      });
      
      setAccepted(acceptedMap);
      setMatches(matchesMap);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load potential matches');
    }
  };
  
  // Handle saving the profile to the backend
  const handleSaveProfile = async () => {
    try {
      // Validate required fields
      if (!newProfile.name || !newProfile.age || !newProfile.destinations) {
        toast.error('Please fill in all required fields (name, age, and destinations)');
        return;
      }
      
      setSavingProfile(true);
      
      // Format data for the API
      const profileData = {
        age: parseInt(newProfile.age),
        gender: newProfile.gender,
        bio: newProfile.bio,
        dates: newProfile.dates,
        destinations: newProfile.destinations.split(',').map(d => d.trim()),
        hobbies: newProfile.hobbies,
        languages: newProfile.languages,
        travelStyles: newProfile.travelStyle
      };
      
      // Call API to create/update profile
      await travelmateService.createOrUpdateProfile(profileData);
      
      // Fetch the updated profile
      await fetchMyCompleteProfile();
      
      // Reset form and close dialog
      setNewProfile({
        name: '',
        age: '',
        gender: '',
        destinations: '',
        bio: '',
        dates: '',
        hobbies: [],
        travelStyle: [],
        languages: [],
        profileImage: DEFAULT_AVATARS.other,
        phone: '',
      });
      
      setCreateProfileOpen(false);
      setHasProfile(true);
      
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Add hobby handler
  const handleAddHobby = () => {
    const hobby = hobbyInput.trim();
    if (hobby && !selectedHobbies.includes(hobby)) {
      setSelectedHobbies(prev => [...prev, hobby]);
      setHobbyInput('');
    }
  };

  // Remove hobby handler
  const handleRemoveHobby = (hobbyToRemove: string) => {
    setSelectedHobbies(prev => prev.filter(h => h !== hobbyToRemove));
  };

  // Handle enter key in hobby input
  const handleHobbyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHobby();
    }
  };

  // Filter out blocked users and apply filters
  const filtered = profiles.filter(p => {
    if (p.id === currentUser.id || blockedUsers.includes(p.id)) return false;
    
    // Destination filter
    const destinationMatch =
      !filterDestination || p.destinations.some(d => d.toLowerCase().includes(filterDestination.toLowerCase()));
    
    // Hobby filter
    const hobbyMatch =
      selectedHobbies.length === 0 || selectedHobbies.some(h => p.hobbies.some(ph => ph.toLowerCase().includes(h.toLowerCase())));
    
    // Travel style filter
    const travelStyleMatch =
      selectedTravelStyles.length === 0 || 
      selectedTravelStyles.some(style => p.travelStyle?.some(ts => ts.toLowerCase().includes(style.toLowerCase())));
    
    // Check for common interests with current user
    const hasCommonDestination = p.destinations.some(d => currentUser.destinations.includes(d));
    const hasCommonHobby = p.hobbies.some(h => currentUser.hobbies.includes(h));
    
    return destinationMatch && hobbyMatch && travelStyleMatch && (hasCommonDestination || hasCommonHobby);
  });

  // Block user handler
  const handleBlock = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    // Remove from matches and accepted
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[userId];
      return newMatches;
    });
    setAccepted(prev => {
      const newAccepted = { ...prev };
      delete newAccepted[userId];
      return newAccepted;
    });
  };

  // Unblock user handler
  const handleUnblock = (userId: string) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
  };

  // Report user handler
  const handleReport = (userId: string) => {
    setUserToReport(userId);
    setReportDialogOpen(true);
  };

  const submitReport = () => {
    if (reportReason.trim()) {
      // In a real app, send this to your backend
      console.log(`Reported user ${userToReport} for: ${reportReason}`);
      setReportDialogOpen(false);
      setReportReason('');
      setUserToReport(null);
    }
  };

  // Accept match handler
  const handleAccept = async (id: string) => {
    try {
      // Format phone number for WhatsApp (remove any non-numeric characters)
      const phoneNumber = '76764263';
      // Open WhatsApp with the phone number
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
      
      // Update UI state
      setAccepted(prev => ({ ...prev, [id]: true }));
      
      toast.success('Opening WhatsApp chat!');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Failed to open WhatsApp');
    }
  };

  // Chat handlers
  const handleStartChat = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile?.phone) {
      // Format phone number for WhatsApp (remove any non-numeric characters)
      const phoneNumber = profile.phone.replace(/\D/g, '');
      // Open WhatsApp with the phone number
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
      toast.error('Phone number not available for this user');
    }
  };

  // Add hobby to new profile
  const handleAddNewProfileHobby = () => {
    const hobby = newProfileHobbyInput.trim();
    if (hobby && !newProfile.hobbies.includes(hobby)) {
      setNewProfile(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobby]
      }));
      setNewProfileHobbyInput('');
    }
  };

  // Remove hobby from new profile
  const handleRemoveNewProfileHobby = (hobbyToRemove: string) => {
    setNewProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobbyToRemove)
    }));
  };

  // Add language to new profile
  const handleAddNewProfileLanguage = () => {
    const language = newProfileLanguageInput.trim();
    if (language && !newProfile.languages.includes(language)) {
      setNewProfile(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
      setNewProfileLanguageInput('');
    }
  };

  // Remove language from new profile
  const handleRemoveNewProfileLanguage = (languageToRemove: string) => {
    setNewProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== languageToRemove)
    }));
  };

  // Add travel style to new profile
  const handleAddNewProfileTravelStyle = (style: string) => {
    if (!newProfile.travelStyle.includes(style)) {
      setNewProfile(prev => ({
        ...prev,
        travelStyle: [...prev.travelStyle, style]
      }));
    } else {
      setNewProfile(prev => ({
        ...prev,
        travelStyle: prev.travelStyle.filter(s => s !== style)
      }));
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfile(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading state
  if (loading || authLoading) {
    return (
      <TravelistaLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Spinner size="lg" />
          <p className="ml-2 text-lg">Loading your profile...</p>
        </div>
      </TravelistaLayout>
    );
  }
  
  return (
    <>
      <style>{heroAnimation}</style>
      <TravelistaLayout>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes slideInFromBottom {
            0% { opacity: 0; transform: translateY(50px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInFromLeft {
            0% { opacity: 0; transform: translateX(-50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInFromRight {
            0% { opacity: 0; transform: translateX(50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
          
          .animate-slideIn {
            animation: slideInFromBottom 0.8s ease forwards;
          }
          
          .animate-slideInLeft {
            animation: slideInFromLeft 0.8s ease forwards;
          }
          
          .animate-slideInRight {
            animation: slideInFromRight 0.8s ease forwards;
          }
          
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          
          .animate-bounce {
            animation: bounce 2s infinite;
          }
          
          .stagger-1 { animation-delay: 0.1s; }
          .stagger-2 { animation-delay: 0.2s; }
          .stagger-3 { animation-delay: 0.3s; }
          .stagger-4 { animation-delay: 0.4s; }
          .stagger-5 { animation-delay: 0.5s; }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          .card-hover-effect {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .card-hover-effect:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .travelmate-btn {
            background-color: rgb(59, 121, 201) !important;
            color: #fff !important;
            border: none !important;
            transition: all 0.2s;
          }
          
          .travelmate-btn:hover, .travelmate-btn:focus {
            background-color: rgb(45, 100, 170) !important;
            color: #fff !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .tag-hover:hover {
            transform: scale(1.05);
          }

          .title-blue {
            color: rgb(59, 121, 201);
          }

          .bg-custom-blue {
            background-color: rgb(59, 121, 201);
          }

          .text-custom-blue {
            color: rgb(59, 121, 201);
          }

          .bg-custom-blue-light {
            background-color: rgba(59, 121, 201, 0.1);
          }

          .border-custom-blue {
            border-color: rgb(59, 121, 201);
          }
          
          /* Transition effects */
          .transition-all {
            transition: all 0.3s ease;
          }
          
          .transition-transform {
            transition: transform 0.3s ease;
          }
          
          .transition-opacity {
            transition: opacity 0.3s ease;
          }
          
          .scale-on-hover:hover {
            transform: scale(1.05);
          }
          
          .fade-on-hover:hover {
            opacity: 0.8;
          }
        `}</style>

        {/* Page Header with Title and Subtitle */}
        <div className="bg-white">
          <div className="container mx-auto pt-16 pb-8 px-4">
            <div className="relative text-center mb-8">
              <h1 className="text-6xl font-bold mb-4 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                TRAVELMATE
              </h1>
              <p className="text-xl text-gray-600 mb-8 uppercase">
                FIND YOUR PERFECT TRAVEL COMPANION
              </p>
              <Button 
                onClick={() => setCreateProfileOpen(true)}
                className="rounded-full px-6 py-2 bg-custom-blue hover:bg-blue-700 text-white font-medium flex items-center gap-2 mx-auto"
              >
                <UserPlus className="w-5 h-5" />
                {hasProfile ? 'Edit Your Profile' : 'Create Your Profile'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Create Profile Dialog */}
        <Dialog open={createProfileOpen} onOpenChange={setCreateProfileOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{hasProfile ? 'Edit Your Travel Profile' : 'Create Your Travel Profile'}</DialogTitle>
              <DialogDescription>
                Fill in your details to connect with like-minded travelers
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Basic Info Section */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={newProfile.name || (user?.name || '')}
                      onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                      placeholder="Your name"
                      disabled={!!user?.name}
                      readOnly={!!user?.name}
                      required
                    />
                    {user?.name && (
                      <p className="text-xs text-gray-500">Name is synced from your account</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age" 
                      type="number"
                      value={newProfile.age || (user?.birthday ? calculateAge(user.birthday) : '')}
                      onChange={(e) => setNewProfile({...newProfile, age: e.target.value})}
                      placeholder="Your age"
                      disabled={!!user?.birthday}
                      readOnly={!!user?.birthday}
                      required
                    />
                    {user?.birthday && (
                      <p className="text-xs text-gray-500">Age is calculated from your birthday</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      value={newProfile.phone || (user?.phone || '')}
                      onChange={(e) => setNewProfile({...newProfile, phone: e.target.value})}
                      placeholder="Your phone number"
                      disabled={!!user?.phone}
                      readOnly={!!user?.phone}
                      required
                    />
                    {user?.phone && (
                      <p className="text-xs text-gray-500">Phone number is synced from your account</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newProfile.gender}
                      onValueChange={(value) => {
                        setNewProfile(prev => ({
                          ...prev,
                          gender: value,
                          profileImage: DEFAULT_AVATARS[value as keyof typeof DEFAULT_AVATARS] || DEFAULT_AVATARS.other
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Profile Image */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Profile Image</h3>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <img 
                      src={newProfile.profileImage || user?.profilePicture || DEFAULT_AVATARS.other}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {user?.profilePicture ? (
                      <p className="text-sm text-gray-600">Profile image is synced from your account</p>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="profile-image" className="cursor-pointer">
                          <div className="flex items-center gap-2 p-2 border border-dashed rounded-lg hover:bg-gray-50">
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span>Upload Profile Picture</span>
                          </div>
                          <Input 
                            id="profile-image" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfileImageChange}
                          />
                        </Label>
                        <p className="text-xs text-gray-500">Or select a gender to use a default avatar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Travel Info */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Travel Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destinations">Destinations (comma-separated) *</Label>
                    <Input 
                      id="destinations" 
                      value={newProfile.destinations}
                      onChange={(e) => setNewProfile({...newProfile, destinations: e.target.value})}
                      placeholder="Japan, Thailand, Australia..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dates">Travel Dates</Label>
                    <Input 
                      id="dates" 
                      value={newProfile.dates}
                      onChange={(e) => setNewProfile({...newProfile, dates: e.target.value})}
                      placeholder="2024-07-10 to 2024-07-25 or 'Flexible'"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Travel Style</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Budget', 'Mid-range', 'Luxury', 'Adventure', 'Relaxation', 'Cultural', 'Backpacker', 'Photography'].map(style => (
                        <div
                          key={style}
                          className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                            newProfile.travelStyle.includes(style) 
                              ? 'bg-custom-blue-light text-custom-blue' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => handleAddNewProfileTravelStyle(style)}
                        >
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interests & Languages */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Interests & Languages</h3>
                
                <div className="space-y-2 mb-4">
                  <Label>Interests & Hobbies</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
                    {newProfile.hobbies.map(hobby => (
                      <div
                        key={hobby}
                        className="flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{hobby}</span>
                        <button
                          onClick={() => handleRemoveNewProfileHobby(hobby)}
                          className="hover:text-pink-900 focus:outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Input
                        type="text"
                        value={newProfileHobbyInput}
                        onChange={(e) => setNewProfileHobbyInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewProfileHobby();
                          }
                        }}
                        placeholder="Type a hobby and press Enter..."
                        className="border-0 focus:ring-0 p-0 text-sm flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAddNewProfileHobby}
                        className="p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
                    {newProfile.languages.map(language => (
                      <div
                        key={language}
                        className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{language}</span>
                        <button
                          onClick={() => handleRemoveNewProfileLanguage(language)}
                          className="hover:text-purple-900 focus:outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Input
                        type="text"
                        value={newProfileLanguageInput}
                        onChange={(e) => setNewProfileLanguageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewProfileLanguage();
                          }
                        }}
                        placeholder="Add languages you speak..."
                        className="border-0 focus:ring-0 p-0 text-sm flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAddNewProfileLanguage}
                        className="p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <Textarea 
                  id="bio" 
                  value={newProfile.bio}
                  onChange={(e) => setNewProfile({...newProfile, bio: e.target.value})}
                  placeholder="Tell potential travel companions about yourself..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              {!hasProfile && (
                <p className="text-xs text-red-500 mr-auto">You must create a profile to continue</p>
              )}
              <Button variant="outline" onClick={() => {
                if (hasProfile) {
                  setCreateProfileOpen(false);
                } else {
                  toast.error('You must create a profile to continue');
                }
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile} 
                className="bg-custom-blue hover:bg-custom-blue"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  `${hasProfile ? 'Update' : 'Save'} Profile`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Show "Your Profile" card if the user has a profile */}
        {hasProfile && myProfile && (
          <div className="max-w-6xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
            <p className="text-gray-600 mb-6">This is how you appear to other users:</p>
            
            <div className="bg-white rounded-xl shadow-xl p-6 mb-10">
              <div className="flex items-start gap-6">
                <img 
                  src={myProfile.profileImage || user?.profilePicture || DEFAULT_AVATARS.other} 
                  alt={myProfile.name}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-100" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-2xl">{myProfile.name}, {myProfile.age}</h3>
                      <p className="text-gray-600">{myProfile.dates}</p>
                    </div>
                    <Button 
                      onClick={() => setCreateProfileOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Your Destinations</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {myProfile.destinations.map(dest => (
                          <span 
                            key={dest} 
                            className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="font-medium">Your Interests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {myProfile.hobbies.map(hobby => (
                          <span 
                            key={hobby} 
                            className="bg-pink-50 text-pink-600 px-2 py-1 rounded-full text-xs"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Languages className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Your Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {myProfile.languages?.map(lang => (
                          <span 
                            key={lang} 
                            className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="font-medium mb-1">About You</div>
                    <p className="text-gray-700">{myProfile.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Section */}
        <div className="bg-white text-gray-900 py-10">
          <style>{`
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(40px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInLeft {
              0% { opacity: 0; transform: translateX(-40px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeInRight {
              0% { opacity: 0; transform: translateX(40px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            .hero-card {
              transition: all 0.3s ease;
              transform: translateY(0);
            }
            .hero-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .title-blue {
              color: #3b82f6;
            }
          `}</style>
          <div
            className="relative bg-white"
            style={{
              backgroundImage: 'none',
            }}
          >
            <div className="container mx-auto px-8 py-16">
              <div className="grid md:grid-cols-5 gap-8 items-center">
            <div
                  className="md:col-span-2 bg-white rounded-3xl shadow-xl p-12"
              style={{
                    animation: 'fadeInLeft 1s cubic-bezier(0.23, 1, 0.32, 1) both',
              }}
            >
                  <div className="space-y-8">
                    <div className="inline-block px-3 py-1 bg-custom-blue-light text-custom-blue rounded-full text-sm font-medium mb-2">
                      Meet New People
                    </div>
                    <h1 className="text-5xl font-bold leading-tight text-gray-900 mb-4">
                      Find Your Perfect <span className="title-blue">Travel<br />Companion</span>
                </h1>
                    <p className="text-xl text-gray-600 mb-6">
                      Connect with like-minded travelers who share your interests, destinations, and travel style. Create unforgettable memories together.
                </p>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-custom-blue" />
                    <span>Split costs</span>
                  </div>
                  <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-custom-blue" />
                    <span>Make friends</span>
                  </div>
                  <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-custom-blue" />
                    <span>Share experiences</span>
                  </div>
                  <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-custom-blue" />
                    <span>Create memories</span>
                  </div>
                </div>
                    <div>
                      <Button 
                        className="rounded-full px-8 py-6 bg-custom-blue hover:bg-custom-blue text-white text-lg font-medium"
                        onClick={() => {
                          document.getElementById('find-travelmate')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Find Travelmates Now
                      </Button>
              </div>
                  </div>
                </div>
                <div 
                  className="hidden md:block md:col-span-3"
                  style={{
                    animation: 'fadeInRight 1s 0.3s cubic-bezier(0.23, 1, 0.32, 1) both',
                    position: 'relative',
                  }}
                >
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="Mountain hiking"
                    className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                  />
                  
                  <div className="absolute -left-6 top-10 bg-white p-4 rounded-xl shadow-lg hero-card z-10 flex items-center gap-3">
                    <img 
                      src={demoProfiles[0].profileImage} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-custom-blue-light"
                      alt="Travelmate profile" 
                    />
                    <div>
                      <p className="font-bold">{demoProfiles[0].name}</p>
                      <p className="text-sm text-gray-500">{demoProfiles[0].destinations[0]}</p>
                    </div>
                  </div>
                  
                  <div className="absolute -right-6 bottom-10 bg-white p-4 rounded-xl shadow-lg hero-card flex items-center gap-3">
                    <img 
                      src={demoProfiles[1].profileImage} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-custom-blue-light"
                      alt="Travelmate profile" 
                />
                    <div>
                      <p className="font-bold">{demoProfiles[1].name}</p>
                      <p className="text-sm text-gray-500">{demoProfiles[1].destinations[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white py-20">
          <style>{`
            @keyframes fadeInUpBenefits {
              0% { opacity: 0; transform: translateY(40px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .benefit-card {
              transition: all 0.3s ease;
              border-top: 4px solid transparent;
            }
            .benefit-card:hover {
              transform: translateY(-5px);
              border-color: #3b82f6;
            }
          `}</style>
          <div
            className="max-w-6xl mx-auto px-4"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold inline-block relative">
                Why Travel with a Companion?
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Traveling with the right companion can transform your journey in countless ways. Here's why you should find your travelmate.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                className="bg-white p-8 rounded-xl shadow-xl benefit-card"
            style={{
                  animation: 'fadeInUpBenefits 0.8s 0.1s cubic-bezier(0.23, 1, 0.32, 1) both',
            }}
          >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Share Expenses</h3>
                <p className="text-gray-600 mb-4">
                  Split accommodation, transportation, and activities to make your dream trip more affordable and budget-friendly.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-500">✓</span> Shared hotel rooms
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-500">✓</span> Split transportation costs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-500">✓</span> Group discounts on activities
                  </li>
                </ul>
              </div>
              
              <div 
                className="bg-white p-8 rounded-xl shadow-xl benefit-card"
                style={{
                  animation: 'fadeInUpBenefits 0.8s 0.3s cubic-bezier(0.23, 1, 0.32, 1) both',
                }}
              >
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enhanced Safety</h3>
                <p className="text-gray-600 mb-4">
                  Travel with peace of mind knowing you have someone to watch your back in unfamiliar places and situations.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Someone to watch your belongings
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Navigate unfamiliar areas together
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Help in case of emergencies
                  </li>
                </ul>
              </div>
              
              <div 
                className="bg-white p-8 rounded-xl shadow-xl benefit-card"
                style={{
                  animation: 'fadeInUpBenefits 0.8s 0.5s cubic-bezier(0.23, 1, 0.32, 1) both',
                }}
              >
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                  <Heart className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Shared Memories</h3>
                <p className="text-gray-600 mb-4">
                  Create lasting memories together and forge deep connections through shared experiences and adventures.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2 text-purple-500">✓</span> Someone to reminisce with
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-purple-500">✓</span> Share both challenges and joys
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-purple-500">✓</span> Form lifelong friendships
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-6">Join thousands of travelers who've found their perfect travel companion</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How Travelmate Works</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Find your perfect travel companion in just a few simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Profile</h3>
                <p className="text-gray-600 text-sm">
                  Add your travel preferences, destinations, and interests
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Browse Matches</h3>
                <p className="text-gray-600 text-sm">
                  Find travelers with similar interests and destinations
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 text-sm">
                  Chat and get to know potential travel companions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">4</span>
                </div>
                <h3 className="font-semibold mb-2">Travel Together</h3>
                <p className="text-gray-600 text-sm">
                  Plan your trip and enjoy amazing experiences together
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Find Your Travelmate</h2>
            <Button
              variant="outline"
              onClick={() => setShowBlockedUsers(true)}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Blocked Users ({blockedUsers.length})
            </Button>
          </div>

          {/* Blocked Users Dialog */}
          <Dialog open={showBlockedUsers} onOpenChange={setShowBlockedUsers}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Blocked Users</DialogTitle>
                <DialogDescription>
                  Manage users you've blocked from contacting you.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {blockedUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No blocked users</p>
                ) : (
                  <div className="space-y-2">
                    {blockedUsers.map(userId => {
                      const user = profiles.find(p => p.id === userId);
                      return user ? (
                        <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {user.name[0]}
                            </div>
                            <span>{user.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnblock(userId)}
                          >
                            Unblock
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Report Dialog */}
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report User</DialogTitle>
                <DialogDescription>
                  Please provide a reason for reporting this user.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Enter reason for report..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitReport}>
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div id="find-travelmate" className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Find Your Perfect Travel Companion</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                <input
                  type="text"
                      placeholder="Where do you want to go?"
                      className="border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  value={filterDestination}
                  onChange={e => setFilterDestination(e.target.value)}
                />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a country or city to find travelers headed there
                  </p>
              </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Style
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
                    {['Budget', 'Mid-range', 'Luxury', 'Adventure', 'Relaxation', 'Cultural', 'Backpacker', 'Photography'].map(style => (
                      <div
                        key={style}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          selectedTravelStyles.includes(style) 
                            ? 'bg-custom-blue-light text-custom-blue' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setSelectedTravelStyles(prev => 
                            prev.includes(style) 
                              ? prev.filter(s => s !== style) 
                              : [...prev, style]
                          );
                        }}
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests & Hobbies
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
                  {selectedHobbies.map(hobby => (
                    <div
                      key={hobby}
                        className="flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{hobby}</span>
                      <button
                        onClick={() => handleRemoveHobby(hobby)}
                          className="hover:text-pink-900 focus:outline-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      ref={hobbyInputRef}
                      type="text"
                      value={hobbyInput}
                      onChange={e => setHobbyInput(e.target.value)}
                      onKeyPress={handleHobbyKeyPress}
                      placeholder="Type a hobby and press Enter..."
                      className="border-0 focus:ring-0 p-0 text-sm flex-1 min-w-[200px]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddHobby}
                      className="p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add interests to find travelmates with similar passions
                </p>
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Common Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allHobbies.slice(0, 12).map(hobby => (
                      <div
                        key={hobby}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          selectedHobbies.includes(hobby) 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          if (selectedHobbies.includes(hobby)) {
                            handleRemoveHobby(hobby);
                          } else if (selectedHobbies.length < 10) {
                            setSelectedHobbies(prev => [...prev, hobby]);
                          }
                        }}
                      >
                        {hobby}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6 pt-4 border-t">
              <div className="flex items-center">
                <p className="text-sm text-gray-600">
                  <strong>{filtered.length}</strong> compatible {filtered.length === 1 ? 'travelmate' : 'travelmates'} found
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterDestination('');
                  setSelectedHobbies([]);
                  setSelectedTravelStyles([]);
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(profile => (
              <div 
                key={profile.id} 
                className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden card-hover-effect"
              >
                <div className="relative">
                  {profile.verified && (
                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                  {profile.compatibilityScore && (
                    <span className="absolute top-3 left-3 bg-custom-blue text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-300" />
                      {profile.compatibilityScore}% Match
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    {profile.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-100" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-500">
                    {profile.name[0]}
                  </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                  <div>
                          <h3 className="font-bold text-xl">{profile.name}, {profile.age}</h3>
                          <p className="text-gray-600 text-sm">{profile.dates}</p>
                  </div>
                </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Destinations</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                    {profile.destinations.map(dest => (
                          <span 
                            key={dest} 
                            className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs tag-hover transition-transform"
                          >
                            {dest}
                          </span>
                    ))}
                  </div>
                </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Languages className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages?.map(lang => (
                          <span 
                            key={lang} 
                            className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs tag-hover transition-transform"
                          >
                            {lang}
                          </span>
                    ))}
                  </div>
                </div>
                </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Travel Style</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.travelStyle?.map(style => (
                        <span 
                          key={style} 
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs tag-hover transition-transform"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-medium">Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.slice(0, 8).map(hobby => (
                        <span 
                          key={hobby} 
                          className="bg-pink-50 text-pink-600 px-2 py-1 rounded-full text-xs tag-hover transition-transform"
                        >
                          {hobby}
                        </span>
                      ))}
                      {profile.hobbies.length > 8 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{profile.hobbies.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">About</div>
                    <p className="text-gray-700 text-sm">{profile.bio}</p>
                  </div>
                  
                <div className="mt-4 flex gap-2">
                  {matches[profile.id] ? (
                    <Button 
                      className="flex-1 bg-custom-blue hover:bg-custom-blue text-white"
                      onClick={() => handleStartChat(profile.id)}
                    >
                      Chat on WhatsApp
                    </Button>
                  ) : accepted[profile.id] ? (
                    <Button className="flex-1 bg-gray-400 text-white" disabled>Waiting for match...</Button>
                  ) : (
                    <Button className="flex-1 bg-custom-blue hover:bg-custom-blue text-white" onClick={() => handleAccept(profile.id)}>
                      Connect with {profile.name}
                    </Button>
                  )}
                </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleReport(profile.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                      <AlertTriangle className="w-3 h-3" />
                    Report
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleBlock(profile.id)}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                      <Shield className="w-3 h-3" />
                    Block
                  </Button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full bg-white rounded-xl shadow p-10 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No travelmates found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or add more destinations to find compatible travel companions.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterDestination('');
                    setSelectedHobbies([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </TravelistaLayout>
    </>
  );
};

export default Travelmate; 