
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface LoadingPlaceholderProps {
  count?: number;
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="product-card overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
          whileHover={{ 
            y: -8, 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          }}
        >
          <div className="product-image-container shimmer-effect" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded shimmer-effect" />
            <div className="h-4 bg-gray-200 rounded w-3/4 shimmer-effect" />
            <div className="flex items-center gap-2 mt-4">
              <DollarSign className="h-4 w-4 text-gray-300" />
              <div className="h-5 bg-gray-200 rounded w-1/3 shimmer-effect" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingPlaceholder;
