import { motion } from 'framer-motion';
import React from 'react';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children, delay = 0, y = 30 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay }}
  >
    {children}
  </motion.div>
);

export default FadeInOnScroll; 