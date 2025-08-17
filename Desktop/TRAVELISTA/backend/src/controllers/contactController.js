const ContactMessage = require('../models/ContactMessage');

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }
    
    const messageId = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully',
      data: {
        id: messageId
      }
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { status, email } = req.query;
    const messages = await ContactMessage.getAll({ status, email });
    
    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages'
    });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.getById(messageId);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }
    
    // Automatically mark as read if it was unread
    if (message.status === 'unread') {
      await ContactMessage.updateStatus(messageId, 'read');
      message.status = 'read';
    }
    
    res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    console.error(`Error fetching message ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch message'
    });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { status } = req.body;
    
    if (!status || !['unread', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid status is required'
      });
    }
    
    const message = await ContactMessage.getById(messageId);
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }
    
    const success = await ContactMessage.updateStatus(messageId, status);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to update message status'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Message status updated successfully'
    });
  } catch (error) {
    console.error(`Error updating message status ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update message status'
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.getById(messageId);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }
    
    const success = await ContactMessage.delete(messageId);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to delete message'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting message ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message'
    });
  }
};

exports.getMessageStats = async (req, res) => {
  try {
    const stats = await ContactMessage.getStats();
    
    // Convert to a more user-friendly format
    const statsMap = {
      unread: 0,
      read: 0,
      replied: 0,
      archived: 0
    };
    
    stats.forEach(item => {
      statsMap[item.status] = item.count;
    });
    
    res.status(200).json({
      status: 'success',
      data: statsMap
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch message statistics'
    });
  }
}; 