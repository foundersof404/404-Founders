require('dotenv').config({ path: '../../.env' });
const db = require('../config/db');
const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');
const CompanyMilestone = require('../models/CompanyMilestone');
const CompanyValue = require('../models/CompanyValue');
const CompanyStory = require('../models/CompanyStory');

async function seedAboutData() {
  console.log('Starting About page data seeding...');
  
  try {
    // Seed employee testimonials
    const employeeTestimonials = [
      {
        name: "Sarah Johnson",
        role: "Travel Consultant",
        quote: "Working at Travelista has been an incredible journey. Every day, I get to help people create unforgettable memories around the world.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 5,
        type: "employee"
      },
      {
        name: "Michael Chen",
        role: "Customer Experience Manager",
        quote: "The best part of my job is seeing the joy on our customers' faces when they return from their dream vacations.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 5,
        type: "employee"
      }
    ];
    
    for (const testimonial of employeeTestimonials) {
      await Testimonial.create(testimonial);
      console.log(`Created employee testimonial: ${testimonial.name}`);
    }
    
    // Seed customer testimonials
    const customerTestimonials = [
      {
        name: "Emily Rodriguez",
        location: "New York, USA",
        quote: "Travelista made my honeymoon in Bali absolutely perfect. Every detail was taken care of, and the experience was seamless.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        rating: 5,
        type: "customer"
      },
      {
        name: "David Kim",
        location: "Seoul, South Korea",
        quote: "The personalized service and attention to detail are unmatched. I've traveled with Travelista three times now, and each experience has been exceptional.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd2298dac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        rating: 5,
        type: "customer"
      },
      {
        name: "Sophia Martinez",
        location: "Barcelona, Spain",
        quote: "As a solo traveler, I felt completely safe and supported throughout my journey. The team's expertise and care made all the difference.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        rating: 5,
        type: "customer"
      }
    ];
    
    for (const testimonial of customerTestimonials) {
      await Testimonial.create(testimonial);
      console.log(`Created customer testimonial: ${testimonial.name}`);
    }
    
    // Seed team members
    const teamMembers = [
      {
        name: "Sarah Johnson",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        bio: "Sarah founded Travelista with a vision to make travel accessible and enjoyable for everyone.",
        email: "sarah.johnson@travelista.com",
        display_order: 1
      },
      {
        name: "Michael Chen",
        role: "Operations Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        bio: "Michael oversees the day-to-day operations and ensures smooth experiences for all customers.",
        email: "michael.chen@travelista.com",
        display_order: 2
      },
      {
        name: "Emily Rodriguez",
        role: "Customer Experience",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        bio: "Emily leads our customer experience team, ensuring every traveler has an unforgettable journey.",
        email: "emily.rodriguez@travelista.com",
        display_order: 3
      },
      {
        name: "David Kim",
        role: "Travel Specialist",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd2298dac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        bio: "David is an experienced travel specialist with deep knowledge of destinations around the world.",
        email: "david.kim@travelista.com",
        display_order: 4
      }
    ];
    
    for (const member of teamMembers) {
      await TeamMember.create(member);
      console.log(`Created team member: ${member.name}`);
    }
    
    // Seed company milestones
    const milestones = [
      {
        title: "Founded",
        description: "Travelista is born with a vision to make travel accessible and joyful.",
        year: "2015",
        icon: "Globe",
        display_order: 1
      },
      {
        title: "10,000+ Happy Travelers",
        description: "We celebrate a major milestone with thousands of satisfied customers.",
        year: "2018",
        icon: "Users",
        display_order: 2
      },
      {
        title: "Industry Awards",
        description: "Travelista wins multiple awards for innovation and service.",
        year: "2023",
        icon: "Award",
        display_order: 3
      }
    ];
    
    for (const milestone of milestones) {
      await CompanyMilestone.create(milestone);
      console.log(`Created company milestone: ${milestone.title}`);
    }
    
    // Seed company values
    const values = [
      {
        title: "Passion",
        description: "We are passionate about travel and dedicated to sharing that passion with our customers.",
        icon: "Heart",
        display_order: 1
      },
      {
        title: "Trust",
        description: "We build trust through transparency, reliability, and exceptional customer service.",
        icon: "Shield",
        display_order: 2
      },
      {
        title: "Adventure",
        description: "We encourage exploration and help our customers discover new destinations and experiences.",
        icon: "Globe",
        display_order: 3
      }
    ];
    
    for (const value of values) {
      await CompanyValue.create(value);
      console.log(`Created company value: ${value.title}`);
    }
    
    // Seed company story
    const story = {
      title: "Our Story",
      content: "Travelista was founded in 2015 by a group of travel enthusiasts who wanted to make travel planning easier and more enjoyable. What started as a small local agency has grown into a trusted name in the travel industry. Over the years, we've helped thousands of travelers explore the world, create memories, and experience new cultures. Our team of experienced travel experts is dedicated to providing personalized service and ensuring that every journey is special. Today, Travelista offers a comprehensive range of travel services, from flight bookings to hotel reservations, car rentals, and customized travel packages. We continue to innovate and expand our offerings to meet the evolving needs of modern travelers.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      short_description: "What started as a small local agency has grown into a trusted name in the travel industry."
    };
    
    await CompanyStory.create(story);
    console.log(`Created company story: ${story.title}`);
    
    console.log('About data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding About data:', error);
  } finally {
    // Close database connection
    console.log('Closing database connection...');
    process.exit(0);
  }
}

// Run the seeding function
seedAboutData(); 