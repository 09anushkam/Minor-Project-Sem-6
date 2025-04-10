const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback, getAllFeedback } = require('../controllers/feedback');
// const { isAuthenticated } = require('../middleware');

// Debug route to test if feedback routes are loaded
router.get('/test', (req, res) => {
    res.json({ message: 'Feedback routes are working' });
});

// Submit feedback for an experiment
router.post('/experiment-feedback', submitFeedback);

// Get user's feedback for a specific experiment
router.get('/experiment-feedback/:experimentNo', getFeedback);

// Get all feedback for an experiment (admin only)
router.get('/experiment-feedback/:experimentNo/all', getAllFeedback);

module.exports = router;