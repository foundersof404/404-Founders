import React from 'react';
import GalleryUpload from '@/components/GalleryUpload';

const GalleryUploadPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Upload to Gallery</h1>
      <GalleryUpload />
    </div>
  );
};

export default GalleryUploadPage; 