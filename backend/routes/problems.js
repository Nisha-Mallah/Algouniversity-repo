const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); // Assuming Mongoose model

// Create a problem
router.post('/', async (req, res) => {
  try {
    const { title, problemStatement, examples, testCases, constraints, difficulty } = req.body;

    // Validate difficulty
    if (!['Easy', 'Medium', 'Difficult'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level. Allowed values are Easy, Medium, or Difficult.' });
    }

    // Validate examples and testCases
    if (!Array.isArray(examples) || examples.length === 0) {
      return res.status(400).json({ error: 'Examples must be a non-empty array.' });
    }
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ error: 'Test cases must be a non-empty array.' });
    }

    // Create and save new problem
    const newProblem = new Problem({ title, problemStatement, examples, testCases, constraints, difficulty });
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// **Get a single problem by ID (added this)**
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a problem
router.put('/:id', async (req, res) => {
  try {
    const { title, problemStatement, examples, testCases, constraints, difficulty } = req.body;

    // Validate difficulty if provided
    if (difficulty && !['Easy', 'Medium', 'Difficult'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level. Allowed values are Easy, Medium, or Difficult.' });
    }

    // Validate examples and testCases if provided
    if (examples && (!Array.isArray(examples) || examples.length === 0)) {
      return res.status(400).json({ error: 'Examples must be a non-empty array.' });
    }
    if (testCases && (!Array.isArray(testCases) || testCases.length === 0)) {
      return res.status(400).json({ error: 'Test cases must be a non-empty array.' });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, problemStatement, examples, testCases, constraints, difficulty },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    res.status(200).json(updatedProblem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a problem
router.delete('/:id', async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);

    if (!deletedProblem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
