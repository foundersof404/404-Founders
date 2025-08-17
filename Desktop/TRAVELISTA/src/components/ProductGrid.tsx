import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  product_title: string;
  product_photo: string;
  product_url: string;
  product_price?: string;
  product_discount?: string;
}

interface ProductGridProps {
  products: Product[];
  onLoadMore: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onLoadMore }) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="my-8 px-4 max-w-7xl mx-auto">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product, index) => {
          if (!product.product_title || !product.product_url || !product.product_photo) {
            return null;
          }

          // Extract price from the product_price string
          const priceString = product.product_price || '0';
          const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));

          // Extract discount price if available
          const discountString = product.product_discount || null;
          const salePrice = discountString 
            ? parseFloat(discountString.replace(/[^0-9.]/g, '')) 
            : undefined;

          return (
            <ProductCard
              key={`${product.product_url}-${index}`}
              name={product.product_title}
              image={product.product_photo}
              link={product.product_url}
              price={price}
              salePrice={salePrice}
            />
          );
        })}
      </motion.div>

      <div className="flex justify-center mt-10">
        <motion.button
          onClick={onLoadMore}
          className="bg-white border border-border px-6 py-3 rounded-full text-foreground font-medium shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ y: 0 }}
        >
          Load More Products
        </motion.button>
      </div>
    </div>
  );
};

export default ProductGrid;
