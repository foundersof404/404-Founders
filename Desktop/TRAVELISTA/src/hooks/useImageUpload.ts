import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface UploadImageParams {
  file: File;
  location: string;
  userId: string;
  userName: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async ({ file, location, userId, userName }: UploadImageParams) => {
    setIsUploading(true);
    setError(null);

    try {
      // Create a unique file name
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `gallery/${fileName}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add the image metadata to Firestore
      const galleryRef = collection(db, 'gallery');
      await addDoc(galleryRef, {
        imageUrl: downloadURL,
        location,
        userId,
        userName,
        timestamp: serverTimestamp(),
        likes: 0,
        fileName
      });

      return downloadURL;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error
  };
};

export default useImageUpload; 