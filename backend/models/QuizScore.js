const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experimentNo: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timePerQuestion: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a compound index to ensure a user can have multiple scores for the same experiment
quizScoreSchema.index({ userId: 1, experimentNo: 1, completedAt: -1 });

module.exports = mongoose.model('QuizScore', quizScoreSchema); 