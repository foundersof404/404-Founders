import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ui/ServiceCard';
import ProcessStep from '../components/ui/ProcessStep';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Web Application Development',
      subtitle: 'Modern, Scalable Web Solutions',
      description: 'Create powerful web applications using cutting-edge technologies like React, Next.js, and Node.js. From simple websites to complex enterprise applications.',
      features: [
        'Responsive Design',
        'Progressive Web Apps',
        'Real-time Features',
        'API Integration',
        'Database Design',
        'Performance Optimization'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      price: 'Starting at $2,999',
      color: 'cyber-blue',
      gradient: 'from-cyber-blue to-cyber-purple',
      icon: 'Code',
    },
    {
      id: 2,
      title: 'Mobile Application Development',
      subtitle: 'Native & Cross-Platform Apps',
      description: 'Build stunning mobile applications for iOS and Android using React Native, Flutter, or native development. Optimized for performance and user experience.',
      features: [
        'Cross-Platform Development',
        'Native Performance',
        'Push Notifications',
        'Offline Functionality',
        'App Store Deployment',
        'Analytics Integration'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
      price: 'Starting at $4,999',
      color: 'cyber-purple',
      gradient: 'from-cyber-purple to-cyber-pink',
      icon: 'Smartphone',
    },
    {
      id: 3,
      title: 'AI Solutions & Automation',
      subtitle: 'Intelligent Business Automation',
      description: 'Integrate AI and machine learning capabilities into your applications. From chatbots to predictive analytics, make your systems smarter.',
      features: [
        'Machine Learning Models',
        'Natural Language Processing',
        'Computer Vision',
        'Predictive Analytics',
        'Automated Workflows',
        'Data Processing'
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'AWS SageMaker', 'Docker'],
      price: 'Starting at $3,999',
      color: 'cyber-pink',
      gradient: 'from-cyber-pink to-cyber-orange',
      icon: 'Brain',
    },
    {
      id: 4,
      title: 'Senior Projects & Academic Support',
      subtitle: 'Student Project Mentorship',
      description: 'Comprehensive support for computer science students working on capstone projects, thesis work, and complex academic assignments.',
      features: [
        'Project Planning',
        'Technical Mentoring',
        'Code Reviews',
        'Research Assistance',
        'Presentation Support',
        'Documentation Help'
      ],
      technologies: ['Various', 'Research', 'Documentation', 'Git', 'Academic Tools'],
      price: 'Starting at $999',
      color: 'cyber-green',
      gradient: 'from-cyber-green to-cyber-blue',
      icon: 'GraduationCap',
    },
    {
      id: 5,
      title: 'Systems Development',
      subtitle: 'Enterprise & Custom Solutions',
      description: 'Design and develop complex systems, enterprise platforms, and custom software solutions tailored to your specific business needs.',
      features: [
        'System Architecture',
        'Microservices Design',
        'Database Optimization',
        'Security Implementation',
        'Scalability Planning',
        'Integration Services'
      ],
      technologies: ['Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Nginx', 'Jenkins'],
      price: 'Custom Pricing',
      color: 'cyber-orange',
      gradient: 'from-cyber-orange to-cyber-purple',
      icon: 'Settings',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your vision, requirements, and goals. Together, we create a detailed project roadmap.',
      icon: 'Search',
      color: 'cyber-blue',
    },
    {
      step: '02',
      title: 'Design & Architecture',
      description: 'Our team designs the user experience and technical architecture, ensuring scalability and optimal performance.',
      icon: 'Palette',
      color: 'cyber-purple',
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'We build your solution using agile methodologies, with continuous testing and regular progress updates.',
      icon: 'Code',
      color: 'cyber-pink',
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'We deploy your solution and provide ongoing maintenance, updates, and technical support as needed.',
      icon: 'Rocket',
      color: 'cyber-green',
    },
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
              <span className="inline-block px-4 py-2 bg-cyber-blue/10 border border-cyber-blue/20 rounded-full text-cyber-blue text-sm font-medium mb-4">
                🚀 Our Services
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-cyber font-bold mb-6 leading-tight"
            >
              <span className="text-gradient">Complete Digital Solutions</span>
              <br />
              <span className="text-white">For Every Need</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              From web applications to AI solutions, we provide comprehensive 
              development services that drive innovation and business growth. 
              Choose the service that fits your vision.
            </motion.p>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border border-cyber-purple/20 rounded-lg"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-16 h-16 border border-cyber-pink/20 rounded-full"
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

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our <span className="text-gradient">Development Process</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              We follow a proven methodology that ensures quality, efficiency, 
              and successful project delivery every time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ProcessStep key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-6">
                Why Choose <span className="text-gradient">Founders of 404?</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                We're not just developers – we're problem solvers, innovators, 
                and partners in your success.
              </p>

              <div className="space-y-4">
                {[
                  'Expert team with diverse technical backgrounds',
                  'Agile development methodology with regular updates',
                  'Cutting-edge technologies and best practices',
                  'Comprehensive testing and quality assurance',
                  'Ongoing support and maintenance services',
                  'Transparent pricing with no hidden costs',
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-cyber-blue rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    <p className="text-text-secondary">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-effect rounded-2xl p-8 border border-cyber-blue/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-cyber-orange fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">5.0 Client Rating</span>
                </div>
                
                <blockquote className="text-text-secondary italic text-lg leading-relaxed mb-6">
                  "Working with Founders of 404 was an exceptional experience. 
                  They delivered a complex web application that exceeded our 
                  expectations in both functionality and design."
                </blockquote>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">JS</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">John Smith</p>
                    <p className="text-text-secondary text-sm">CEO, TechCorp</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-cyber-purple rounded-full opacity-20"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyber-pink rounded-full opacity-30"
                animate={{
                  y: [0, 10, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass-effect rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-cyber font-bold mb-6">
              Ready to Start <span className="text-gradient">Your Project?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Let's discuss your needs and create something amazing together. 
              Get in touch for a free consultation and project estimate.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="cyber-button group px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold rounded-lg flex items-center space-x-2 hover:shadow-2xl hover:shadow-cyber-blue/25 transition-all duration-300"
                >
                  <span>Get Free Consultation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/portfolio"
                  className="cyber-button group px-8 py-4 glass-effect border border-cyber-purple/30 text-white font-semibold rounded-lg flex items-center space-x-2 hover:border-cyber-purple/50 transition-all duration-300"
                >
                  <span>View Our Work</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
