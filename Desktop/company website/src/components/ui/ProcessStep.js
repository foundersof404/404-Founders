import React from 'react';
import { motion } from 'framer-motion';
import { Search, Palette, Code, Rocket } from 'lucide-react';

const ProcessStep = ({ step, index }) => {
  const { step: stepNumber, title, description, icon: iconName, color } = step;

  const getIcon = (iconName) => {
    const icons = {
      Search,
      Palette,
      Code,
      Rocket,
    };
    return icons[iconName] || Search;
  };

  const Icon = getIcon(iconName);

  const getColorClass = (colorName) => {
    const colors = {
      'cyber-blue': 'text-cyber-blue',
      'cyber-purple': 'text-cyber-purple',
      'cyber-pink': 'text-cyber-pink',
      'cyber-green': 'text-cyber-green',
      'cyber-orange': 'text-cyber-orange',
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
      initial={{ opacity: 0, y: 100, rotateY: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className="group perspective-1000"
    >
      <motion.div
        className="relative glass-effect rounded-2xl p-8 border border-dark-border hover:border-cyber-blue/30 transition-all duration-500 overflow-hidden h-full"
        whileHover={{
          y: -15,
          rotateX: 10,
          scale: 1.02,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scale: 0.8, rotate: -90 }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Step Number */}
        <motion.div
          className="relative mb-6"
          whileHover={{ 
            scale: 1.1,
            rotateZ: 5,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClass(color)} p-0.5 group-hover:shadow-lg transition-shadow duration-300`}>
            <div className="w-full h-full bg-cyber-dark rounded-2xl flex items-center justify-center">
              <span className={`text-2xl font-cyber font-bold ${getColorClass(color)}`}>
                {stepNumber}
              </span>
            </div>
          </div>

          {/* Pulsing ring */}
          <motion.div
            className={`absolute inset-0 w-16 h-16 rounded-2xl border-2 border-${color} opacity-0 group-hover:opacity-50`}
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

          {/* Orbiting particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 bg-${color} rounded-full opacity-0 group-hover:opacity-100`}
                style={{
                  left: `${32 + Math.cos(i * 90 * Math.PI / 180) * 25}px`,
                  top: `${32 + Math.sin(i * 90 * Math.PI / 180) * 25}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5 + index * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Icon */}
        <motion.div
          className="mb-6"
          whileHover={{ 
            scale: 1.1,
            rotateY: 15,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`w-12 h-12 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center group-hover:bg-${color}/20 group-hover:border-${color}/40 transition-all duration-300`}>
            <Icon className={`w-6 h-6 ${getColorClass(color)}`} />
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

        {/* Progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{
            duration: 1,
            delay: index * 0.2 + 0.5,
          }}
          viewport={{ once: true }}
        >
          <div className={`h-full bg-gradient-to-r ${getGradientClass(color)}`} />
        </motion.div>

        {/* Connection line to next step */}
        {index < 3 && (
          <motion.div
            className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyber-blue to-transparent opacity-30"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{
              duration: 1,
              delay: index * 0.2 + 1,
            }}
            viewport={{ once: true }}
          />
        )}

        {/* Floating decorative elements */}
        <motion.div
          className={`absolute top-4 right-4 w-6 h-6 border border-${color}/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className={`absolute bottom-4 left-4 w-4 h-4 bg-${color}/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          animate={{
            rotate: -360,
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* 3D depth shadow */}
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

        {/* Corner accents */}
        <motion.div
          className={`absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-${color}/20 group-hover:border-${color}/50 transition-colors duration-300`}
          whileHover={{ scale: 1.2, rotate: 90 }}
        />
        
        <motion.div
          className={`absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-${color}/20 group-hover:border-${color}/50 transition-colors duration-300`}
          whileHover={{ scale: 1.2, rotate: -90 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProcessStep;
