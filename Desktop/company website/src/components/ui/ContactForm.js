import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Building, AlertCircle, Phone } from 'lucide-react';

// Input variants removed as they're no longer used after simplifying the form

// Move services array outside component to prevent recreation
  const services = [
    'Web Application Development',
    'Mobile App Development',
    'AI Solutions & Automation',
    'Senior Project Support',
    'Systems Development',
    'Consultation & Planning',
  ];

// Move FormField component completely outside to prevent recreation
const FormField = React.memo(({ 
  name, 
  label, 
  type = "text", 
  icon: Icon, 
  placeholder, 
  required = false,
  as = "input",
  value,
  onChange,
  errors
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-2"
    >
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-cyber-pink">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              errors[name] ? 'text-red-400' : 'text-text-secondary'
            } transition-colors duration-300`}
          />
        )}
        <motion.div whileFocus="focus">
          {as === "textarea" ? (
            <textarea
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              rows={4}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-dark-card border ${
                errors[name] 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-dark-border focus:border-cyber-blue/50 focus:ring-cyber-blue/20'
              } rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
            />
          ) : as === "select" ? (
            <select
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-dark-card border ${
                errors[name] 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-dark-border focus:border-cyber-blue/50 focus:ring-cyber-blue/20'
              } rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-300`}
            >
              <option value="">{placeholder}</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-dark-card border ${
                errors[name] 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-dark-border focus:border-cyber-blue/50 focus:ring-cyber-blue/20'
              } rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 transition-all duration-300`}
            />
          )}
        </motion.div>
      </div>
      {errors[name] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          <span>{errors[name]}</span>
        </motion.div>
      )}
    </motion.div>
  );
});

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form on success
      setFormData({
        name: '',
        email: '',
          phone: '',
        company: '',
        service: '',
        message: '',
      });
      
      onSubmit(true);
      } else {
        console.error('Failed to submit form:', result.message);
        setErrors({ submit: result.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Connection error. Please make sure you are connected to the internet and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit Error */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
        >
          {errors.submit}
        </motion.div>
      )}
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="name"
          label="Full Name"
          icon={User}
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={handleInputChange}
          errors={errors}
        />
        
        <FormField
          name="email"
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter your email address"
          required
          value={formData.email}
          onChange={handleInputChange}
          errors={errors}
        />
      </div>

      {/* Phone and Company Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="phone"
          label="Phone Number (Optional)"
          type="tel"
          icon={Phone}
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          errors={errors}
        />
        
        <FormField
          name="company"
          label="Company (Optional)"
          icon={Building}
          placeholder="Enter your company name"
          value={formData.company}
          onChange={handleInputChange}
          errors={errors}
        />
      </div>
        
      {/* Service */}
        <FormField
          name="service"
          label="Service of Interest"
          icon={MessageSquare}
          placeholder="Select a service"
          as="select"
        value={formData.service}
        onChange={handleInputChange}
        errors={errors}
        />

      {/* Message */}
      <FormField
        name="message"
        label="Project Details"
        icon={MessageSquare}
        placeholder="Tell us about your project, requirements, timeline, and any specific questions you have..."
        as="textarea"
        required
        value={formData.message}
        onChange={handleInputChange}
        errors={errors}
      />

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`cyber-button w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white font-semibold rounded-lg transition-all duration-300 ${
            isSubmitting 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:shadow-2xl hover:shadow-cyber-pink/25'
          }`}
          whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Form Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-text-secondary text-sm">
          By submitting this form, you agree to our privacy policy. 
          We'll never share your information with third parties.
        </p>
      </motion.div>

      {/* Interactive Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-pink rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </form>
  );
};

export default ContactForm;
