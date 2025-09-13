import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatsCounter = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        let current = 0;
        const increment = stat.number / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            setCount(stat.number);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 30);

        return () => clearInterval(timer);
      }, index * 200);

      return () => clearTimeout(timer);
    }
  }, [inView, stat.number, index]);

  const getColorClass = (color) => {
    const colors = {
      'cyber-blue': 'text-cyber-blue',
      'cyber-purple': 'text-cyber-purple',
      'cyber-pink': 'text-cyber-pink',
      'cyber-green': 'text-cyber-green',
      'cyber-orange': 'text-cyber-orange',
    };
    return colors[color] || 'text-cyber-blue';
  };

  const getGlowClass = (color) => {
    const glows = {
      'cyber-blue': 'cyber-glow',
      'cyber-purple': 'cyber-glow-purple',
      'cyber-pink': 'cyber-glow-pink',
      'cyber-green': 'cyber-glow',
      'cyber-orange': 'cyber-glow-pink',
    };
    return glows[color] || 'cyber-glow';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="text-center"
    >
      <motion.div
        className={`glass-effect rounded-2xl p-8 ${getGlowClass(stat.color)} hover:scale-105 transition-all duration-300`}
        whileHover={{
          y: -10,
          boxShadow: "0 20px 40px rgba(0, 245, 255, 0.2)",
        }}
      >
        <motion.div
          className={`text-4xl md:text-5xl font-cyber font-bold ${getColorClass(stat.color)} mb-2`}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: index * 0.1 + 0.3,
            type: "spring",
            bounce: 0.6,
          }}
        >
          {count}{stat.suffix}
        </motion.div>
        
        <motion.p
          className="text-text-secondary font-medium"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.6,
            delay: index * 0.1 + 0.6,
          }}
        >
          {stat.label}
        </motion.p>

        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 border-${stat.color}/20`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 1,
            delay: index * 0.1 + 0.4,
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-${stat.color} rounded-full`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: index * 0.2 + i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCounter;
