import React from 'react';
import FeedbackForm from './FeedbackForm';

const ExperimentFeedback = ({ experimentNo, onClose }) => {
  return (
    <div className="experiment-feedback-container">
      <div className="experiment-feedback-header">
        <h2>Experiment {experimentNo} Feedback</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <FeedbackForm experimentNo={experimentNo} />
    </div>
  );
};

export default ExperimentFeedback; 