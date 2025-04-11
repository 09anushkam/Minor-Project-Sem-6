const express = require('express');
const router = express.Router();
// const { isAuthenticated } = require('../middleware');
const {
  saveQuizScore,
  getUserQuizScores,
  getExperimentQuizScores
} = require('../controllers/quizScore');

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Quiz score routes are working' });
});

// Save a new quiz score
router.post('/quiz-scores', saveQuizScore);

// Get all quiz scores for the logged-in user
router.get('/quiz-scores', getUserQuizScores);

// Get quiz scores for a specific experiment
router.get('/quiz-scores/experiment/:experimentNo', getExperimentQuizScores);

module.exports = router;