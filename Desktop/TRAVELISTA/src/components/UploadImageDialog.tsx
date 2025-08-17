import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase-config';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface UploadImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialFiles?: File[];
}

const UploadImageDialog = ({ isOpen, onClose, onSuccess, initialFiles = [] }: UploadImageDialogProps) => {
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle initialFiles from drag and drop
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      handleFileSelection(initialFiles[0]);
    }
    
    // Cleanup function
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFile(null);
      setUploadError(null);
    };
  }, [initialFiles]);

  const handleFileSelection = (file: File) => {
    // Reset any previous errors
    setUploadError(null);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !location.trim() || !user) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a location",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Create a unique filename with timestamp to avoid conflicts
      const timestamp = new Date().getTime();
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${timestamp}-${user.id}.${fileExtension}`;
      const storageRef = ref(storage, `gallery/${fileName}`);
      
      console.log("Starting upload:", fileName);
      
      // Add metadata for better caching and performance
      const metadata = {
        contentType: selectedFile.type,
        customMetadata: {
          userId: user.id,
          location: location.trim(),
          timestamp: timestamp.toString()
        }
      };

      // Upload file with metadata
      const snapshot = await uploadBytes(storageRef, selectedFile, metadata);
      console.log("Upload completed:", snapshot);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", downloadURL);
      
      // Add to Firestore
      await addDoc(collection(db, 'gallery'), {
        imageUrl: downloadURL,
        location: location.trim(),
        userName: user.name || 'Anonymous',
        userId: user.id,
        timestamp: serverTimestamp()
      });
      
      console.log("Firestore document created");
      
      setUploading(false);
      resetForm();
      onSuccess();
      onClose();
      
      toast({
        title: "Upload successful",
        description: "Your image has been added to the gallery",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      setUploading(false);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setLocation('');
    setUploadProgress(0);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload a Travel Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors 
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'} 
              ${preview ? 'bg-gray-50' : ''}
              ${uploadError ? 'border-red-300' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Where was this photo taken?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={uploading}
            />
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <p><strong>Error:</strong> {uploadError}</p>
              <p className="text-xs mt-1">Please try again or use a different image.</p>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={uploading}
            className="sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={!selectedFile || !location.trim() || uploading}
            className="sm:order-2"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageDialog;