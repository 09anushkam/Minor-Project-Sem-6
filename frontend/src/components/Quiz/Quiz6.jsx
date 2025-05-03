import { useState, useEffect } from 'react';
// import axios from 'axios';
import './styles/Quiz.css';

const QUESTION_TIMER = 20; // 20 seconds per question

const Quiz6 = () => {
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
      questionText: "Which Python library is commonly used to analyze social networks through graph structures?",
      options: [
        "Matplotlib",
        "NumPy",
        "NetworkX",
        "Pandas"
      ],
      correctAnswer: 2
    },
    {
      questionText: "In a social network graph, what does a node typically represent?",
      options: [
        "An internet router",
        "A user or individual",
        "A hashtag",
        "A server"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which function is used in NetworkX to create a random graph?",
      options: [
        "nx.draw_random()",
        "nx.create_random()",
        "nx.random_graph()",
        "nx.erdos_renyi_graph()"
      ],
      correctAnswer: 3
    },
    {
      questionText: "Which centrality measure is best suited for identifying influencer nodes?",
      options: [
        "Betweenness centrality",
        "Degree centrality",
        "PageRank",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      questionText: "What does a high degree centrality value indicate about a node?",
      options: [
        "It has fewer connections",
        "It is located at the edge of the graph",
        "It has many direct connections",
        "It never interacts with others"
      ],
      correctAnswer: 2
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

      // const backendUrl = 'http://localhost:8080';
      // await axios.post(`${backendUrl}/api/quiz-scores`, {
      //   experimentNo: 7,
      //   score: score,
      //   totalQuestions: questions.length,
      //   timePerQuestion: QUESTION_TIMER
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
    } catch (error) {
      console.error('Error saving score:', error.message);
      // Continue showing the score even if saving fails
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

export default Quiz6; 