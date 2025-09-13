import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Eye } from 'lucide-react';

const ProjectCard = ({ project, index, onSelect }) => {
  const {
    title,
    subtitle,
    description,
    image,
    technologies,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateY: 45 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="group perspective-1000"
    >
      <motion.div
        className="relative glass-effect rounded-2xl overflow-hidden border border-dark-border hover:border-cyber-blue/30 transition-all duration-500 h-full"
        whileHover={{
          y: -15,
          scale: 1.02,
          rotateX: 5,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          initial={{ scale: 0.8, rotate: -45 }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Image Container */}
        <div className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500"
            whileHover={{ scale: 1.1 }}
          />
          
          {/* Image Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.8 }}
          />

          {/* Category Badge */}
          <motion.div
            className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1 glass-effect rounded-full text-sm font-medium text-white border border-white/20"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {status}
          </motion.div>

          {/* Hover Action Buttons */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <motion.button
              onClick={onSelect}
              className="w-12 h-12 bg-cyber-blue/90 rounded-full flex items-center justify-center text-white hover:bg-cyber-blue transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={20} />
            </motion.button>
            
            {links?.live && (
              <motion.a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-cyber-purple/90 rounded-full flex items-center justify-center text-white hover:bg-cyber-purple transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
            
            {links?.github && (
              <motion.a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-cyber-pink/90 rounded-full flex items-center justify-center text-white hover:bg-cyber-pink transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={20} />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          <motion.h3
            className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300 line-clamp-1"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className={`text-sm font-medium mb-3 ${color === 'cyber-blue' ? 'text-cyber-blue' : `text-${color}`}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.p
            className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {description}
          </motion.p>

          {/* Technologies */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + techIndex * 0.1 + 0.5,
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`px-2 py-1 bg-dark-card border border-${color}/20 text-${color} text-xs rounded-md hover:border-${color}/40 hover:bg-${color}/10 transition-all duration-300`}
                >
                  {tech}
                </motion.span>
              ))}
              {technologies.length > 4 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.9 }}
                  className="px-2 py-1 bg-dark-card border border-gray-600 text-text-secondary text-xs rounded-md"
                >
                  +{technologies.length - 4} more
                </motion.span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={onSelect}
            className={`cyber-button w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Details</span>
            <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-${color} rounded-full opacity-0 group-hover:opacity-100`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.cos(i) * 10, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Corner accents */}
          <motion.div
            className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
            whileHover={{ scale: 1.2 }}
          />
          
          <motion.div
            className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
            whileHover={{ scale: 1.2 }}
          />
        </div>

        {/* 3D Depth Effect */}
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

        {/* Glow effect on hover */}
        <motion.div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-${color}/20 -z-20`}
          whileHover={{ scale: 1.1 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
