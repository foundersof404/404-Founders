import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Instagram,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    'Web Development',
    'Mobile Apps',
    'AI Solutions',
    'Senior Projects',
    'Systems Development'
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/founders_of_404?igsh=MXg1NnE3dXNnc2lkcQ%3D%3D&utm_source=qr', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-cyber-darker to-cyber-dark border-t border-dark-border">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                  <img 
                    src="/images/logo.png" 
                    alt="404 Founders Logo" 
                    className="w-full h-full object-cover scale-100"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Zap className="w-5 h-5 text-white" style={{ display: 'none' }} />
                </div>
                <div className="text-lg font-cyber font-bold">
                  <span className="text-gradient">404</span>
                  <span className="text-white ml-1">Founders</span>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Building the future through innovative web applications, mobile solutions, 
                AI-powered systems, and comprehensive development services.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-dark-card hover:bg-cyber-blue/20 border border-dark-border hover:border-cyber-blue/50 rounded-lg flex items-center justify-center text-text-secondary hover:text-cyber-blue transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 font-cyber">
                Our Services
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="#"
                      className="text-text-secondary hover:text-cyber-blue transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.div
                        className="w-1 h-1 bg-cyber-blue rounded-full opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span>{service}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 font-cyber">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.href}
                      className="text-text-secondary hover:text-cyber-blue transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.div
                        className="w-1 h-1 bg-cyber-blue rounded-full opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 font-cyber">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-text-secondary">
                  <Mail size={18} className="text-cyber-blue flex-shrink-0" />
                  <span>foundersof404@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-text-secondary">
                  <Phone size={18} className="text-cyber-green flex-shrink-0" />
                  <span>+1 (555) 404-FOUND</span>
                </div>
                <div className="flex items-center space-x-3 text-text-secondary">
                  <MapPin size={18} className="text-cyber-purple flex-shrink-0" />
                  <span>Beirut Lebanon</span>
                </div>
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                className="mt-6 w-full cyber-button bg-dark-card hover:bg-cyber-blue/20 border border-dark-border hover:border-cyber-blue/50 text-text-secondary hover:text-cyber-blue py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowUp size={18} />
                <span>Back to Top</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-text-secondary text-sm">
                © 2024 Founders of 404. All rights reserved. Built with 💙 and lots of ☕
              </p>
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                <a href="#" className="hover:text-cyber-blue transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-cyber-blue transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-cyber-blue transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
