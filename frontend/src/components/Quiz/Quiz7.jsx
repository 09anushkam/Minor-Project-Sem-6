import { useState, useEffect } from 'react';
// import axios from 'axios';
import './styles/Quiz.css';

const QUESTION_TIMER = 20; // 20 seconds per question

const Quiz7 = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(QUESTION_TIMER);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = [
    {
      questionText: "What does TF-IDF stand for?",
      options: [
        "Total Frequency-Inverse Data Function",
        "Term Frequency-Inverse Document Frequency",
        "Text Filter-Inverse Data Format",
        "Term Filter-Indexed Data Factor"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What does a high TF-IDF score indicate about a word in a document?",
      options: [
        "It is very common across all documents",
        "It is not important in the current document",
        "It is important in this document but rare in others",
        "It is used only in hashtags"
      ],
      correctAnswer: 2
    },
    {
      questionText: "In the TF-IDF formula, what does 'Term Frequency (TF)' measure?",
      options: [
        "How often a term appears in all documents",
        "The length of the document",
        "How often a term appears in a specific document",
        "The number of users using a term"
      ],
      correctAnswer: 2
    },
    {
      questionText: "What is the purpose of using IDF (Inverse Document Frequency)?",
      options: [
        "To give more importance to common terms",
        "To reduce the weight of frequently occurring terms across documents",
        "To calculate document similarity",
        "To sort terms alphabetically"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which of the following is a practical use of TF-IDF in social media analysis?",
      options: [
        "Identifying trending hashtags",
        "Counting user followers",
        "Sorting image filters",
        "Measuring likes on posts"
      ],
      correctAnswer: 0
    }
  ];



  useEffect(() => {
    let interval = null;

    if (hasStarted && !showScore && !isAnswered && timer > 0) {
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
  }, [timer, showScore, isAnswered, hasStarted]);

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
      setShowScore(true);
      saveScore();
    }
  };

  const saveScore = async () => {
    try {
      // const backendUrl = 'http://localhost:8080';
      // await axios.post(`${backendUrl}/api/quiz-scores`, {
      //   experimentNo: 7,
      //   score: score,
      //   totalQuestions: questions.length,
      //   timePerQuestion: QUESTION_TIMER
      // }, {
      //   withCredentials: true
      // });
      // console.log('Quiz score saved successfully');
    } catch (error) {
      console.error('Error saving score:', error);
      // Show error to user
      alert('Failed to save your quiz score. Please try again later.');
    }
  };

  const restartQuiz = () => {
    setHasStarted(false);
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
      {!hasStarted ? (
        <div className="start-section">
          <h2>Ready to Start the Quiz?</h2>
          <button className="start-button" onClick={() => setHasStarted(true)}>
            Start Quiz
          </button>
        </div>
      ) : showScore ? (
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
                backgroundColor: timer <= 5 ? 'red' : '#9B2928'
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

export default Quiz7; 