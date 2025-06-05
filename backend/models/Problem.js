const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemStatement: { type: String, required: true },
  exampleInput: { type: String, required: true },
  exampleOutput: { type: String, required: true },
  constraints: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
