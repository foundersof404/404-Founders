import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { searchProducts } from '../lib/amazonApi';

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

interface SimilarProductsProps {
  currentProduct: Product;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProduct }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const data = await searchProducts({
          query: currentProduct.name,
          page: '1',
          country: 'US'
        });

        const products = data?.data?.products || [];
        
        // Filter out the current product and limit to 5 similar products
        const similar = products
          .filter((product: Product) => product.link !== currentProduct.link)
          .slice(0, 5);

        setSimilarProducts(similar);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <section className="my-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 rounded-lg h-64"
            />
          ))}
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) return null;

  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {similarProducts.map((product, index) => (
          <ProductCard
            key={`${product.link}-${index}`}
            {...product}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default SimilarProducts; 