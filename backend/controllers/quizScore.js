const QuizScore = require('../models/QuizScore');

// Save a new quiz score
exports.saveQuizScore = async (req, res) => {
  try {
    // console.log('Received quiz score save request:', req.body);
    // console.log('User from request:', req.user);

    const { experimentNo, score, totalQuestions, timePerQuestion } = req.body;

    // Get the user ID from the authenticated user
    const userId = req.user._id;
    // console.log('User ID for quiz score:', userId);

    // Create a new quiz score
    const quizScore = new QuizScore({
      userId,
      experimentNo,
      score,
      totalQuestions,
      timePerQuestion
    });

    // Save the quiz score
    const savedScore = await quizScore.save();
    // console.log('Quiz score saved successfully:', savedScore);

    res.status(201).json({
      success: true,
      message: 'Quiz score saved successfully',
      data: savedScore
    });
  } catch (error) {
    console.error('Error saving quiz score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save quiz score',
      error: error.message
    });
  }
};

// Get all quiz scores for a user
exports.getUserQuizScores = async (req, res) => {
  try {
    // console.log('Fetching quiz scores for user:', req.user);
    const userId = req.user._id;
    // console.log('User ID for fetching scores:', userId);

    // Get all quiz scores for the user
    const quizScores = await QuizScore.find({ userId })
      .sort({ completedAt: -1 });

    // console.log(`Found ${quizScores.length} quiz scores for user`);

    res.status(200).json({
      success: true,
      data: quizScores
    });
  } catch (error) {
    console.error('Error fetching quiz scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz scores',
      error: error.message
    });
  }
};

// Get quiz scores for a specific experiment
exports.getExperimentQuizScores = async (req, res) => {
  try {
    const userId = req.user._id;
    const { experimentNo } = req.params;

    // Get all quiz scores for the user and experiment
    const quizScores = await QuizScore.find({
      userId,
      experimentNo: parseInt(experimentNo)
    }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      data: quizScores
    });
  } catch (error) {
    console.error('Error fetching experiment quiz scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiment quiz scores',
      error: error.message
    });
  }
}; 