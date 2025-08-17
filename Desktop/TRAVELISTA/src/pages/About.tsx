import React, { useState, useEffect } from 'react';
import { Globe, Users, Award, Clock, Heart, Shield, Star, Quote } from 'lucide-react';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import { motion } from 'framer-motion';
import TravelistaLayout from '@/components/TravelistaLayout';
import styles from './About.module.css';

const About = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({
    employeeTestimonials: [],
    customerTestimonials: [],
    teamMembers: [],
    milestones: [],
    values: [],
    story: null
  });

  // Fetch all about page data on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/about`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch about page data');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        // Fallback to default data if API fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  // Fallback data in case API fails
  const employeeTestimonials = aboutData.employeeTestimonials.length > 0 ? aboutData.employeeTestimonials : [
    {
      name: "Sarah Johnson",
      role: "Travel Consultant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      quote: "Working at Travelista has been an incredible journey. Every day, I get to help people create unforgettable memories around the world.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Customer Experience Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      quote: "The best part of my job is seeing the joy on our customers' faces when they return from their dream vacations.",
      rating: 5
    }
  ];

  const userTestimonials = aboutData.customerTestimonials.length > 0 ? aboutData.customerTestimonials : [
    {
      name: "Emily Rodriguez",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      quote: "Travelista made my honeymoon in Bali absolutely perfect. Every detail was taken care of, and the experience was seamless.",
      rating: 5
    },
    {
      name: "David Kim",
      location: "Seoul, South Korea",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd2298dac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      quote: "The personalized service and attention to detail are unmatched. I've traveled with Travelista three times now, and each experience has been exceptional.",
      rating: 5
    },
    {
      name: "Sophia Martinez",
      location: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      quote: "As a solo traveler, I felt completely safe and supported throughout my journey. The team's expertise and care made all the difference.",
      rating: 5
    }
  ];

  // Get company values from API or use fallback data
  const companyValues = aboutData.values.length > 0 ? aboutData.values : [
    { title: "Passion", description: "We are passionate about travel and dedicated to sharing that passion with our customers.", icon: "Heart" },
    { title: "Trust", description: "We build trust through transparency, reliability, and exceptional customer service.", icon: "Shield" },
    { title: "Adventure", description: "We encourage exploration and help our customers discover new destinations and experiences.", icon: "Globe" }
  ];

  // Get team members from API or use fallback data
  const teamMembers = aboutData.teamMembers.length > 0 ? aboutData.teamMembers : [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      name: "Michael Chen",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "David Kim",
      role: "Travel Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd2298dac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  // Get company milestones from API or use fallback data
  const milestones = aboutData.milestones.length > 0 ? aboutData.milestones : [
    { 
      title: "Founded", 
      description: "Travelista is born with a vision to make travel accessible and joyful.", 
      year: "2015", 
      icon: "Globe" 
    },
    { 
      title: "10,000+ Happy Travelers", 
      description: "We celebrate a major milestone with thousands of satisfied customers.", 
      year: "2018", 
      icon: "Users" 
    },
    { 
      title: "Industry Awards", 
      description: "Travelista wins multiple awards for innovation and service.", 
      year: "2023", 
      icon: "Award" 
    }
  ];

  // Company story from API or fallback
  const story = aboutData.story || {
    title: "Our Story",
    content: "Travelista was founded in 2015 by a group of travel enthusiasts who wanted to make travel planning easier and more enjoyable. What started as a small local agency has grown into a trusted name in the travel industry.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
  };

  return (
    <TravelistaLayout>
      <div className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          {/* Hero Section */}
          <section className="mb-20 text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 pointer-events-none ${styles.animateGradient}`} />
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-8 text-primary drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Travelista
            </motion.h1>
            <motion.p 
              className="text-2xl md:text-3xl text-black max-w-3xl mx-auto mb-6 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your journey begins here. Discover why thousands trust Travelista to make their travel dreams a reality.
            </motion.p>
            <motion.p 
              className="text-lg md:text-xl text-black max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We are passionate about creating unforgettable travel experiences for our customers. Our mission is to make travel accessible, enjoyable, and memorable for everyone.
            </motion.p>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.1}>
          {/* Why Choose Us Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary relative">
              Why Choose Travelista?
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20 rounded-full"></div>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-8 rounded-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto transform hover:rotate-12 transition-transform">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-black">Award-Winning Service</h3>
                <p className="text-black text-center leading-relaxed">
                  Recognized globally for our commitment to excellence and customer satisfaction.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 rounded-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto transform hover:rotate-12 transition-transform">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-black">24/7 Support</h3>
                <p className="text-black text-center leading-relaxed">
                  Our team is always available to assist you, wherever you are in the world.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 rounded-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto transform hover:rotate-12 transition-transform">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-black">Personalized Experiences</h3>
                <p className="text-black text-center leading-relaxed">
                  We tailor every journey to your unique interests and preferences.
                </p>
              </motion.div>
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          {/* Milestones Timeline */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary relative">
              Our Journey
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20 rounded-full"></div>
            </h2>
            <ol className="relative border-l-2 border-primary/20 ml-4">
              {milestones.map((milestone, index) => (
                <motion.li 
                  key={index}
                  className="mb-12 ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-primary rounded-full -left-5 ring-4 ring-white shadow-lg">
                    {milestone.icon === "Globe" && <Globe className="w-6 h-6 text-white" />}
                    {milestone.icon === "Users" && <Users className="w-6 h-6 text-white" />}
                    {milestone.icon === "Award" && <Award className="w-6 h-6 text-white" />}
                  </span>
                  <h3 className="font-semibold text-xl mb-2 text-black">{milestone.title}</h3>
                  <p className="text-black leading-relaxed">{milestone.description}</p>
                </motion.li>
              ))}
            </ol>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.3}>
          {/* Story Section */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-8 text-black relative">
                  {story.title}
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-primary/20 rounded-full"></div>
                </h2>
                <p className="text-black mb-6 leading-relaxed">
                  {story.content}
                </p>
              </motion.div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-secondary/30 rounded-xl p-6 shadow-xl">
                  <div className="aspect-video bg-cover bg-center rounded-lg transform hover:scale-105 transition-transform duration-500" 
                    style={{ backgroundImage: `url(${story.image})` }}
                  />
                </div>
              </motion.div>
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.4}>
          {/* Values Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary relative">
              Our Values
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20 rounded-full"></div>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {companyValues.map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto transform hover:rotate-12 transition-transform">
                    {value.icon === "Heart" && <Heart className="w-8 h-8 text-primary" />}
                    {value.icon === "Shield" && <Shield className="w-8 h-8 text-primary" />}
                    {value.icon === "Globe" && <Globe className="w-8 h-8 text-primary" />}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center text-black">{value.title}</h3>
                  <p className="text-black text-center leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.5}>
          {/* Team Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary relative">
              Our Team
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20 rounded-full"></div>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-40 h-40 rounded-full bg-secondary mx-auto mb-6 overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">{member.name}</h3>
                  <p className="text-black">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.6}>
          {/* Testimonials Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary relative">
              What People Say About Us
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20 rounded-full"></div>
            </h2>
            
            {/* Employee Testimonials */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-black">From Our Team</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {employeeTestimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-8 rounded-xl border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-black">{testimonial.name}</h4>
                        <p className="text-black">{testimonial.role}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                      <p className="text-black italic pl-6 leading-relaxed">{testimonial.quote}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* User Testimonials */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center text-black">From Our Travelers</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {userTestimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-8 rounded-xl border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-black">{testimonial.name}</h4>
                        <p className="text-black">{testimonial.location}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                      <p className="text-black italic pl-6 leading-relaxed">{testimonial.quote}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.7}>
          {/* Stats Section */}
          <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-xl p-12 shadow-xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10K+", label: "Happy Customers" },
                { number: "150+", label: "Destinations" },
                { number: "8+", label: "Years Experience" },
                { number: "24/7", label: "Customer Support" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-5xl font-bold text-primary mb-3">{stat.number}</div>
                  <p className="text-black text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeInOnScroll>
      </div>
    </TravelistaLayout>
  );
};

export default About; 