require('dotenv').config();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedUsers() {
  try {
    console.log('Starting database seeding...');

    // Check if users already exist to avoid duplicates
    const existingUsers = await db.query('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count > 0) {
      console.log(`${existingUsers[0].count} users already in database. Skipping user creation.`);
    } else {
      // Hash passwords
      const salt = await bcrypt.genSalt(10);
      const password1 = await bcrypt.hash('Password123', salt);
      const password2 = await bcrypt.hash('SecurePass456', salt);
      const password3 = await bcrypt.hash('TravelLover789', salt);

      // Create sample users
      const users = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: password1,
          phone: '+1234567890',
          birthday: '1990-01-15',
          location: 'New York, USA',
          email_verified: true,
          profile_picture: null,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: password2,
          phone: '+1987654321',
          birthday: '1992-05-20',
          location: 'London, UK',
          email_verified: true,
          profile_picture: null,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          password: password3,
          phone: '+1567890123',
          birthday: '1988-11-07',
          location: 'Sydney, Australia',
          email_verified: false,
          email_verify_token: uuidv4(),
          profile_picture: null,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      // Insert users
      for (const user of users) {
        await db.query(
          `INSERT INTO users 
            (name, email, password, phone, birthday, location, email_verified, email_verify_token, profile_picture, created_at, updated_at) 
           VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            user.name,
            user.email,
            user.password,
            user.phone,
            user.birthday,
            user.location,
            user.email_verified,
            user.email_verify_token || null,
            user.profile_picture
          ]
        );
      }

      console.log('3 sample users created successfully');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding error:', error);
    process.exit(1);
  }
}

async function seedData() {
  try {
    console.log('Starting database seeding...');

    // Sample job offers
    const jobOffers = [
      {
        title: 'Travel Guide Specialist',
        description: 'We are looking for a passionate and knowledgeable Travel Guide Specialist to join our team. The ideal candidate will have extensive experience in leading tours and providing exceptional customer service.',
        requirements: 'Minimum 2 years experience in tourism industry\nExcellent communication skills\nFluent in English, additional languages are a plus\nPassion for travel and customer service',
        location: 'New York, NY',
        salary: '$45,000 - $55,000',
        type: 'Full-time'
      },
      {
        title: 'Tour Coordinator',
        description: 'As a Tour Coordinator, you will be responsible for organizing and scheduling tours, coordinating with local guides, and ensuring all logistics run smoothly for our clients.',
        requirements: 'Strong organizational skills\nExperience in logistics or event planning\nCustomer-focused attitude\nAbility to work under pressure',
        location: 'Remote',
        salary: '$40,000 - $48,000',
        type: 'Full-time'
      },
      {
        title: 'Social Media Manager',
        description: 'We are seeking a creative Social Media Manager to help grow our online presence and engage with our community of travelers. You will create compelling content that inspires people to explore the world.',
        requirements: 'Proven experience in social media management\nStrong writing and content creation skills\nKnowledge of social media analytics\nExperience with graphic design tools',
        location: 'Chicago, IL',
        salary: '$50,000 - $60,000',
        type: 'Full-time'
      },
      {
        title: 'Customer Support Representative',
        description: 'Join our customer support team to assist travelers with their bookings, answer questions, and provide exceptional service to ensure our clients have the best travel experience possible.',
        requirements: 'Excellent communication skills\nPatience and problem-solving abilities\nBasic knowledge of travel industry\nAvailability to work flexible hours',
        location: 'Remote',
        salary: '$35,000 - $42,000',
        type: 'Part-time'
      },
      {
        title: 'Travel Photographer',
        description: 'We need a skilled photographer to capture stunning images of destinations, hotels, and experiences for our marketing materials and social media channels.',
        requirements: 'Professional photography portfolio\nExperience in travel or landscape photography\nAbility to travel frequently\nSkills in photo editing software',
        location: 'Miami, FL',
        salary: '$60,000 - $75,000',
        type: 'Contract'
      }
    ];

    // Insert job offers
    for (const job of jobOffers) {
      const query = `
        INSERT INTO job_offers (
          title, description, requirements, location, salary, type, 
          is_active, posted_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, true, NOW(), NOW(), NOW())
      `;
      
      await db.query(query, [
        job.title, job.description, job.requirements, job.location, job.salary, job.type
      ]);
    }

    console.log(`Added ${jobOffers.length} job offers to the database`);

    // Sample contact messages
    const contactMessages = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        subject: 'Question about European tours',
        message: 'Hi, I\'m interested in your European tour packages. Could you provide more information about the 10-day Italy tour? I\'m specifically interested in what cities are covered and if there are any special activities included. Thanks!',
        status: 'unread'
      },
      {
        name: 'Emily Johnson',
        email: 'emily.j@example.com',
        subject: 'Booking confirmation issue',
        message: 'Hello, I recently booked a trip to Paris (booking #TRV-78945) but haven\'t received my confirmation email yet. Could you please check the status of my booking? Thank you.',
        status: 'read'
      },
      {
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        subject: 'Special accommodation request',
        message: 'I\'m planning to book your Thailand adventure package, but I have some dietary restrictions (vegan) and would like to know if that can be accommodated during the included meals. Also, do you offer any eco-friendly or sustainable tourism options?',
        status: 'unread'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.w@example.com',
        subject: 'Feedback on my recent trip',
        message: 'I just returned from your Costa Rica wildlife tour and wanted to share my experience. Our guide Carlos was absolutely amazing - knowledgeable, friendly, and went above and beyond to make sure we saw as much wildlife as possible. The accommodations were also excellent. Thank you for an unforgettable trip!',
        status: 'replied'
      },
      {
        name: 'David Brown',
        email: 'david.b@example.com',
        subject: 'Group discount inquiry',
        message: 'I\'m planning a trip for my company\'s team-building retreat (around 15 people) and would like to know if you offer any group discounts or custom packages. We\'re interested in a destination with both adventure activities and relaxation options. Our budget is approximately $2,000 per person.',
        status: 'unread'
      }
    ];

    // Insert contact messages
    for (const message of contactMessages) {
      const query = `
        INSERT INTO contact_messages (
          name, email, subject, message, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await db.query(query, [
        message.name, message.email, message.subject, message.message, message.status
      ]);
    }

    console.log(`Added ${contactMessages.length} contact messages to the database`);

    // Sample job applications
    const jobApplications = [
      {
        job_id: 1, // Will map to the first job
        name: 'Robert Taylor',
        email: 'robert.t@example.com',
        phone: '555-123-4567',
        message: 'I have over 3 years of experience as a tour guide in Europe and Asia. I believe my multilingual skills and passion for cultural experiences make me a strong candidate for this position.',
        status: 'pending'
      },
      {
        job_id: 3, // Will map to the third job
        name: 'Lisa Martinez',
        email: 'lisa.m@example.com',
        phone: '555-987-6543',
        message: 'With 5 years of experience managing social media for travel brands, I have a proven track record of increasing engagement and building communities. I\'m passionate about travel and would love to bring my skills to your team.',
        status: 'reviewed'
      },
      {
        job_id: 5, // Will map to the fifth job
        name: 'James Wilson',
        email: 'james.w@example.com',
        phone: '555-456-7890',
        message: 'As a professional photographer with a focus on travel and landscapes, I\'ve had my work published in National Geographic and Travel + Leisure. I\'m excited about the opportunity to capture the essence of your destinations.',
        status: 'pending'
      }
    ];

    // Insert job applications
    for (const application of jobApplications) {
      const query = `
        INSERT INTO job_applications (
          job_id, name, email, phone, message, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await db.query(query, [
        application.job_id, application.name, application.email, application.phone, application.message, application.status
      ]);
    }

    console.log(`Added ${jobApplications.length} job applications to the database`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed operation
seedUsers();
seedData(); 