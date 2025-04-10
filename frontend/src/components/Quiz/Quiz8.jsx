import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Quiz.css';

const QUESTION_TIMER = 20; // 20 seconds per question

const Quiz8 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(QUESTION_TIMER);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = [
    {
      questionText: "What is a central user in a social network graph?",
      options: [
        "A user with no followers",
        "A user with the shortest average distance to all other users",
        "A user who posts the most photos",
        "A user who sends the most messages"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which centrality measure identifies users who connect different groups in a network?",
      options: [
        "Degree centrality",
        "Betweenness centrality",
        "Closeness centrality",
        "Eigenvector centrality"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In a social media graph, what does an edge typically represent?",
      options: [
        "A user's profile picture",
        "A connection or interaction between users",
        "A user's age",
        "A user's location"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which algorithm is commonly used to detect communities in a network?",
      options: [
        "Dijkstra's Algorithm",
        "Prim's Algorithm",
        "Louvain Algorithm",
        "Kruskal's Algorithm"
      ],
      correctAnswer: 2
    },
    {
      questionText: "What does a high degree centrality indicate about a user?",
      options: [
        "The user is inactive",
        "The user is connected to many others",
        "The user posts only once a week",
        "The user avoids interactions"
      ],
      correctAnswer: 1
    }
  ];



  useEffect(() => {
    let interval = null;

    if (!showScore && !isAnswered && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            handleTimeUp();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, showScore, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowCorrectAnswer(true);
    setTimeout(moveToNextQuestion, 2000);
  };

  const handleAnswerClick = async (selectedOption) => {
    setIsAnswered(true);
    setSelectedAnswer(selectedOption);
    setShowCorrectAnswer(true);

    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(moveToNextQuestion, 2000);
  };

  const moveToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setIsAnswered(false);
      setTimer(QUESTION_TIMER);
    } else {
      saveScore();
      setShowScore(true);
    }
  };

  const saveScore = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found. Score will not be saved.');
        return;
      }

      const backendUrl = 'http://localhost:8080';
      await axios.post(`${backendUrl}/api/quiz-scores`, {
        experimentNo: 8,
        score: score,
        totalQuestions: questions.length,
        timePerQuestion: QUESTION_TIMER
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error saving score:', error.message);
      // Continue showing the score even if saving fails
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setTimer(QUESTION_TIMER);
    setShowCorrectAnswer(false);
    setIsAnswered(false);
  };

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>You scored {score} out of {questions.length}</p>
          <button className="restart-button" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="question-section">
          <div className="timer-section">
            <div className="timer">
              Time Remaining: {timer}s
            </div>
            <div
              className="timer-bar"
              style={{
                width: `${(timer / QUESTION_TIMER) * 100}%`,
                backgroundColor: timer <= 5 ? '#ff4444' : '#ff6b6b'
              }}
            ></div>
          </div>

          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/{questions.length}
          </div>

          <div className="question-text">
            {questions[currentQuestion].questionText}
          </div>

          <div className="answer-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`answer-button 
                  ${selectedAnswer === index ?
                    (index === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect')
                    : ''
                  }
                  ${showCorrectAnswer && index === questions[currentQuestion].correctAnswer ? 'correct' : ''}
                `}
                onClick={() => !isAnswered && handleAnswerClick(index)}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>

          {showCorrectAnswer && selectedAnswer !== questions[currentQuestion].correctAnswer && (
            <div className="correct-answer-message">
              Correct Answer: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
            </div>
          )}

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz8; 