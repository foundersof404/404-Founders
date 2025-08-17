import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Product {
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

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const QuickView: React.FC<QuickViewProps> = ({ isOpen, onClose, product }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: product.link
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div>
                      {product.category && (
                        <span className="text-sm text-gray-500 mb-2 block">
                          {product.category}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {product.name}
                      </h2>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {product.reviewCount && (
                            <span className="text-sm text-gray-500">
                              ({product.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-green-600">
                          {product.salePrice && product.salePrice < product.price
                            ? formatCurrency(product.salePrice)
                            : formatCurrency(product.price)}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {product.description && (
                        <p className="text-gray-600 mb-6">
                          {product.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                          View on Amazon
                        </a>
                        <button
                          onClick={handleShare}
                          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickView; 