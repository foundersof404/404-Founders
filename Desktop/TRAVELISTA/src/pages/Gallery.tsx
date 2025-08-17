import React, { useState, useRef, useEffect, useCallback } from 'react';
import TravelistaLayout from '@/components/TravelistaLayout';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import { Heart, MessageCircle, Share2, Send, ThumbsUp, MoreHorizontal, Download, X, Upload, MapPin, Camera, Image as ImageIcon, MessageSquare, Smile, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';

// List of bad words to filter
const BAD_WORDS = [
  'badword1', 'badword2', 'badword3', // Add your list of bad words here
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', // Example bad words
];

// Function to check for bad words
const containsBadWords = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/);
  return words.some(word => BAD_WORDS.includes(word));
};

// API base URL for our local backend
const API_URL = 'http://localhost:5001';

interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
}

interface Reply {
  id: number;
  comment_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
  likes_count: number;
}

interface Comment {
  id: number;
  image_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
  likes_count: number;
  replies: Reply[];
}

interface GalleryImage {
  id: number;
  image_url: string;
  caption: string | null;
  location: string | null;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  comments: Comment[];
}

interface Story {
  id: number;
  user_id: number;
  media_url: string;
  created_at: string;
  expires_at: string;
  views_count: number;
  user?: User;
  viewers: {
    id: number;
    name: string;
    profile_picture: string;
    viewed_at: string;
  }[];
  hasViewed?: boolean;
}

const Gallery = () => {
  // State management
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storiesLoading, setStoriesLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const commentEmojiPickerRef = useRef<HTMLDivElement>(null);
  const replyEmojiPickerRef = useRef<HTMLDivElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  // Setup dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      handleFileSelection(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    noClick: true
  });

  // Handle file selection from input
  const handleFileSelection = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Fetch gallery images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Function to fetch gallery images from backend
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gallery`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
      } else {
        setError('Failed to load images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stories
  const fetchStories = async () => {
    try {
      setStoriesLoading(true);
      const response = await fetch(`${API_URL}/stories`);
      const data = await response.json();
      if (data.success) {
        // Mark stories that the current user has viewed
        const storiesWithViewStatus = data.stories.map((story: Story) => ({
          ...story,
          hasViewed: story.viewers.some(viewer => viewer.id === Number(user?.id))
        }));
        setStories(storiesWithViewStatus);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to load stories",
        variant: "destructive",
      });
    } finally {
      setStoriesLoading(false);
    }
  };

  // Refresh stories periodically
  useEffect(() => {
    fetchStories();
    // Refresh stories every minute to check for expiration
    const interval = setInterval(fetchStories, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      // Construct location string
      let locationString = '';
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.suburb;
        const country = data.address.country;
        locationString = city && country ? `${city}, ${country}` : data.display_name.split(',')[0];
      }
      
      setLocation(locationString);
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: "Failed to get your location. Please enter it manually.",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('image', fileInputRef.current.files[0]);
      formData.append('caption', caption);
      formData.append('location', location);
      formData.append('user_id', user?.id || '1'); // Default to 1 if no user ID

      const response = await fetch(`${API_URL}/gallery/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
        setIsUploadDialogOpen(false);
        resetUploadForm();
        fetchGalleryImages(); // Refresh gallery
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setUploadedImage(null);
    setCaption('');
    setLocation('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle like image
  const handleLikeImage = async (imageId: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/gallery/${imageId}/like`, {
        method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update images state immediately
        setImages(images.map(img => 
          img.id === imageId 
            ? { ...img, likes_count: data.likes }
            : img
        ));
        setUserLikes({ ...userLikes, [`image-${imageId}`]: data.isLiked });
      }
    } catch (error) {
      console.error('Error liking image:', error);
      toast({
        title: "Error",
        description: "Failed to like image",
        variant: "destructive",
      });
    }
  };

  // Handle add comment
  const handleAddComment = async (imageId: number) => {
    if (!newComment.trim()) return;
    
    // Check for bad words
    if (containsBadWords(newComment)) {
      toast({
        title: "Sorry! 😊",
        description: "Our server currently accepting only good words. If you have a bad word, keep it to yourself!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/gallery/${imageId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || 1,
          text: newComment,
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update both images and selectedImage states
        const updatedImages = images.map(img => 
          img.id === imageId 
            ? {
                ...img,
                comments: [data.comment, ...img.comments],
                comments_count: (img.comments_count || 0) + 1,
              }
            : img
        );
        setImages(updatedImages);
      
        if (selectedImage?.id === imageId) {
          setSelectedImage({
            ...selectedImage,
            comments: [data.comment, ...selectedImage.comments],
            comments_count: (selectedImage.comments_count || 0) + 1,
          });
        }
      
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  // Handle add reply
  const handleAddReply = async (commentId: number) => {
    if (!newReply.trim()) return;
    
    // Check for bad words
    if (containsBadWords(newReply)) {
      toast({
        title: "Sorry! 😊",
        description: "Our server currently accepting only good words. If you have a bad word, keep it to yourself!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/gallery/comment/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || 1,
          text: newReply,
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update both images and selectedImage states
        const updatedImages = images.map(img => ({
          ...img,
          comments: img.comments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [...comment.replies, data.reply],
                }
              : comment
          ),
        }));
        setImages(updatedImages);
        
        if (selectedImage) {
          setSelectedImage({
            ...selectedImage,
            comments: selectedImage.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [...comment.replies, data.reply],
                  }
                : comment
            ),
          });
        }
        
        setNewReply('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    }
  };

  // Handle like comment
  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await fetch(`${API_URL}/gallery/comment/${commentId}/like`, {
        method: 'POST',
            headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update both images and selectedImage states
        const updatedImages = images.map(img => ({
          ...img,
          comments: img.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes_count: data.likes }
              : comment
          ),
        }));
        setImages(updatedImages);
        
        if (selectedImage) {
          setSelectedImage({
            ...selectedImage,
            comments: selectedImage.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes_count: data.likes }
                : comment
            ),
          });
        }
        
        setUserLikes({ ...userLikes, [`comment-${commentId}`]: data.isLiked });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    }
  };

  // Handle like reply
  const handleLikeReply = async (replyId: number) => {
    try {
      const response = await fetch(`${API_URL}/gallery/reply/${replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });
            const data = await response.json();
      
      if (data.success) {
        // Update both images and selectedImage states
        const updatedImages = images.map(img => ({
          ...img,
          comments: img.comments.map(comment => ({
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? { ...reply, likes_count: data.likes }
                : reply
            ),
          })),
        }));
        setImages(updatedImages);
        
        if (selectedImage) {
          setSelectedImage({
            ...selectedImage,
            comments: selectedImage.comments.map(comment => ({
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes_count: data.likes }
                  : reply
              ),
            })),
          });
        }
        
        setUserLikes({ ...userLikes, [`reply-${replyId}`]: data.isLiked });
      }
    } catch (error) {
      console.error('Error liking reply:', error);
      toast({
        title: "Error",
        description: "Failed to like reply",
        variant: "destructive",
      });
    }
  };

  // Handle share
  const handleShare = (imageUrl: string) => {
    setShareUrl(`${window.location.origin}${imageUrl}`);
    setShowShareDialog(true);
  };

  // Handle clicking outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (commentEmojiPickerRef.current && !commentEmojiPickerRef.current.contains(event.target as Node)) {
        setShowCommentEmoji(false);
      }
      if (replyEmojiPickerRef.current && !replyEmojiPickerRef.current.contains(event.target as Node)) {
        setShowReplyEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle emoji selection for caption
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setCaption((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Handle emoji selection for comment
  const onCommentEmojiClick = (emojiData: EmojiClickData) => {
    setNewComment((prev) => prev + emojiData.emoji);
    setShowCommentEmoji(false);
  };

  // Handle emoji selection for reply
  const onReplyEmojiClick = (emojiData: EmojiClickData) => {
    setNewReply((prev) => prev + emojiData.emoji);
    setShowReplyEmoji(false);
  };

  // Handle story upload
  const handleStoryUpload = async () => {
    if (!storyFile) return;

    try {
      setIsUploadingStory(true);
      const formData = new FormData();
      formData.append('media', storyFile);
      formData.append('user_id', user?.id || '1');

      const response = await fetch(`${API_URL}/stories/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Story uploaded successfully!",
        });
        setStoryFile(null);
        fetchStories();
      }
    } catch (error) {
      console.error('Error uploading story:', error);
      toast({
        title: "Error",
        description: "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setIsUploadingStory(false);
    }
  };

  // Handle story view
  const handleStoryView = async (story: Story) => {
    try {
      await fetch(`${API_URL}/stories/${story.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  // Handle story delete
  const handleStoryDelete = async (storyId: number) => {
    try {
      const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Story deleted successfully!",
        });
        setSelectedStory(null);
        fetchStories();
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive",
      });
    }
  };

  return (
    <TravelistaLayout>
      <FadeInOnScroll>
        <div className="container mx-auto px-4 py-12">
          <div className="relative text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              TRAVELER'S PHOTOS
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              SHARE YOUR PHOTO IN FACEBOOK STORIES AND MENTION US
            </p>

            {/* Upload button */}
            <div className="absolute top-0 right-0">
              <Button 
                onClick={() => setIsUploadDialogOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Stories Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {/* Add Story Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => storyInputRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <Plus className="w-6 h-6 text-gray-500" />
                </button>
                <input
                  type="file"
                  ref={storyInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setStoryFile(file);
                      handleStoryUpload();
                    }
                  }}
                />
                <p className="text-xs text-center mt-1">Add Story</p>
              </div>

              {/* Stories */}
              {storiesLoading ? (
                // Loading skeletons for stories
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                    <div className="w-16 h-2 mt-2 mx-auto bg-gray-200 rounded animate-pulse" />
                  </div>
                ))
              ) : (
                stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedStory(story);
                        setStoryIndex(0);
                        handleStoryView(story);
                      }}
                      className="relative w-20 h-20 rounded-full overflow-hidden"
                    >
                      {/* Story Border */}
                      <div className={`absolute inset-0 rounded-full border-2 ${
                        story.hasViewed ? 'border-gray-300' : 'border-blue-500'
                      }`} />
                      
                      {/* Story Media Preview */}
                      <div className="absolute inset-0.5 rounded-full overflow-hidden">
                        <img
                          src={`${API_URL}${story.media_url}`}
                          alt={story.user?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* User Profile Picture - Small */}
                      <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <img
                          src={`${API_URL}${story.user?.profile_picture}`}
                          alt={story.user?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                    <p className="text-xs text-center mt-1 truncate w-20">
                      {story.user?.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <p>Loading gallery...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="bg-white rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(66,133,244,0.25),0_1.5px_8px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_48px_rgba(66,133,244,0.35),0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-3 flex items-center gap-2">
                  <div className="profile-avatar h-8 w-8 flex items-center justify-center rounded-full bg-[#4285F4]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{image.user?.name || `User ${image.user_id}`}</h3>
                    <p className="text-xs text-gray-500">{image.location || 'Unknown location'}</p>
                  </div>
                </div>
                
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={`${API_URL}${image.image_url}`}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => handleLikeImage(image.id, e)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            userLikes[`image-${image.id}`] ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                        <span>{image.likes_count}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{image.comments_count}</span>
                      </button>
                      
                          <button 
                        onClick={() => handleShare(image.image_url)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors"
                          >
                        <Share2 className="w-5 h-5" />
                          </button>
                                </div>
                                </div>
                  
                  <p className="text-gray-700 text-sm mb-2">{image.caption || 'No caption'}</p>
                  <p className="text-xs text-gray-500">
                    Posted on {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInOnScroll>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden bg-white">
          <div className="flex h-[85vh]">
            {/* Left: Image */}
            <div className="w-[65%] bg-black flex items-center justify-center">
              {selectedImage && (
                <img
                  src={`${API_URL}${selectedImage.image_url}`}
                  alt={selectedImage.caption || 'Gallery image'}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            
            {/* Right: Details and Comments */}
            <div className="w-[35%] flex flex-col bg-white">
              {selectedImage && (
                <>
                  {/* Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="profile-avatar h-8 w-8 flex items-center justify-center rounded-full bg-[#4285F4]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{selectedImage.user?.name || `User ${selectedImage.user_id}`}</p>
                        <p className="text-xs text-gray-500">{selectedImage.location || 'Unknown location'}</p>
              </div>
            </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
            </Button>
            </div>
            
                  {/* Comments Section */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Original Post */}
                    {selectedImage.caption && (
                      <div className="p-4 border-b">
                        <div className="flex items-start space-x-3">
                          <div className="profile-avatar h-8 w-8 flex items-center justify-center rounded-full bg-[#4285F4]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-semibold">{selectedImage.user?.name || `User ${selectedImage.user_id}`}</span>{' '}
                              {selectedImage.caption}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(selectedImage.created_at).toLocaleDateString()}
                            </p>
                </div>
              </div>
              </div>
                    )}
              
                    {/* Comments */}
                    <div className="space-y-4 p-4">
                {selectedImage.comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <MessageSquare className="w-12 h-12 mb-2" />
                          <p className="text-sm font-medium">No comments yet</p>
                          <p className="text-xs">Be the first to comment on this photo</p>
                  </div>
                ) : (
                  selectedImage.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                            <div className="flex items-start space-x-3">
                              <div className="profile-avatar h-8 w-8 flex items-center justify-center rounded-full bg-[#4285F4]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div>
                                  <p className="text-sm">
                                    <span className="font-semibold">{comment.user?.name || `User ${comment.user_id}`}</span>{' '}
                                    {comment.content}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <p className="text-xs text-gray-500">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </p>
                            <button
                                      onClick={() => handleLikeComment(comment.id)}
                                      className="text-xs flex items-center hover:text-blue-500 transition-colors"
                                    >
                                      <ThumbsUp 
                                        className={`w-4 h-4 ${
                                          userLikes[`comment-${comment.id}`] 
                                            ? 'fill-blue-500 text-blue-500' 
                                            : 'text-gray-700'
                                        }`}
                                        strokeWidth={userLikes[`comment-${comment.id}`] ? 2 : 1.5}
                                      />
                                      <span className="ml-1">{comment.likes_count}</span>
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                                      className="text-xs text-gray-700 hover:text-gray-900"
                            >
                              Reply
                            </button>
                                  </div>
                          </div>
                          
                          {/* Replies */}
                              {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start space-x-3 mt-2 ml-6">
                                    <div className="profile-avatar h-6 w-6 flex items-center justify-center rounded-full bg-[#4285F4]">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        <span className="font-semibold">{reply.user?.name || `User ${reply.user_id}`}</span>{' '}
                                        {reply.content}
                                      </p>
                                      <div className="flex items-center space-x-4 mt-1">
                                        <p className="text-xs text-gray-500">
                                          {new Date(reply.created_at).toLocaleDateString()}
                                        </p>
                                    <button
                                          onClick={() => handleLikeReply(reply.id)}
                                          className="text-xs flex items-center hover:text-blue-500 transition-colors"
                                        >
                                          <ThumbsUp 
                                            className={`w-4 h-4 ${
                                              userLikes[`reply-${reply.id}`] 
                                                ? 'fill-blue-500 text-blue-500' 
                                                : 'text-gray-700'
                                            }`}
                                            strokeWidth={userLikes[`reply-${reply.id}`] ? 2 : 1.5}
                                          />
                                          <span className="ml-1">{reply.likes_count}</span>
                                    </button>
                                  </div>
                                </div>
                            </div>
                                ))}
                          
                                {/* Reply Input */}
                          {replyingTo === comment.id && (
                                  <div className="mt-2 ml-6">
                                    <div className="flex items-center space-x-2 relative">
                                      <div className="flex-1 flex items-center bg-gray-100 rounded-full">
                                        <Input
                                          value={newReply}
                                          onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Write a reply..."
                                          className="flex-1 text-sm border-none bg-transparent focus-visible:ring-0"
                                        />
                                        <button
                                          onClick={() => setShowReplyEmoji(true)}
                                          className="p-2 hover:text-blue-500"
                                        >
                                          <Smile className="w-5 h-5" />
                                        </button>
                                      </div>
                              <Button
                                size="sm"
                                        variant="ghost"
                                        onClick={() => handleAddReply(comment.id)}
                                        disabled={!newReply.trim()}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                                      {showReplyEmoji && (
                                        <div
                                          ref={replyEmojiPickerRef}
                                          className="absolute bottom-full right-0 mb-2"
                                        >
                                          <EmojiPicker onEmojiClick={onReplyEmojiClick} />
                                        </div>
                                      )}
                                    </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                    </div>
              </div>
              
                  {/* Actions Bar */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-4 mb-3">
                  <button 
                    onClick={() => handleLikeImage(selectedImage.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            userLikes[`image-${selectedImage.id}`] ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                  </button>
                      <button className="hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-6 w-6" />
                      </button>
                  <button 
                        onClick={() => handleShare(selectedImage.image_url)}
                        className="hover:text-green-500 transition-colors"
                  >
                        <Share2 className="h-6 w-6" />
                  </button>
                    </div>
                    <p className="font-semibold text-sm mb-2">{selectedImage.likes_count} likes</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedImage.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Add Comment */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2 relative">
                      <div className="flex-1 flex items-center bg-gray-100 rounded-full">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 text-sm border-none bg-transparent focus-visible:ring-0"
                        />
                        <button
                          onClick={() => setShowCommentEmoji(true)}
                          className="p-2 hover:text-blue-500"
                        >
                          <Smile className="w-5 h-5" />
                      </button>
                      </div>
                          <Button 
                        variant="ghost"
                        onClick={() => handleAddComment(selectedImage.id)}
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-4 h-4" />
                          </Button>
                      {showCommentEmoji && (
                        <div
                          ref={commentEmojiPickerRef}
                          className="absolute bottom-full right-0 mb-2"
                        >
                          <EmojiPicker onEmojiClick={onCommentEmojiClick} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Photo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly />
                          <Button 
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copied!",
                    description: "Link copied to clipboard",
                  });
                }}
              >
                Copy
                          </Button>
            </div>
                          
            <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank')}
                          >
                WhatsApp
                          </Button>
                          <Button 
                            variant="outline" 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                          >
                Facebook
                          </Button>
                      <Button 
                        variant="outline" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')}
              >
                Twitter
                      </Button>
                      <Button 
                variant="outline"
                onClick={() => window.open(`https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                      >
                Telegram
                      </Button>
                    </div>
                  </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Upload Photo</h2>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image">Choose Image</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input 
                  type="file"
                  id="image-upload"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload"
                  className="w-full h-full cursor-pointer"
                >
                  {uploadedImage ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setUploadedImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 rounded-full bg-gray-100">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drag & drop an image here
                        </p>
                        <p className="text-xs text-gray-500">
                          or click to select from your computer
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <div className="relative">
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="pr-10"
                />
                <button
                  onClick={() => setShowEmojiPicker(true)}
                  className="absolute right-2 top-2 p-1 rounded hover:bg-gray-100"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute right-0 top-full mt-2 z-50"
                  >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4" />
                  {isGettingLocation ? 'Getting...' : 'My Location'}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsUploadDialogOpen(false);
                resetUploadForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isSubmitting || !uploadedImage}
            >
              {isSubmitting ? 'Uploading...' : 'Share'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Story Viewer Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-black">
          <div className="relative h-[80vh]">
            {/* Story Content */}
            {selectedStory && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={`${API_URL}${selectedStory.media_url}`}
                  alt="Story"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {/* Story Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center space-x-3">
                <div className="profile-avatar h-8 w-8 flex items-center justify-center rounded-full bg-[#4285F4]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                  </svg>
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm">{selectedStory?.user?.name}</p>
                  <p className="text-xs opacity-75">
                    {selectedStory && new Date(selectedStory.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white space-x-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{selectedStory?.views_count || 0}</span>
                </div>
                {selectedStory?.user_id === Number(user?.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => selectedStory && handleStoryDelete(selectedStory.id)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setStoryIndex(Math.max(0, storyIndex - 1))}
                disabled={storyIndex === 0}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setStoryIndex(Math.min(stories.length - 1, storyIndex + 1))}
                disabled={storyIndex === stories.length - 1}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TravelistaLayout>
  );
};

export default Gallery;