const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    problemStatement: { type: String, required: true },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    constraints: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Difficult'], // Restrict values to these three options
      default: 'Easy', // Default difficulty
    },    // <-- And this
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', ProblemSchema);

