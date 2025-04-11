import FeedbackForm from './FeedbackForm';
import PropTypes from 'prop-types';

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

ExperimentFeedback.propTypes = {
  experimentNo: PropTypes.string.isRequired, // or PropTypes.number if that's what you're using
  onClose: PropTypes.func, // optional function
};

export default ExperimentFeedback;