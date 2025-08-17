import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareButtonProps {
  imageUrl: string;
  location: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({ imageUrl, location }) => {
  const handleShare = () => {
    const text = `Check out this beautiful photo from ${location}:`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <Button variant="ghost" className="mt-2 text-white hover:text-blue-400" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
};

export default SocialShareButton;
