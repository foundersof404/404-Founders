import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Code2, Brain, Rocket, Heart } from 'lucide-react';
import FounderCard from '../components/ui/FounderCard';
import ValueCard from '../components/ui/ValueCard';

const About = () => {
  const founders = [
    {
      id: 1,
      name: 'Mohammad Abbas',
      role: 'Full-Stack Developer & Tech Lead',
      bio: 'Expert in modern web technologies and full-stack development. Passionate about creating innovative solutions using cutting-edge technologies and frameworks.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      skills: ['React', 'TypeScript', 'HTML/CSS', 'Python', 'JavaScript', 'Node.js'],
      socialLinks: {
        github: '#',
        linkedin: '#',
        twitter: '#',
      },
      color: 'cyber-blue',
    },
    {
      id: 2,
      name: 'Mohammad Alashkar',
      role: 'Full-Stack Developer & Software Engineer',
      bio: 'Skilled in comprehensive web development and software engineering. Focuses on building scalable applications with modern technologies and best practices.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      skills: ['React', 'TypeScript', 'HTML/CSS', 'Python', 'JavaScript', 'Backend Development'],
      socialLinks: {
        github: '#',
        linkedin: '#',
        twitter: '#',
      },
      color: 'cyber-purple',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To empower businesses and students with cutting-edge technology solutions that drive innovation and success.',
      color: 'cyber-blue',
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading technology partner that transforms ideas into reality through exceptional digital experiences.',
      color: 'cyber-purple',
    },
    {
      icon: Heart,
      title: 'Values',
      description: 'Innovation, quality, collaboration, and continuous learning are at the core of everything we do.',
      color: 'cyber-pink',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every project, delivering solutions that exceed expectations and drive results.',
      color: 'cyber-green',
    },
  ];

  const stats = [
    { number: '50+', label: 'Projects Delivered' },
    { number: '25+', label: 'Happy Clients' },
    { number: '2+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-cyber-purple/10 border border-cyber-purple/20 rounded-full text-cyber-purple text-sm font-medium mb-4">
                💡 Meet the Team
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-cyber font-bold mb-6 leading-tight"
            >
              <span className="text-white">We Are the </span>
              <span className="text-gradient">Founders of 404</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Three passionate developers united by a common goal: to build exceptional 
              digital solutions that make a difference. We combine creativity, technical 
              expertise, and innovation to bring your ideas to life.
            </motion.p>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border border-cyber-blue/20 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-16 h-16 border border-cyber-purple/20 rounded-lg"
            animate={{
              rotate: -360,
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-6">
              Our <span className="text-gradient">Core Principles</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              These fundamental beliefs guide our approach to development and client relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-6">
              Meet Our <span className="text-gradient">Founding Team</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Three dedicated professionals with diverse expertise and a shared passion for innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <FounderCard key={founder.id} founder={founder} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-cyber-purple/5 to-cyber-pink/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-6">
              Our <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-effect rounded-2xl p-8 cyber-glow hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-cyber font-bold text-cyber-blue mb-2">
                    {stat.number}
                  </div>
                  <p className="text-text-secondary">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-8 md:p-12"
            >
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-text-secondary leading-relaxed mb-6">
                  Founded in 2025, <span className="text-cyber-blue font-semibold">Founders of 404</span> emerged 
                  from a simple belief: that exceptional technology should be accessible to everyone. 
                  What started as three developers sharing ideas in a coffee shop has evolved into 
                  a dynamic team dedicated to pushing the boundaries of digital innovation.
                </p>
                
                <p className="text-text-secondary leading-relaxed mb-6">
                  We chose the name "404" not because we're lost, but because we're constantly 
                  exploring uncharted territories in technology. Every "404 Not Found" error 
                  represents an opportunity to create something new, something better, something 
                  that didn't exist before.
                </p>

                <p className="text-text-secondary leading-relaxed mb-6">
                  Our diverse backgrounds in <span className="text-cyber-purple">full-stack development</span>, 
                  <span className="text-cyber-pink"> mobile applications</span>, <span className="text-cyber-green">AI/ML</span>, 
                  and <span className="text-cyber-orange">systems architecture</span> allow us to tackle 
                  complex challenges from multiple angles. We don't just write code – we craft experiences, 
                  solve problems, and build the future.
                </p>

                <div className="flex items-center justify-center mt-8">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-6 h-6 text-cyber-blue" />
                      <span className="text-white font-medium">Innovation</span>
                    </div>
                    <div className="w-1 h-1 bg-cyber-purple rounded-full" />
                    <div className="flex items-center space-x-2">
                      <Brain className="w-6 h-6 text-cyber-purple" />
                      <span className="text-white font-medium">Creativity</span>
                    </div>
                    <div className="w-1 h-1 bg-cyber-pink rounded-full" />
                    <div className="flex items-center space-x-2">
                      <Rocket className="w-6 h-6 text-cyber-pink" />
                      <span className="text-white font-medium">Excellence</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
