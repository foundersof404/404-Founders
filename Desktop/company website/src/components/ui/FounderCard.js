import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const FounderCard = ({ founder, index }) => {
  const { name, role, bio, image, skills, socialLinks, color } = founder;

  const getColorClass = (colorName) => {
    const colors = {
      'cyber-blue': 'text-cyber-blue border-cyber-blue/30 hover:border-cyber-blue/50',
      'cyber-purple': 'text-cyber-purple border-cyber-purple/30 hover:border-cyber-purple/50',
      'cyber-pink': 'text-cyber-pink border-cyber-pink/30 hover:border-cyber-pink/50',
      'cyber-green': 'text-cyber-green border-cyber-green/30 hover:border-cyber-green/50',
    };
    return colors[colorName] || colors['cyber-blue'];
  };

  const getGlowClass = (colorName) => {
    const glows = {
      'cyber-blue': 'hover:shadow-cyber-blue/20',
      'cyber-purple': 'hover:shadow-cyber-purple/20',
      'cyber-pink': 'hover:shadow-cyber-pink/20',
      'cyber-green': 'hover:shadow-cyber-green/20',
    };
    return glows[colorName] || glows['cyber-blue'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div
        className={`relative glass-effect rounded-2xl p-8 border ${getColorClass(color)} ${getGlowClass(color)} hover:shadow-2xl transition-all duration-500 overflow-hidden h-full`}
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
        />

        {/* Profile Image */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-${color}/30 group-hover:border-${color}/60 transition-colors duration-300`}>
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Glowing ring effect */}
          <motion.div
            className={`absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-${color} opacity-0 group-hover:opacity-50`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Name and Role */}
        <div className="text-center mb-4">
          <motion.h3
            className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {name}
          </motion.h3>
          <p className={`${getColorClass(color).split(' ')[0]} font-medium`}>
            {role}
          </p>
        </div>

        {/* Bio */}
        <motion.p
          className="text-text-secondary text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {bio}
        </motion.p>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-semibold mb-3">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, skillIndex) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.2 + skillIndex * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`px-3 py-1 bg-dark-card border border-${color}/20 text-${color} text-xs rounded-full hover:border-${color}/40 hover:bg-${color}/10 transition-all duration-300`}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4">
          {[
            { icon: Github, key: 'github', href: socialLinks.github },
            { icon: Linkedin, key: 'linkedin', href: socialLinks.linkedin },
            { icon: Twitter, key: 'twitter', href: socialLinks.twitter },
          ].map(({ icon: Icon, key, href }) => (
            <motion.a
              key={key}
              href={href}
              className={`w-10 h-10 bg-dark-card border border-${color}/20 rounded-lg flex items-center justify-center text-text-secondary hover:text-${color} hover:border-${color}/40 hover:bg-${color}/10 transition-all duration-300`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-${color} rounded-full opacity-0 group-hover:opacity-100`}
              style={{
                left: `${i * 8}px`,
                top: `${i * 8}px`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Corner accents */}
        <motion.div
          className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.2 }}
        />
        
        <motion.div
          className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-${color}/20 group-hover:border-${color}/60 transition-colors duration-300`}
          whileHover={{ scale: 1.2 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FounderCard;
