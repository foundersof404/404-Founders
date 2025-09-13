import React from 'react';
import { motion } from 'framer-motion';

const ContactInfo = ({ info, index }) => {
  const { icon: Icon, label, value, href, color } = info;

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

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, x: -30, rotateY: 45 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="group perspective-1000"
    >
      <motion.div
        className={`relative glass-effect rounded-lg p-6 border ${getColorClass(color)} hover:shadow-lg transition-all duration-500 overflow-hidden`}
        whileHover={{
          y: -5,
          scale: 1.02,
          rotateX: 5,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scale: 0.8, rotate: -45 }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative z-10 flex items-start space-x-4">
          {/* Icon */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ 
              scale: 1.1,
              rotateZ: 10,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradientClass(color)} p-0.5 group-hover:shadow-lg transition-shadow duration-300`}>
              <div className="w-full h-full bg-cyber-dark rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Pulsing ring effect */}
            <motion.div
              className={`absolute inset-0 w-12 h-12 rounded-lg border-2 border-${color} opacity-0 group-hover:opacity-50`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h3
              className="text-white font-semibold mb-1 group-hover:text-gradient transition-all duration-300"
              whileHover={{ x: 2 }}
            >
              {label}
            </motion.h3>
            <motion.p
              className="text-text-secondary text-sm break-words group-hover:text-gray-300 transition-colors duration-300"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {value}
            </motion.p>
          </div>

          {/* Hover indicator */}
          {href && (
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </div>

        {/* Animated border effect */}
        <motion.div
          className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          className={`absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r ${getGradientClass(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Corner decorations */}
        <motion.div
          className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.2, rotate: 45 }}
        />

        <motion.div
          className={`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.2, rotate: -45 }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-${color} rounded-full opacity-0 group-hover:opacity-100`}
              style={{
                left: `${30 + i * 20}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, Math.cos(i) * 5, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* 3D depth effect */}
        <motion.div
          className={`absolute -bottom-1 -right-1 w-full h-full border-2 border-${color}/10 rounded-lg -z-10`}
          style={{ 
            transform: "translateZ(-5px)",
            transformStyle: "preserve-3d",
          }}
          whileHover={{
            transform: "translateZ(-10px)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );

  // Wrap with link if href is provided
  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {cardContent}
      </motion.a>
    );
  }

  return cardContent;
};

export default ContactInfo;
