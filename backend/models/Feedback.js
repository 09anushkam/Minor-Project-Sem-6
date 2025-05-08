const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    experimentNo: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    understanding: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    usefulness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        default: ''
    },
    suggestions: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Feedback", feedbackSchema); 