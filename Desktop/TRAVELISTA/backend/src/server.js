require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/jobs');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/aboutRoutes');
const popularDestinationsRoutes = require('./routes/PopularDestinations');
const galleryRoutes = require('./routes/gallery'); // Add gallery routes
const http = require('http');
const db = require('./config/db');

// Initialize Express
const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test database connection
db.testConnection()
  .then(connected => {
    if (!connected) {
      console.warn('Database connection failed. Some features may not work properly.');
    }
  })
  .catch(err => {
    console.error('Database error:', err);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/popular-destinations', popularDestinationsRoutes);
app.use('/api/gallery', galleryRoutes); // Add gallery routes

// Admin replies to a message and notifies the user
app.post('/api/admin/messages/:id/reply', async (req, res) => {
  try {
    const messageId = req.params.id;
    const { reply_text, admin_id } = req.body;
    if (!reply_text) {
      return res.status(400).json({ error: 'Reply text is required' });
    }
    // Save reply
    await db.query(
      'INSERT INTO admin_replies (message_id, admin_id, reply_text) VALUES (?, ?, ?)',
      [messageId, admin_id || null, reply_text]
    );
    // Find the user who sent the message
    const [msg] = await db.query('SELECT email, name FROM contact_messages WHERE id = ?', [messageId]);
    if (msg && msg.email) {
      // Find user by email
      const [user] = await db.query('SELECT id FROM users WHERE email = ?', [msg.email]);
      if (user && user.id) {
        // Create notification with formatted message
        const notificationContent = `Admin responded to you by: ${reply_text}`;
        await db.query(
          'INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)',
          [user.id, 'admin_reply', notificationContent]
        );
      }
    }
    res.status(201).json({ message: 'Reply sent and notification created' });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message: message
  });
});

// Create server with ability to handle port conflicts
const server = http.createServer(app);

// Function to find an available port
function startServer(port) {
  try {
    server.listen(port);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
  
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}`);
      // Ensure we're within valid port range
      if (port + 1 > 65535) {
        port = 3000;
      }
      setTimeout(() => {
        server.close();
        startServer(port + 1);
      }, 1000);
    } else {
      console.error('Server error:', e);
      process.exit(1);
    }
  });
  
  server.on('listening', () => {
    const addr = server.address();
    const actualPort = addr.port;
    console.log(`Server is running on port ${actualPort}`);
    
    // Update the environment variable so other code can use the correct port
    process.env.PORT = actualPort;
    
    // Set API_URL if not already set
    if (!process.env.API_URL) {
      const baseUrl = process.env.APP_ENV === 'production' 
        ? process.env.APP_URL 
        : `http://localhost:${actualPort}`;
      process.env.API_URL = baseUrl;
      console.log(`API URL set to: ${process.env.API_URL}`);
    }
  });
}

// Start the server
startServer(DEFAULT_PORT);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Gracefully shutdown in case of uncaught exception
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Gracefully shutdown in case of unhandled rejection
  process.exit(1);
});

module.exports = app;