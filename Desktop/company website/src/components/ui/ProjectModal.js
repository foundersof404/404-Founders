import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Check, Calendar, Tag } from 'lucide-react';

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const {
    title,
    subtitle,
    fullDescription,
    image,
    technologies,
    features,
    category,
    status,
    color,
    gradient,
    links,
  } = project;

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'text-cyber-green bg-cyber-green/10 border-cyber-green/20',
      'In Development': 'text-cyber-orange bg-cyber-orange/10 border-cyber-orange/20',
      'Planning': 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/20',
    };
    return colors[status] || colors['Completed'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web': '🌐',
      'Mobile': '📱',
      'AI': '🤖',
      'Systems': '⚙️',
      'Academic': '🎓',
    };
    return icons[category] || '💻';
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateX: -90,
      transition: {
        duration: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-cyber-dark/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-effect rounded-2xl border border-dark-border"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Background gradient effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl`}
              initial={{ scale: 0.8, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
            />

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-dark-card/80 hover:bg-cyber-blue/20 border border-dark-border hover:border-cyber-blue/30 rounded-full flex items-center justify-center text-text-secondary hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Image and Quick Info */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Project Image */}
                <motion.div
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-${color}/20 via-transparent to-transparent`} />
                </motion.div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={itemVariants}
                    className="glass-effect p-4 rounded-lg border border-dark-border"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className={`w-5 h-5 text-${color}`} />
                      <span className="text-sm font-medium text-white">Category</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{getCategoryIcon(category)}</span>
                      <span className={`text-${color} font-semibold`}>{category}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="glass-effect p-4 rounded-lg border border-dark-border"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className={`w-5 h-5 text-${color}`} />
                      <span className="text-sm font-medium text-white">Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex space-x-4"
                >
                  {links?.live && (
                    <motion.a
                      href={links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cyber-button flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 group`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
                    </motion.a>
                  )}
                  
                  {links?.github && (
                    <motion.a
                      href={links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-button flex-1 flex items-center justify-center space-x-2 py-3 glass-effect border border-dark-border hover:border-cyber-blue/30 text-white font-semibold rounded-lg transition-all duration-300 group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Github size={18} />
                      <span>Source Code</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Column - Detailed Information */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Title and Subtitle */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <h2 className="text-3xl font-cyber font-bold text-white group-hover:text-gradient">
                    {title}
                  </h2>
                  <p className={`text-lg font-medium text-${color}`}>
                    {subtitle}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {fullDescription}
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className={`w-5 h-5 bg-${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-text-secondary text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Technologies */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.7 + index * 0.1,
                        }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className={`px-3 py-2 bg-dark-card border border-${color}/20 text-${color} text-sm rounded-lg hover:border-${color}/40 hover:bg-${color}/10 transition-all duration-300`}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 bg-${color}/30 rounded-full`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.cos(i) * 15, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}

              {/* Corner accents */}
              <motion.div
                className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-${color}/20`}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.div
                className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-${color}/20`}
                animate={{ opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
