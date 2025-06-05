const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); // Assuming a Mongoose model

// Create a problem
router.post('/', async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a problem
router.put('/:id', async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProblem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a problem
router.delete('/:id', async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
