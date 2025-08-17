const JobOffer = require('../models/JobOffer');
const JobApplication = require('../models/JobApplication');
const path = require('path');
const fs = require('fs');

// Job Offers Controllers
exports.getAllJobs = async (req, res) => {
  try {
    const { type, location } = req.query;
    let jobs;
    
    if (type || location) {
      jobs = await JobOffer.getByFilters({ type, location });
    } else {
      jobs = await JobOffer.getAll();
    }
    
    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job offers'
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobOffer.getById(jobId);
    
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job offer not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: job
    });
  } catch (error) {
    console.error(`Error fetching job ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job offer'
    });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, type } = req.body;
    
    // Basic validation
    if (!title || !description || !requirements || !location || !salary || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }
    
    const jobId = await JobOffer.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Job offer created successfully',
      data: {
        id: jobId
      }
    });
  } catch (error) {
    console.error('Error creating job offer:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create job offer'
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobOffer.getById(jobId);
    
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job offer not found'
      });
    }
    
    const success = await JobOffer.update(jobId, req.body);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to update job offer'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Job offer updated successfully'
    });
  } catch (error) {
    console.error(`Error updating job ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job offer'
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobOffer.getById(jobId);
    
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job offer not found'
      });
    }
    
    const success = await JobOffer.delete(jobId);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to delete job offer'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Job offer deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting job ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job offer'
    });
  }
};

// Job Applications Controllers
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required'
      });
    }
    
    // Check if job exists
    const job = await JobOffer.getById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job offer not found'
      });
    }
    
    let cvPath = null;
    
    // Handle file upload if a CV was provided
    if (req.file) {
      cvPath = `/uploads/cv/${path.basename(req.file.path)}`;
    }
    
    const applicationId = await JobApplication.create({
      job_id: jobId,
      name,
      email,
      phone,
      message,
      cv_path: cvPath
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: {
        id: applicationId
      }
    });
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit application'
    });
  }
};

exports.submitGeneralApplication = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required'
      });
    }
    
    let cvPath = null;
    
    // Handle file upload if a CV was provided
    if (req.file) {
      cvPath = `/uploads/cv/${path.basename(req.file.path)}`;
    }
    
    const applicationId = await JobApplication.create({
      job_id: null, // General application
      name,
      email,
      phone,
      message,
      cv_path: cvPath
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: {
        id: applicationId
      }
    });
  } catch (error) {
    console.error('Error submitting general application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit application'
    });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Check if job exists
    const job = await JobOffer.getById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job offer not found'
      });
    }
    
    const applications = await JobApplication.getByJobId(jobId);
    
    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: applications
    });
  } catch (error) {
    console.error(`Error fetching applications for job ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch applications'
    });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const { status, email } = req.query;
    const applications = await JobApplication.getAllApplications({ status, email });
    
    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job applications'
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    
    if (!status || !['pending', 'reviewed', 'contacted', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid status is required'
      });
    }
    
    const application = await JobApplication.getById(applicationId);
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }
    
    const success = await JobApplication.updateStatus(applicationId, status);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to update application status'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error(`Error updating application status ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update application status'
    });
  }
}; 