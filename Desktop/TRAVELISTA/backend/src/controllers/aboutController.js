const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');
const CompanyMilestone = require('../models/CompanyMilestone');
const CompanyValue = require('../models/CompanyValue');
const CompanyStory = require('../models/CompanyStory');

// Testimonials Controller
exports.getAllTestimonials = async (req, res) => {
  try {
    const { type } = req.query;
    const testimonials = await Testimonial.getAll({ type });
    
    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials'
    });
  }
};

exports.getEmployeeTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getEmployeeTestimonials();
    
    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching employee testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch employee testimonials'
    });
  }
};

exports.getCustomerTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getCustomerTestimonials();
    
    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching customer testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch customer testimonials'
    });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, location, quote, image, rating, type } = req.body;
    
    // Basic validation
    if (!name || !quote || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, quote, and type are required'
      });
    }
    
    const testimonialId = await Testimonial.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Testimonial created successfully',
      data: {
        id: testimonialId
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create testimonial'
    });
  }
};

// Team Members Controller
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.getAll();
    
    res.status(200).json({
      status: 'success',
      results: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch team members'
    });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, role, image, bio, email, display_order } = req.body;
    
    // Basic validation
    if (!name || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and role are required'
      });
    }
    
    const teamMemberId = await TeamMember.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Team member created successfully',
      data: {
        id: teamMemberId
      }
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create team member'
    });
  }
};

// Company Milestones Controller
exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await CompanyMilestone.getAll();
    
    res.status(200).json({
      status: 'success',
      results: milestones.length,
      data: milestones
    });
  } catch (error) {
    console.error('Error fetching company milestones:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch company milestones'
    });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const { title, description, year, icon, display_order } = req.body;
    
    // Basic validation
    if (!title || !description || !year) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, and year are required'
      });
    }
    
    const milestoneId = await CompanyMilestone.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Company milestone created successfully',
      data: {
        id: milestoneId
      }
    });
  } catch (error) {
    console.error('Error creating company milestone:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create company milestone'
    });
  }
};

// Company Values Controller
exports.getAllValues = async (req, res) => {
  try {
    const values = await CompanyValue.getAll();
    
    res.status(200).json({
      status: 'success',
      results: values.length,
      data: values
    });
  } catch (error) {
    console.error('Error fetching company values:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch company values'
    });
  }
};

exports.createValue = async (req, res) => {
  try {
    const { title, description, icon, display_order } = req.body;
    
    // Basic validation
    if (!title || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and description are required'
      });
    }
    
    const valueId = await CompanyValue.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Company value created successfully',
      data: {
        id: valueId
      }
    });
  } catch (error) {
    console.error('Error creating company value:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create company value'
    });
  }
};

// Company Story Controller
exports.getStory = async (req, res) => {
  try {
    const story = await CompanyStory.get();
    
    if (!story) {
      return res.status(404).json({
        status: 'error',
        message: 'No company story found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: story
    });
  } catch (error) {
    console.error('Error fetching company story:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch company story'
    });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content, image, short_description } = req.body;
    
    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and content are required'
      });
    }
    
    const storyId = await CompanyStory.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Company story created successfully',
      data: {
        id: storyId
      }
    });
  } catch (error) {
    console.error('Error creating company story:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create company story'
    });
  }
};

// Get all about page data in one request
exports.getAllAboutData = async (req, res) => {
  try {
    // Fetch all data in parallel
    const [
      employeeTestimonials,
      customerTestimonials,
      teamMembers,
      milestones,
      values,
      story
    ] = await Promise.all([
      Testimonial.getEmployeeTestimonials(),
      Testimonial.getCustomerTestimonials(),
      TeamMember.getAll(),
      CompanyMilestone.getAll(),
      CompanyValue.getAll(),
      CompanyStory.get()
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        employeeTestimonials,
        customerTestimonials,
        teamMembers,
        milestones,
        values,
        story
      }
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch about page data'
    });
  }
}; 