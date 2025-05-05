// import { useState, useEffect } from 'react';
// // import axios from 'axios';
// import './styles/Quiz.css';

// const QUESTION_TIMER = 20;

// const Quiz1 = () => {
//   const [hasStarted, setHasStarted] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [timer, setTimer] = useState(QUESTION_TIMER);
//   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
//   const [isAnswered, setIsAnswered] = useState(false);

//   const questions = [
//     {
//       questionText: "What is Bernoulli's Principle?",
//       options: [
//         "An increase in the velocity of a fluid occurs simultaneously with a decrease in pressure",
//         "Pressure remains constant regardless of velocity",
//         "Velocity decreases as pressure decreases",
//         "Pressure and velocity are not related in fluids"
//       ],
//       correctAnswer: 0
//     },
//     {
//       questionText: "In a fluid flow, when the velocity increases:",
//       options: [
//         "Pressure increases",
//         "Pressure decreases",
//         "Pressure remains the same",
//         "Velocity has no effect on pressure"
//       ],
//       correctAnswer: 1
//     },
//     {
//       questionText: "Which of the following is an application of Bernoulli's principle?",
//       options: [
//         "Submarine navigation",
//         "Aircraft wings",
//         "Hydraulic press",
//         "Newton's cradle"
//       ],
//       correctAnswer: 1
//     },
//     {
//       questionText: "The Bernoulli equation is based on the principle of:",
//       options: [
//         "Conservation of mass",
//         "Conservation of energy",
//         "Conservation of momentum",
//         "Conservation of volume"
//       ],
//       correctAnswer: 1
//     },
//     {
//       questionText: "What happens to the pressure in a constricted section of a pipe where fluid flows?",
//       options: [
//         "Pressure increases",
//         "Pressure decreases",
//         "Pressure remains constant",
//         "Pressure becomes zero"
//       ],
//       correctAnswer: 1
//     }
//   ];

//   useEffect(() => {
//     let interval = null;

//     if (hasStarted && !showScore && !isAnswered && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 1) {
//             handleTimeUp();
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [timer, showScore, isAnswered, hasStarted]);

//   const handleTimeUp = () => {
//     setIsAnswered(true);
//     setShowCorrectAnswer(true);
//     setTimeout(moveToNextQuestion, 2000);
//   };

//   const handleAnswerClick = async (selectedOption) => {
//     setIsAnswered(true);
//     setSelectedAnswer(selectedOption);
//     setShowCorrectAnswer(true);

//     const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
//     if (isCorrect) {
//       setScore(score + 1);
//     }

//     setTimeout(moveToNextQuestion, 2000);
//   };

//   const moveToNextQuestion = () => {
//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//       setSelectedAnswer(null);
//       setShowCorrectAnswer(false);
//       setIsAnswered(false);
//       setTimer(QUESTION_TIMER);
//     } else {
//       saveScore();
//       setShowScore(true);
//     }
//   };

//   const saveScore = async () => {
//     try {
//       // const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
//       // await axios.post(`${backendUrl}/api/quiz-scores`, {
//       //   experimentNo: 1,
//       //   score: score,
//       //   totalQuestions: questions.length,
//       //   timePerQuestion: QUESTION_TIMER
//       // }, {
//       //   withCredentials: true
//       // });
//       // console.log('Quiz score saved successfully');
//     } catch (error) {
//       console.error('Error saving score:', error);
//       // Show error to user
//       alert('Failed to save your quiz score. Please try again later.');
//     }
//   };

//   const restartQuiz = () => {
//     setHasStarted(false);
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//     setSelectedAnswer(null);
//     setTimer(QUESTION_TIMER);
//     setShowCorrectAnswer(false);
//     setIsAnswered(false);
//   };

//   return (
//     <div className="quiz-container">
//       {!hasStarted ? (
//         <div className="start-section">
//           <h2>Ready to Start the Quiz?</h2>
//           <button className="start-button" onClick={() => setHasStarted(true)}>
//             Start Quiz
//           </button>
//         </div>
//       ) : showScore ? (
//         <div className="score-section">
//           <h2>Quiz Completed!</h2>
//           <p>You scored {score} out of {questions.length}</p>
//           <button className="restart-button" onClick={restartQuiz}>
//             Restart Quiz
//           </button>
//         </div>
//       ) : (
//         <div className="question-section">
//           <div className="timer-section">
//             <div className="timer">
//               Time Remaining: {timer}s
//             </div>
//             <div
//               className="timer-bar"
//               style={{
//                 width: `${(timer / QUESTION_TIMER) * 100}%`,
//                 backgroundColor: timer <= 5 ? 'red' : '#9B2928'
//               }}
//             ></div>
//           </div>

//           <div className="question-count">
//             <span>Question {currentQuestion + 1}</span>/{questions.length}
//           </div>

//           <div className="question-text">
//             {questions[currentQuestion].questionText}
//           </div>

//           <div className="answer-options">
//             {questions[currentQuestion].options.map((option, index) => (
//               <button
//                 key={index}
//                 className={`answer-button
//                   ${selectedAnswer === index ?
//                     (index === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect')
//                     : ''
//                   }
//                   ${showCorrectAnswer && index === questions[currentQuestion].correctAnswer ? 'correct' : ''}
//                 `}
//                 onClick={() => !isAnswered && handleAnswerClick(index)}
//                 disabled={isAnswered}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>

//           {showCorrectAnswer && selectedAnswer !== questions[currentQuestion].correctAnswer && (
//             <div className="correct-answer-message">
//               Correct Answer: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
//             </div>
//           )}

//           <div className="progress-bar">
//             <div
//               className="progress"
//               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Quiz1;


// Coming Soon
const Quiz1 = () => {
  return <div>Coming Soon...</div>;
};

export default Quiz1;
