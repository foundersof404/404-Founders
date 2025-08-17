const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Main route for all about page data
router.get('/', aboutController.getAllAboutData);

// Testimonial routes
router.get('/testimonials', aboutController.getAllTestimonials);
router.get('/testimonials/employees', aboutController.getEmployeeTestimonials);
router.get('/testimonials/customers', aboutController.getCustomerTestimonials);
router.post('/testimonials', aboutController.createTestimonial);

// Team members routes
router.get('/team', aboutController.getAllTeamMembers);
router.post('/team', aboutController.createTeamMember);

// Company milestones routes
router.get('/milestones', aboutController.getAllMilestones);
router.post('/milestones', aboutController.createMilestone);

// Company values routes
router.get('/values', aboutController.getAllValues);
router.post('/values', aboutController.createValue);

// Company story routes
router.get('/story', aboutController.getStory);
router.post('/story', aboutController.createStory);

module.exports = router; 
 