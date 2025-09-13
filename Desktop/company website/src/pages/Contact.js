import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageSquare
} from 'lucide-react';
import ContactForm from '../components/ui/ContactForm';
import ContactInfo from '../components/ui/ContactInfo';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'foundersof404@gmail.com',
      href: 'mailto:foundersof404@gmail.com',
      color: 'cyber-blue',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 404-FOUND',
      href: 'tel:+15554044686',
      color: 'cyber-green',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Beirut Lebanon',
      href: 'https://maps.google.com/search/Beirut+Lebanon',
      color: 'cyber-purple',
    },
    {
      icon: Clock,
      label: 'Online Hours',
      value: 'Available Online 24/7',
      href: null,
      color: 'cyber-pink',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/founders404',
      color: 'cyber-blue',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/founders404',
      color: 'cyber-purple',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/founders404',
      color: 'cyber-pink',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/founders_of_404?igsh=MXg1NnE3dXNnc2lkcQ%3D%3D&utm_source=qr',
      color: 'cyber-orange',
    },
    {
      icon: MessageSquare,
      label: 'Discord',
      href: 'https://discord.gg/founders404',
      color: 'cyber-green',
    },
  ];

  const faqs = [
    {
      question: 'What services do you offer?',
      answer: 'We specialize in web applications, mobile apps, AI solutions, senior projects, and systems development. From simple websites to complex enterprise platforms.',
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during consultation.',
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Yes! We offer comprehensive support packages including maintenance, updates, hosting, and technical support to ensure your solution continues to perform optimally.',
    },
    {
      question: 'Can you work with my existing team?',
      answer: 'Absolutely! We love collaborating with in-house teams and can seamlessly integrate into your existing development workflow.',
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
              <span className="inline-block px-4 py-2 bg-cyber-pink/10 border border-cyber-pink/20 rounded-full text-cyber-pink text-sm font-medium mb-4">
                💬 Get In Touch
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-cyber font-bold mb-6 leading-tight"
            >
              <span className="text-white">Let's Build </span>
              <span className="text-gradient">Something Amazing</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Ready to transform your ideas into reality? We'd love to hear about your project. 
              Get in touch for a free consultation and let's discuss how we can help you succeed.
            </motion.p>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 border border-cyber-pink/20 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 border border-cyber-blue/20 rounded-lg"
            animate={{
              rotate: -360,
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32">
                <h2 className="text-3xl font-cyber font-bold text-white mb-8">
                  <span className="text-gradient">Contact</span> Information
                </h2>

                {/* Contact Info Cards */}
                <div className="space-y-4 mb-8">
                  {contactInfo.map((info, index) => (
                    <ContactInfo key={info.label} info={info} index={index} />
                  ))}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-dark-card hover:bg-${social.color}/20 border border-dark-border hover:border-${social.color}/50 rounded-lg flex items-center justify-center text-text-secondary hover:text-${social.color} transition-all duration-300 group`}
                        whileHover={{ scale: 1.1, rotate: 5, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <social.icon size={20} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Response Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 p-4 glass-effect rounded-lg border border-cyber-blue/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
                    <span className="text-white font-medium">We typically respond within 24 hours</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="glass-effect rounded-2xl p-8 border border-dark-border">
                <h2 className="text-3xl font-cyber font-bold text-white mb-2">
                  Send Us a <span className="text-gradient">Message</span>
                </h2>
                <p className="text-text-secondary mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <ContactForm onSubmit={setIsSubmitted} />

                {/* Success Message */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-cyber-green/10 border border-cyber-green/20 rounded-lg flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-cyber-green flex-shrink-0" />
                    <div>
                      <h4 className="text-cyber-green font-semibold">Message Sent!</h4>
                      <p className="text-text-secondary text-sm">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Find answers to common questions about our services, process, and approach.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-lg p-6 border border-dark-border hover:border-cyber-blue/30 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-text-secondary leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
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
            className="max-w-4xl mx-auto text-center glass-effect rounded-2xl p-12 border border-dark-border"
          >
            <h2 className="text-4xl md:text-5xl font-cyber font-bold mb-6">
              Ready to Start <span className="text-gradient">Your Journey?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Don't wait – let's turn your vision into reality. Schedule a free 
              consultation call and discover how we can help you achieve your goals.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.a
                href="mailto:hello@founders404.com"
                className="cyber-button group px-8 py-4 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white font-semibold rounded-lg flex items-center space-x-2 hover:shadow-2xl hover:shadow-cyber-pink/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                <span>Send Email</span>
              </motion.a>

              <motion.a
                href="tel:+15554044686"
                className="cyber-button group px-8 py-4 glass-effect border border-cyber-green/30 text-white font-semibold rounded-lg flex items-center space-x-2 hover:border-cyber-green/50 hover:bg-cyber-green/10 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
