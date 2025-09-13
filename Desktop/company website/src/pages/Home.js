import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Code, Smartphone, Brain, GraduationCap, Settings } from 'lucide-react';
import Hero3D from '../components/3d/Hero3D';
import StatsCounter from '../components/ui/StatsCounter';
import ServicePreview from '../components/ui/ServicePreview';

// Animation variants moved outside component to prevent recreation
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

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8 }
  }
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8 }
  }
};

// Memoized components for better performance
const ScrollIndicator = memo(() => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    aria-label="Scroll down indicator"
  >
    <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex justify-center">
      <motion.div
        className="w-1 h-3 bg-cyber-blue rounded-full mt-2"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </motion.div>
));

const CTAButton = memo(({ to, children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "cyber-button group px-8 py-4 font-semibold rounded-lg flex items-center space-x-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-2xl hover:shadow-cyber-blue/25 focus:ring-cyber-blue",
    secondary: "glass-effect border border-cyber-blue/30 text-white hover:border-cyber-blue/50 focus:ring-cyber-blue/50",
    accent: "bg-gradient-to-r from-cyber-green to-cyber-blue text-white hover:shadow-2xl hover:shadow-cyber-green/25 focus:ring-cyber-green",
    ghost: "glass-effect border border-cyber-green/30 text-white hover:border-cyber-green/50 focus:ring-cyber-green/50",
    purplePink: "bg-gradient-to-r from-cyber-purple to-cyber-pink text-white hover:shadow-2xl hover:shadow-cyber-purple/25 focus:ring-cyber-purple"
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
});

const HeroSection = memo(() => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* 3D Background */}
    <div className="absolute inset-0" role="presentation">
      <Hero3D />
    </div>

    {/* Hero Content */}
    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 bg-cyber-blue/10 border border-cyber-blue/20 rounded-full text-cyber-blue text-sm font-medium mb-4">
            ✨ Welcome to the Future of Development
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-cyber font-bold mb-6 leading-tight"
        >
          <span className="text-gradient">Founders of 404</span>
          <br />
          <span className="text-white">Building the Future</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          We specialize in creating complete solutions including{' '}
          <span className="text-cyber-blue">Web Applications</span>,{' '}
          <span className="text-cyber-purple">Mobile Apps</span>,{' '}
          <span className="text-cyber-pink">AI Solutions</span>,{' '}
          <span className="text-cyber-green">Senior Projects</span>, and{' '}
          <span className="text-cyber-orange">Full Systems Development</span>
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <CTAButton to="/contact" variant="primary">
            <span>Work With Us</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </CTAButton>

          <CTAButton to="/services" variant="secondary">
            <Zap className="w-5 h-5" />
            <span>Explore Services</span>
          </CTAButton>
        </motion.div>
      </motion.div>
    </div>

    <ScrollIndicator />
  </section>
));

const StatsSection = memo(({ stats }) => (
  <section className="py-20 relative" aria-labelledby="stats-heading">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUpVariants}
        viewport={{ once: true, margin: "-10%" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => (
          <StatsCounter key={stat.label} stat={stat} index={index} />
        ))}
      </motion.div>
    </div>
  </section>
));

const ServicesSection = memo(({ services }) => (
  <section className="py-20 relative" aria-labelledby="services-heading">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUpVariants}
        viewport={{ once: true, margin: "-10%" }}
        className="text-center mb-16"
      >
        <h2 id="services-heading" className="text-4xl md:text-5xl font-cyber font-bold mb-6">
          <span className="text-gradient">Our Expertise</span>
        </h2>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          We deliver comprehensive solutions across multiple domains, 
          combining cutting-edge technology with creative innovation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServicePreview key={service.title} service={service} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <CTAButton 
          to="/services" 
          variant="purplePink"
          className="!px-4 !py-3 text-sm"
        >
          <span>View Services</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </CTAButton>
      </motion.div>
    </div>
  </section>
));

const CTASection = memo(() => (
  <section className="py-20 relative" aria-labelledby="cta-heading">
    <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 via-cyber-purple/10 to-cyber-pink/10" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={scaleVariants}
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-4xl mx-auto text-center glass-effect rounded-2xl p-12"
      >
        <h2 id="cta-heading" className="text-4xl md:text-5xl font-cyber font-bold mb-6">
          Ready to <span className="text-gradient">Build Something Amazing?</span>
        </h2>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Let's discuss your project and turn your ideas into reality. 
          We're here to help you succeed in the digital world.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <CTAButton to="/contact" variant="accent">
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </CTAButton>

          <CTAButton to="/portfolio" variant="ghost">
            <span>View Our Work</span>
          </CTAButton>
        </div>
      </motion.div>
    </div>
  </section>
));

const Home = () => {
  // Memoize static data to prevent recreation on every render
  const stats = useMemo(() => [
    { number: 50, suffix: '+', label: 'Projects Completed', color: 'cyber-blue' },
    { number: 2, suffix: '', label: 'Expert Founders', color: 'cyber-purple' },
    { number: 25, suffix: '+', label: 'Happy Clients', color: 'cyber-pink' },
    { number: 2, suffix: '', label: 'Years Experience', color: 'cyber-green' },
  ], []);

  const services = useMemo(() => [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies.',
      gradient: 'from-cyber-blue to-cyber-purple',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile solutions for iOS and Android.',
      gradient: 'from-cyber-purple to-cyber-pink',
    },
    {
      icon: Brain,
      title: 'AI Solutions',
      description: 'Intelligent automation and AI-powered features to enhance your business.',
      gradient: 'from-cyber-pink to-cyber-orange',
    },
    {
      icon: GraduationCap,
      title: 'Senior Projects',
      description: 'Academic project support and mentorship for computer science students.',
      gradient: 'from-cyber-green to-cyber-blue',
    },
    {
      icon: Settings,
      title: 'Systems Development',
      description: 'Enterprise platforms and custom software solutions for complex business needs.',
      gradient: 'from-cyber-orange to-cyber-purple',
    },
  ], []);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection stats={stats} />
      <ServicesSection services={services} />
      <CTASection />
    </main>
  );
};

// Export memoized component for better performance
export default memo(Home);