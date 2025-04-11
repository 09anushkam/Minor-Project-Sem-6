const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');
const { isAuthenticated } = require('../middleware');

// Debug route to test if feedback routes are loaded
router.get('/test', (req, res) => {
    res.json({ message: 'Feedback routes are working' });
});

// Submit feedback for an experiment
router.post('/experiment-feedback', isAuthenticated, feedbackController.submitFeedback);

// Get user's feedback for a specific experiment
router.get('/experiment-feedback/:experimentNo', isAuthenticated, feedbackController.getFeedback);

// Get all feedback for an experiment (admin only)
router.get('/experiment-feedback/:experimentNo/all', isAuthenticated, feedbackController.getAllFeedback);

module.exports = router; 