import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Web', 'Mobile', 'AI', 'Systems', 'Academic'];

  const projects = [
    {
      id: 1,
      title: 'EcoTrack Web Platform',
      subtitle: 'Environmental Monitoring Dashboard',
      description: 'A comprehensive web application for tracking environmental metrics with real-time data visualization and reporting capabilities.',
      fullDescription: 'EcoTrack is a full-stack web application built with React and Node.js that helps organizations monitor their environmental impact. Features include real-time data dashboards, automated reporting, predictive analytics, and integration with IoT sensors.',
      category: 'Web',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'Socket.io'],
      features: [
        'Real-time data visualization',
        'Automated report generation',
        'IoT sensor integration',
        'Predictive analytics',
        'Multi-tenant architecture',
        'Mobile responsive design'
      ],
      links: {
        live: 'https://ecotrack-demo.com',
        github: 'https://github.com/founders404/ecotrack',
      },
      status: 'Completed',
      color: 'cyber-blue',
      gradient: 'from-cyber-blue to-cyber-purple',
    },
    {
      id: 2,
      title: 'HealthSync Mobile App',
      subtitle: 'Personal Health Management',
      description: 'Cross-platform mobile application for personal health tracking with AI-powered insights and doctor connectivity.',
      fullDescription: 'HealthSync is a React Native mobile app that revolutionizes personal health management. It includes symptom tracking, medication reminders, AI health insights, telemedicine integration, and secure health record storage.',
      category: 'Mobile',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      technologies: ['React Native', 'Firebase', 'Python', 'TensorFlow', 'AWS'],
      features: [
        'Symptom tracking and analysis',
        'Medication reminders',
        'AI health insights',
        'Doctor appointment scheduling',
        'Secure data encryption',
        'Wearable device integration'
      ],
      links: {
        live: 'https://healthsync-app.com',
        github: 'https://github.com/founders404/healthsync',
      },
      status: 'In Development',
      color: 'cyber-purple',
      gradient: 'from-cyber-purple to-cyber-pink',
    },
    {
      id: 3,
      title: 'SmartPredict AI',
      subtitle: 'Predictive Analytics Platform',
      description: 'AI-powered platform for business forecasting and predictive analytics with machine learning models and automated insights.',
      fullDescription: 'SmartPredict AI leverages advanced machine learning algorithms to provide businesses with accurate forecasting and predictive insights. The platform includes automated model training, data preprocessing, and visualization tools.',
      category: 'AI',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      technologies: ['Python', 'TensorFlow', 'React', 'Docker', 'AWS SageMaker'],
      features: [
        'Automated ML model training',
        'Real-time predictions',
        'Data preprocessing tools',
        'Interactive dashboards',
        'API integration',
        'Custom model deployment'
      ],
      links: {
        live: 'https://smartpredict-ai.com',
        github: 'https://github.com/founders404/smartpredict',
      },
      status: 'Completed',
      color: 'cyber-pink',
      gradient: 'from-cyber-pink to-cyber-orange',
    },
    {
      id: 4,
      title: 'UniConnect Platform',
      subtitle: 'Student Academic Hub',
      description: 'Comprehensive platform for university students to manage projects, collaborate, and access academic resources.',
      fullDescription: 'UniConnect is a web-based platform designed specifically for university students and faculty. It provides project management tools, collaboration features, resource sharing, and academic progress tracking.',
      category: 'Academic',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'NextAuth', 'Tailwind'],
      features: [
        'Project management tools',
        'Real-time collaboration',
        'Resource library',
        'Grade tracking',
        'Assignment submission',
        'Faculty communication'
      ],
      links: {
        live: 'https://uniconnect-platform.com',
        github: 'https://github.com/founders404/uniconnect',
      },
      status: 'Completed',
      color: 'cyber-green',
      gradient: 'from-cyber-green to-cyber-blue',
    },
    {
      id: 5,
      title: 'CloudSync Enterprise',
      subtitle: 'Cloud Infrastructure Management',
      description: 'Enterprise-grade cloud management system for automated deployment, scaling, and monitoring of distributed applications.',
      fullDescription: 'CloudSync Enterprise is a comprehensive cloud management platform that simplifies the deployment and management of cloud infrastructure. It features automated scaling, monitoring, cost optimization, and multi-cloud support.',
      category: 'Systems',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      technologies: ['Go', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus'],
      features: [
        'Multi-cloud deployment',
        'Automated scaling',
        'Cost optimization',
        'Real-time monitoring',
        'Security compliance',
        'Infrastructure as Code'
      ],
      links: {
        live: 'https://cloudsync-enterprise.com',
        github: 'https://github.com/founders404/cloudsync',
      },
      status: 'In Development',
      color: 'cyber-orange',
      gradient: 'from-cyber-orange to-cyber-purple',
    },
    {
      id: 6,
      title: 'RetailFlow Web App',
      subtitle: 'E-commerce Management System',
      description: 'Modern e-commerce platform with inventory management, analytics, and customer engagement tools.',
      fullDescription: 'RetailFlow is a complete e-commerce solution that provides businesses with tools to manage their online presence, inventory, customers, and sales. Features advanced analytics and AI-powered recommendations.',
      category: 'Web',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Stripe', 'Redis'],
      features: [
        'Product catalog management',
        'Order processing',
        'Payment integration',
        'Customer analytics',
        'Inventory tracking',
        'SEO optimization'
      ],
      links: {
        live: 'https://retailflow-demo.com',
        github: 'https://github.com/founders404/retailflow',
      },
      status: 'Completed',
      color: 'cyber-blue',
      gradient: 'from-cyber-blue to-cyber-green',
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
              <span className="inline-block px-4 py-2 bg-cyber-green/10 border border-cyber-green/20 rounded-full text-cyber-green text-sm font-medium mb-4">
                🚀 Our Portfolio
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-cyber font-bold mb-6 leading-tight"
            >
              <span className="text-white">Showcasing Our </span>
              <span className="text-gradient">Digital Creations</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Explore our diverse portfolio of web applications, mobile apps, AI solutions, 
              and enterprise systems. Each project represents our commitment to innovation 
              and technical excellence.
            </motion.p>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-24 h-24 border border-cyber-green/20 rounded-lg"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-16 h-16 border border-cyber-pink/20 rounded-full"
            animate={{
              rotate: -360,
              y: [0, -15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8"
          >
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-cyber-blue" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/25'
                        : 'bg-dark-card text-text-secondary hover:text-white hover:bg-cyber-blue/20 border border-dark-border hover:border-cyber-blue/30'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-dark-card border border-dark-border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue/50 focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchTerm}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-dark-card rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Projects Found</h3>
              <p className="text-text-secondary mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <motion.button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="cyber-button px-6 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-cyber-purple/5 to-cyber-pink/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '25+', label: 'Projects Delivered' },
              { number: '100%', label: 'Client Satisfaction' },
              { number: '15+', label: 'Technologies Used' },
              { number: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
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

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Portfolio;
