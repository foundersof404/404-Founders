import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Share2, Eye } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import QuickView from './QuickView';

interface ProductCardProps {
  name: string;
  image: string;
  link: string;
  price: number;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  image, 
  link, 
  price, 
  salePrice,
  rating,
  reviewCount,
  category,
  description
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Calculate discount percentage if available
  const discountPercentage = salePrice && price > salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : null;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out this product: ${name}`,
          url: link
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <div
      className="bg-white border border-black/10 rounded-lg shadow-sm hover:shadow-md hover:border-black/30 transition-all duration-200 flex flex-col items-center p-4 w-full max-w-xs mx-auto"
      style={{ minWidth: 0 }}
    >
      <div className="w-full aspect-square flex items-center justify-center mb-3 overflow-hidden rounded">
        <img
          src={image}
          alt={name}
          className="object-contain w-full h-full max-h-40"
          loading="lazy"
        />
      </div>
      <div className="w-full flex-1 flex flex-col justify-between">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 text-black min-h-[2.5em]">{name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-base text-black">{salePrice && salePrice < price ? formatCurrency(salePrice) : formatCurrency(price)}</span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-900 transition-colors ml-2 whitespace-nowrap"
          >
            View on Amazon
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
