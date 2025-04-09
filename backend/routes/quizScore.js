const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware');
const { 
  saveQuizScore, 
  getUserQuizScores, 
  getExperimentQuizScores 
} = require('../controllers/quizScore');

// Save a new quiz score
router.post('/quiz-scores', isAuthenticated, saveQuizScore);

// Get all quiz scores for the logged-in user
router.get('/quiz-scores', isAuthenticated, getUserQuizScores);

// Get quiz scores for a specific experiment
router.get('/quiz-scores/experiment/:experimentNo', isAuthenticated, getExperimentQuizScores);

module.exports = router; 