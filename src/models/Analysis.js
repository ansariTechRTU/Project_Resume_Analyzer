
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchSchema = new Schema({
  skill: String,
  present: Boolean,
  snippet: String
});

const AnalysisSchema = new Schema({
  resumeOriginalName: String,
  resumePath: String,
  resumeTextSnippet: String,

  jobDescOriginalName: String,
  jobDescText: String,

  extractedSkills: [String],
  missingSkills: [String],
  matches: [MatchSchema],
  score: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
