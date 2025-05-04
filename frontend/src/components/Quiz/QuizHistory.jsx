import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles/QuizHistory.css';

const QuizHistory = () => {
  const [quizScores, setQuizScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const experimentNames = {
    1: "Bernoulli's Principle",
    2: "Web Scraping",
    3: "Sentiment Analysis",
    4: "Topic Modeling",
    5: "Graph Traversal",
    6: "Social Network Analysis",
    7: "Network Centrality",
    8: "Community Detection"
  };

  useEffect(() => {
    const fetchQuizScores = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/api/quiz-scores`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.success) {
          // Initialize all experiments with empty arrays
          const allExperiments = {};
          Object.keys(experimentNames).forEach(expNo => {
            allExperiments[expNo] = [];
          });

          // Add actual scores to experiments that have been attempted
          response.data.data.forEach(score => {
            if (allExperiments[score.experimentNo]) {
              allExperiments[score.experimentNo].push(score);
              // Sort scores within each experiment by date (newest first)
              allExperiments[score.experimentNo].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
            }
          });

          setQuizScores(allExperiments);
        } else {
          setError('Failed to fetch quiz scores');
        }
      } catch (error) {
        console.error('Error fetching quiz scores:', error);
        if (error.response) {
          if (error.response.status === 401) {
            navigate('/login');
          } else if (error.response.status === 404) {
            setError('Quiz scores service is currently unavailable');
          } else {
            setError(`Failed to fetch quiz scores: ${error.response.data?.message || 'Unknown error'}`);
          }
        } else {
          setError('Failed to connect to the server. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizScores();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getExperimentName = (experimentNo) => {
    return experimentNames[experimentNo] || `Experiment ${experimentNo}`;
  };

  const handleRetakeQuiz = (experimentNo) => {
    navigate(`/experiment/${experimentNo}?section=Quiz`);
  };

  const getHighestScore = (scores) => {
    if (scores.length === 0) return 0;
    return Math.max(...scores.map(score => (score.score / score.totalQuestions) * 100));
  };

  const getAverageScore = (scores) => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + (score.score / score.totalQuestions) * 100, 0);
    return total / scores.length;
  };

  const getProgressStyle = (percentage) => {
    return {
      '--progress': `${percentage}%`
    };
  };

  const getOverallProgress = () => {
    const totalExperiments = Object.keys(experimentNames).length;
    const attemptedExperiments = Object.values(quizScores).filter(scores => scores.length > 0).length;
    const overallPercentage = (attemptedExperiments / totalExperiments) * 100;

    const totalBestScores = Object.values(quizScores).reduce((acc, scores) => {
      return acc + getHighestScore(scores);
    }, 0);
    const averageBestScore = totalBestScores / totalExperiments;

    return {
      attempted: attemptedExperiments,
      total: totalExperiments,
      percentage: overallPercentage,
      averageScore: averageBestScore
    };
  };

  if (loading) {
    return (
      <div className="quiz-history-container">
        <h2>Quiz Dashboard</h2>
        <div className="quiz-history-loading">Loading quiz history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-history-container">
        <h2>Quiz Dashboard</h2>
        <div className="quiz-history-error">{error}</div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src="https://kjsieit.somaiya.edu.in/assets/kjsieit/images/Logo/Somaiya-Logo.svg"
            alt="Somaiya Logo"
            className="nav-logo"
          />
          <span className="college-name">K J Somaiya Institute of Technology</span>
        </div>
        <div className="navbar-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/experiments" className="nav-link">Experiments</Link>
          <Link to="/quiz-history" className="nav-link active">Quiz History</Link>
          <button onClick={() => navigate('/logout')} className="logout-btn">Logout</button>
        </div>
      </nav>
      <div className="quiz-history-container">
        <h2>Quiz Dashboard</h2>
        <div className="overall-progress">
          <div className="progress-header">
            <h3>Overall Progress</h3>
            <div className="progress-circle large" style={getProgressStyle(overallProgress.percentage)}>
              <span className="progress-value">{overallProgress.percentage.toFixed(0)}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-value">{overallProgress.attempted}/{overallProgress.total}</span>
              <span className="stat-label">Experiments Attempted</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{overallProgress.averageScore.toFixed(1)}%</span>
              <span className="stat-label">Average Best Score</span>
            </div>
          </div>
        </div>
        <div className="quiz-dashboard-grid">
          {Object.entries(quizScores).map(([experimentNo, scores]) => {
            const bestScore = getHighestScore(scores);
            return (
              <div key={experimentNo} className={`experiment-card ${scores.length === 0 ? 'not-attempted' : ''}`}>
                <div className="experiment-header">
                  <h3>{getExperimentName(parseInt(experimentNo))}</h3>
                  <div className="progress-circle" style={getProgressStyle(bestScore)}>
                    <span className="progress-value">{bestScore.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="score-summary">
                  <div className="summary-item">
                    <span className="summary-label">Attempts</span>
                    <span className="summary-value">{scores.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Best Score</span>
                    <span className="summary-value">{bestScore.toFixed(1)}%</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Average</span>
                    <span className="summary-value">{getAverageScore(scores).toFixed(1)}%</span>
                  </div>
                </div>
                {scores.length > 0 ? (
                  <div className="attempt-list">
                    <h4>Recent Attempts</h4>
                    {scores.slice(0, 3).map((score, index) => (
                      <div key={score._id || index} className="attempt-item">
                        <div className="attempt-info">
                          <span className="attempt-date">{formatDate(score.completedAt)}</span>
                          <span className="attempt-score">
                            {score.score}/{score.totalQuestions} ({((score.score / score.totalQuestions) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-attempts">
                    <p>No attempts yet</p>
                    <p>Take this quiz to test your knowledge!</p>
                  </div>
                )}
                <button
                  className="retake-quiz-button"
                  onClick={() => handleRetakeQuiz(parseInt(experimentNo))}
                >
                  {scores.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory; 