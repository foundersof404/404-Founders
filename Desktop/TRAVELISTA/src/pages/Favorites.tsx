import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import TravelistaLayout from '@/components/TravelistaLayout';

interface WishlistItem {
  name: string;
  image: string;
  link: string;
  price: number;
  salePrice?: number;
}

const Favorites: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (link: string) => {
    const updatedWishlist = wishlist.filter(item => item.link !== link);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-gray-500">
              Start adding items to your wishlist to see them here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Wishlist</h1>
          <p className="mt-2 text-sm text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                {...item}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites; 