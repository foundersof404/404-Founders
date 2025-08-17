import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    title: 'Beautiful Beach',
    description: 'Experience the perfect sunset'
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    title: 'Mountain Adventure',
    description: 'Explore the majestic peaks'
  },
  {
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    title: 'City Life',
    description: 'Discover urban wonders'
  },
  {
    src: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
    title: 'Cultural Heritage',
    description: 'Immerse in local traditions'
  }
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      // Ensure all animations are cleaned up
      const animatedElements = document.querySelectorAll('.motion-element');
      animatedElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden">
      <AnimatePresence mode="wait" onExitComplete={() => {}}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 motion-element"
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-4">{images[currentIndex].title}</h2>
              <p className="text-xl">{images[currentIndex].description}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Gallery; 