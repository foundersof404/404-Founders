const express = require('express');
const router = express.Router();
const PopularDestination = require('../models/PopularDestination');

// Get all popular destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await PopularDestination.getAll();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    res.status(500).json({ error: 'Failed to fetch popular destinations' });
  }
});

// Get a specific popular destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await PopularDestination.getById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Popular destination not found' });
    }
    res.json(destination);
  } catch (error) {
    console.error(`Error fetching popular destination with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch popular destination' });
  }
});

// Create a new popular destination
router.post('/', async (req, res) => {
  try {
    const { country, name, image, description, rating } = req.body;
    
    // Validate required fields
    if (!country || !name || !image || !description || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = { country, name, image, description, rating };
    const id = await PopularDestination.create(data);
    
    res.status(201).json({ id, ...data });
  } catch (error) {
    console.error('Error creating popular destination:', error);
    res.status(500).json({ error: 'Failed to create popular destination' });
  }
});

// Update a popular destination
router.put('/:id', async (req, res) => {
  try {
    const { country, name, image, description, rating } = req.body;
    
    // Validate required fields
    if (!country || !name || !image || !description || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = { country, name, image, description, rating };
    const success = await PopularDestination.update(req.params.id, data);
    
    if (!success) {
      return res.status(404).json({ error: 'Popular destination not found' });
    }
    
    res.json({ id: req.params.id, ...data });
  } catch (error) {
    console.error(`Error updating popular destination with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update popular destination' });
  }
});

// Delete a popular destination
router.delete('/:id', async (req, res) => {
  try {
    const success = await PopularDestination.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Popular destination not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting popular destination with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete popular destination' });
  }
});

module.exports = router; 