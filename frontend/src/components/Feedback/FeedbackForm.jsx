import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './FeedbackForm.css';
import { AuthContext } from '../../utils/authContext';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = ({ experimentNo }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    understanding: '',
    difficulty: '',
    usefulness: '',
    comments: '',
    suggestions: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasPreviousFeedback, setHasPreviousFeedback] = useState(false);

  useEffect(() => {
    const fetchPreviousFeedback = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
        const response = await axios.get(
          `${backendUrl}/api/feedback/experiment-feedback/${experimentNo}`,
          { withCredentials: true }
        );

        if (response.data) {
          setFeedback({
            understanding: response.data.understanding,
            difficulty: response.data.difficulty,
            usefulness: response.data.usefulness,
            comments: response.data.comments || '',
            suggestions: response.data.suggestions || ''
          });
          setHasPreviousFeedback(true);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Error fetching feedback:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousFeedback();
  }, [experimentNo, user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: type === 'radio' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setError('Please login to submit feedback');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      // Check if rating fields are filled
      if (!feedback.understanding || !feedback.difficulty || !feedback.usefulness) {
        setError('Please provide ratings for all fields');
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      await axios.post(`${backendUrl}/api/feedback/experiment-feedback`, {
        experimentNo,
        ...feedback
      }, {
        withCredentials: true
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Please login to submit feedback');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(error.response.data.message || 'Failed to submit feedback. Please try again.');
        }
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-success">
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <button
            className="submit-button"
            onClick={() => setSubmitted(false)}
            style={{ marginTop: '20px' }}
          >
            Edit Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <h2>Feedback Form</h2>
      {hasPreviousFeedback ? (
        <div className="previous-feedback-notice">
          <p>You have already submitted feedback for this experiment. You can update your feedback below.</p>
          <div className="previous-feedback-summary">
            <h3>Your Previous Feedback:</h3>
            <p>Understanding: {feedback.understanding}/5</p>
            <p>Difficulty: {feedback.difficulty}/5</p>
            <p>Usefulness: {feedback.usefulness}/5</p>
            {feedback.comments && <p>Comments: {feedback.comments}</p>}
            {feedback.suggestions && <p>Suggestions: {feedback.suggestions}</p>}
          </div>
        </div>
      ) : (
        <p className="feedback-description">
          Please help us improve by providing your feedback on this experiment.
        </p>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="feedback-field">
          <label>How well did you understand the concepts?</label>
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="rating-label">
                <input
                  type="radio"
                  name="understanding"
                  value={value}
                  checked={feedback.understanding === value}
                  onChange={handleChange}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="feedback-field">
          <label>How difficult was the experiment?</label>
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="rating-label">
                <input
                  type="radio"
                  name="difficulty"
                  value={value}
                  checked={feedback.difficulty === value}
                  onChange={handleChange}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="feedback-field">
          <label>How useful was this experiment?</label>
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="rating-label">
                <input
                  type="radio"
                  name="usefulness"
                  value={value}
                  checked={feedback.usefulness === value}
                  onChange={handleChange}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="feedback-field">
          <label>Additional Comments:</label>
          <textarea
            name="comments"
            value={feedback.comments}
            onChange={handleChange}
            placeholder="Share your thoughts about the experiment..."
            rows="3"
          />
        </div>

        <div className="feedback-field">
          <label>Suggestions for Improvement:</label>
          <textarea
            name="suggestions"
            value={feedback.suggestions}
            onChange={handleChange}
            placeholder="What could make this experiment better?"
            rows="3"
          />
        </div>

        {error && <div className="feedback-error">{error}</div>}

        <div className="feedback-buttons">
          <button type="submit" className="submit-button">
            {hasPreviousFeedback ? 'Update Feedback' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

FeedbackForm.propTypes = {
  experimentNo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default FeedbackForm; 