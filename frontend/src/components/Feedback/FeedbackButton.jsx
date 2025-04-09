import React, { useState } from 'react';
import ExperimentFeedback from './ExperimentFeedback';

const FeedbackButton = ({ experimentNo }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedbackClick = () => {
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
  };

  if (showFeedback) {
    return <ExperimentFeedback experimentNo={experimentNo} onClose={handleFeedbackClose} />;
  }

  return (
    <button className="feedback-button" onClick={handleFeedbackClick}>
      Provide Feedback
    </button>
  );
};

export default FeedbackButton; 