import React from 'react';
import { motion } from 'framer-motion';

const ValueCard = ({ value, index }) => {
  const { icon: Icon, title, description, color } = value;

  const getColorClass = (colorName) => {
    const colors = {
      'cyber-blue': 'text-cyber-blue border-cyber-blue/30 hover:border-cyber-blue/50',
      'cyber-purple': 'text-cyber-purple border-cyber-purple/30 hover:border-cyber-purple/50',
      'cyber-pink': 'text-cyber-pink border-cyber-pink/30 hover:border-cyber-pink/50',
      'cyber-green': 'text-cyber-green border-cyber-green/30 hover:border-cyber-green/50',
    };
    return colors[colorName] || colors['cyber-blue'];
  };

  const getGradientClass = (colorName) => {
    const gradients = {
      'cyber-blue': 'from-cyber-blue to-cyber-purple',
      'cyber-purple': 'from-cyber-purple to-cyber-pink',
      'cyber-pink': 'from-cyber-pink to-cyber-orange',
      'cyber-green': 'from-cyber-green to-cyber-blue',
    };
    return gradients[colorName] || gradients['cyber-blue'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 90 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className="group perspective-1000"
    >
      <motion.div
        className={`relative glass-effect rounded-2xl p-8 border ${getColorClass(color)} hover:shadow-2xl hover:shadow-${color}/10 transition-all duration-500 overflow-hidden h-full`}
        whileHover={{
          y: -15,
          rotateX: 5,
          rotateY: 5,
          scale: 1.02,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scale: 0.5, rotate: -180 }}
          whileHover={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Icon with 3D effect */}
        <motion.div
          className="relative mb-6"
          whileHover={{ 
            rotateY: 180,
            scale: 1.1,
          }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front side */}
          <motion.div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradientClass(color)} p-0.5 group-hover:shadow-lg shadow-${color}/20 transition-shadow duration-300`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full bg-cyber-dark rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Back side */}
          <motion.div
            className={`absolute inset-0 w-16 h-16 rounded-xl bg-gradient-to-br ${getGradientClass(color)} p-0.5`}
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="w-full h-full bg-dark-card rounded-xl flex items-center justify-center">
              <Icon className={`w-8 h-8 ${getColorClass(color).split(' ')[0]}`} />
            </div>
          </motion.div>

          {/* Floating particles around icon */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 bg-${color} rounded-full opacity-0 group-hover:opacity-100`}
                style={{
                  left: `${30 + Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                  top: `${30 + Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            className="text-xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-text-secondary leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Animated border lines */}
        <motion.div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          className={`absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <motion.div
          className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleY: 0 }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />

        <motion.div
          className={`absolute bottom-0 left-0 w-1 h-full bg-gradient-to-b ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleY: 0 }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        {/* 3D depth indicator */}
        <motion.div
          className={`absolute -bottom-2 -right-2 w-full h-full border-2 border-${color}/10 rounded-2xl -z-10`}
          style={{ 
            transform: "translateZ(-10px)",
            transformStyle: "preserve-3d",
          }}
          whileHover={{
            transform: "translateZ(-20px)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Corner decorative elements */}
        <motion.div
          className={`absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-${color}/30 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.3, rotate: 90 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className={`absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-${color}/30 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.3, rotate: -90 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ValueCard;
