import React, { useState, useEffect } from 'react';
import TravelistaLayout from '@/components/TravelistaLayout';
import { MessageSquare, Mail, HelpCircle, Bell, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobOffers from '@/components/JobOffers';
import ChatInterface from '@/components/ChatInterface';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleEmailClick = () => {
    const subject = "Customer Support Request";
    const body = "Dear Travelista Support Team,\n\nI would like to inquire about:\n\n[Please describe your question or concern here]\n\nThank you,\n[Your Name]";
    const mailtoLink = `mailto:travelista.customerservice@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      alert("Please login to view your notifications");
      return;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state if needed
    setIsSubmitting(true);

    // Call the API to submit the contact form
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setIsSubmitting(false);
        if (data.status === 'success') {
          // Show success message
          toast({
            title: "Message Sent!",
            description: "We've received your message and will get back to you soon.",
            variant: "default",
          });
          
          // Reset form keeping user data
          setFormData({
            name: user ? user.name : '',
            email: user ? user.email : '',
            subject: '',
            message: ''
          });
        } else {
          // Show error message
          toast({
            title: "Error",
            description: data.message || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          variant: "destructive",
        });
        console.error('Error submitting contact form:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <TravelistaLayout>
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6 text-[hsl(214,57%,51%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)]">
                  Get in Touch
                </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A visitor-friendly customer support team that's just a click away. We're here to help you plan your perfect journey.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          >
                {/* Live Chat */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)] rounded-[40px_60px_40px_70px] blur-lg opacity-30 group-hover:opacity-40 transition-all duration-300"></div>
              <div className="relative bg-white rounded-[40px_60px_40px_70px] p-6 shadow-lg border border-[hsl(214,57%,51%)]/20 hover:border-[hsl(214,57%,51%)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="text-center">
                  <div className="w-12 h-12 bg-[hsl(214,57%,51%)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-[hsl(214,57%,51%)]" />
                      </div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Live chat</h2>
                  <p className="text-gray-600 text-sm mb-4">
                        Available 24/7<br />
                        Instant response
                      </p>
                      <Button 
                        variant="outline" 
                    className="w-full hover:bg-[hsl(214,57%,51%)] hover:text-white rounded-full text-sm py-2 transition-all duration-300 group-hover:scale-105"
                        onClick={() => setShowChat(true)}
                      >
                    <MessageSquare className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </div>
            </motion.div>

                {/* Email Contact */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)] rounded-[60px_40px_70px_40px] blur-lg opacity-30 group-hover:opacity-40 transition-all duration-300"></div>
              <div className="relative bg-white rounded-[60px_40px_70px_40px] p-6 shadow-lg border border-[hsl(214,57%,51%)]/20 hover:border-[hsl(214,57%,51%)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="text-center">
                  <div className="w-12 h-12 bg-[hsl(214,57%,51%)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-[hsl(214,57%,51%)]" />
                      </div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Email Contact</h2>
                  <p className="text-gray-600 text-sm mb-4">
                        Get in touch with us using these hours.<br />
                        We'll respond within one day
                      </p>
                      <Button 
                        variant="outline" 
                    className="w-full hover:bg-[hsl(214,57%,51%)] hover:text-white rounded-full text-sm py-2 transition-all duration-300 group-hover:scale-105"
                        onClick={handleEmailClick}
                      >
                    <Mail className="w-4 h-4 mr-2" />
                        Send email
                      </Button>
                    </div>
                  </div>
            </motion.div>

                {/* Help Center */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)] rounded-[70px_40px_60px_50px] blur-lg opacity-30 group-hover:opacity-40 transition-all duration-300"></div>
              <div className="relative bg-white rounded-[70px_40px_60px_50px] p-6 shadow-lg border border-[hsl(214,57%,51%)]/20 hover:border-[hsl(214,57%,51%)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="text-center">
                  <div className="w-12 h-12 bg-[hsl(214,57%,51%)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <HelpCircle className="w-6 h-6 text-[hsl(214,57%,51%)]" />
                      </div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Help center</h2>
                  <p className="text-gray-600 text-sm mb-4">
                        Our staff works 24/7 to help you<br />
                        Visit our help center
                      </p>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-[hsl(214,57%,51%)] hover:text-white rounded-full text-sm py-2 transition-all duration-300 group-hover:scale-105"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                        Visit help center
                      </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-[hsl(214,57%,51%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)]">
                  Talk to Real People
                </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Genuine choice as far as customer support, uplifting you through your journey.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto mb-20"
          >
            <div className="grid md:grid-cols-4 gap-8">
                  {/* Team Member Cards */}
              {[
                {
                  name: "Cindy Jackard",
                  role: "Travel Guide Specialist",
                  location: "Birmingham, AL",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  email: "cindy.jackard@gmail.com"
                },
                {
                  name: "George Pearce",
                  role: "Senior Guide",
                  location: "Memphis, TN",
                  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  email: "george.pearce@gmail.com"
                },
                {
                  name: "Andrea",
                  role: "Travel Guide Agent",
                  location: "New York, NY",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  email: "andrea.andrea@gmail.com"
                },
                {
                  name: "Sheri Deen",
                  role: "Travel Coordinator",
                  location: "Cedar, AL",
                  image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  email: "sheri.deen@gmail.com"
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  className="bg-white rounded-[20px] overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="overflow-hidden relative">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-80 object-cover border-4 border-[hsl(214,57%,51%)] transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-[hsl(214,57%,51%)] font-medium">{member.role}</p>
                    <p className="text-gray-600 text-sm mt-1 mb-6">{member.location}</p>
                      <a
                      href={`mailto:${member.email}?subject=Contact%20from%20Travelista%20Website`}
                      className="w-full block bg-[hsl(214,57%,51%)] hover:bg-[hsl(214,57%,45%)] text-white transition-all duration-300 rounded-xl py-3 text-center group-hover:scale-105"
                      >
                      Contact {member.name.split(' ')[0]}
                      <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
                    </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-[hsl(214,57%,51%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)]">
                Send Us a Message
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
                    </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-[30px] p-8 shadow-xl border border-[hsl(214,57%,51%)]/20"
            >
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-gray-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      placeholder="John Doe"
                      required
                      readOnly={!!user}
                    />
                    {user && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account name
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-gray-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      placeholder="john@example.com"
                      required
                      readOnly={!!user}
                    />
                    {user && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account email
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-gray-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-gray-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)] min-h-[150px]"
                    placeholder="Write your message here..."
                    required
                  />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    className="bg-[hsl(214,57%,51%)] hover:bg-[hsl(214,57%,45%)] text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
              </div>
              </form>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-[hsl(214,57%,51%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)]">
                Job Offers
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A visitor-friendly job offer page that helps you find the right job for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
              <JobOffers />
          </motion.div>

          {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
        </div>
      </TravelistaLayout>
    </>
  );
};

export default Contact; 
