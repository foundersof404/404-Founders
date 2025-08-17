import { motion, AnimatePresence } from 'framer-motion';


interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <>
      
      <motion.div
        initial={{ 
          opacity: 0,
          y: 30,
          scale: 0.98
        }}
        animate={{ 
          opacity: 1,
          y: 0,
          scale: 1
        }}
        exit={{ 
          opacity: 0,
          y: -30,
          scale: 0.98
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 }
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition; 