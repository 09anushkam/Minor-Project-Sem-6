const Feedback = require('../models/Feedback');

module.exports.submitFeedback = async (req, res) => {
    // console.log('Received feedback submission request');
    try {
        const { experimentNo, understanding, difficulty, usefulness, comments, suggestions } = req.body;
        // console.log('Request body:', req.body);
        // console.log('Session:', req.session);
        // console.log('User:', req.user);

        if (!req.isAuthenticated() || !req.user) {
            console.log('No authenticated user found');
            return res.status(401).json({ message: 'Please login to submit feedback' });
        }

        // Check if feedback already exists for this user and experiment
        const existingFeedback = await Feedback.findOne({
            userId: req.user._id,
            experimentNo: experimentNo
        });

        if (existingFeedback) {
            // Update existing feedback
            existingFeedback.understanding = understanding;
            existingFeedback.difficulty = difficulty;
            existingFeedback.usefulness = usefulness;
            existingFeedback.comments = comments;
            existingFeedback.suggestions = suggestions;
            await existingFeedback.save();
            console.log('Feedback updated successfully');
            return res.status(200).json({ message: 'Feedback updated successfully' });
        }

        // Create new feedback
        const feedback = new Feedback({
            experimentNo,
            userId: req.user._id,
            understanding,
            difficulty,
            usefulness,
            comments,
            suggestions
        });

        // console.log('Created feedback object:', feedback);
        await feedback.save();
        console.log('Feedback saved successfully');
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Get feedback for a specific experiment and user
module.exports.getFeedback = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ message: 'Please login to view feedback' });
        }

        const experimentNo = parseInt(req.params.experimentNo);
        if (isNaN(experimentNo)) {
            return res.status(400).json({ message: 'Invalid experiment number' });
        }

        // console.log('Fetching feedback for experiment:', experimentNo, 'user:', req.user._id);
        const feedback = await Feedback.findOne({
            userId: req.user._id,
            experimentNo: experimentNo
        });

        if (!feedback) {
            return res.status(404).json({ message: 'No feedback found for this experiment' });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error getting feedback:', error);
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

// Get all feedback for an experiment (admin only)
module.exports.getAllFeedback = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { experimentNo } = req.params;
        const feedbacks = await Feedback.find({ experimentNo })
            .populate('userId', 'name email')
            .sort('-createdAt');

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error getting all feedback:', error);
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};