import { useState } from 'react';
import PropTypes from 'prop-types';
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

FeedbackButton.propTypes = {
  experimentNo: PropTypes.string.isRequired, // or PropTypes.number if it's a number
};

export default FeedbackButton; 