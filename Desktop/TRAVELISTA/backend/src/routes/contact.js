const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

// Contact message routes
router.post('/', contactController.submitContactMessage);
router.get('/', contactController.getAllMessages);
router.get('/stats', contactController.getMessageStats);
router.get('/:id', contactController.getMessageById);
router.patch('/:id/status', contactController.updateMessageStatus);
router.delete('/:id', contactController.deleteMessage);

module.exports = router; 