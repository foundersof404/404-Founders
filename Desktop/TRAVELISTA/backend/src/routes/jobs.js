const express = require('express');
const jobController = require('../controllers/jobController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage for CV uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/cv');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Create upload middleware with file type filter
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Accept only PDF, DOC, DOCX files
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max size
  }
});

const router = express.Router();

// Job Offers routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Job Applications routes
router.post('/:id/apply', upload.single('cv'), jobController.applyForJob);
router.post('/general-application', upload.single('cv'), jobController.submitGeneralApplication);
router.get('/:id/applications', jobController.getApplicationsForJob);
router.get('/applications', jobController.getAllApplications);
router.patch('/applications/:id/status', jobController.updateApplicationStatus);

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  next(err);
});

module.exports = router; 