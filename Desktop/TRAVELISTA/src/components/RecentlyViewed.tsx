import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  name: string;
  image: string;
  link: string;
  price: number;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
}

const RecentlyViewed: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(viewed);
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {recentProducts.map((product, index) => (
          <ProductCard
            key={`${product.link}-${index}`}
            {...product}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default RecentlyViewed; 