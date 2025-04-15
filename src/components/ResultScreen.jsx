/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  restartQuiz, 
  submitAnswersThunk,
  selectScore,
  selectUserAnswers,
  selectQuestions,
  selectPercentageScore
} from '../store/quizSlice';

const ResultScreen = () => {
  const dispatch = useDispatch();
  const userAnswers = useSelector(selectUserAnswers);
  const questions = useSelector(selectQuestions);
  const percentage = useSelector(selectPercentageScore);
  const [showDetails, setShowDetails] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  
  useEffect(() => {
    dispatch(submitAnswersThunk(userAnswers));
    // Trigger animation after component mounts
    setTimeout(() => setAnimateScore(true), 500);
  }, [dispatch, userAnswers]);
  
  const getFeedback = () => {
    if (percentage >= 90) return "Excellent! You have a strong command of sentence structure.";
    if (percentage >= 70) return "While you correctly formed several sentences, there are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness.";
    if (percentage >= 50) return "You're making good progress, but need more practice with sentence formation.";
    return "Keep practicing! Focus on understanding how words relate to each other in sentences.";
  };

  const handleRestartQuiz = () => {
    dispatch(restartQuiz());
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600">Here's how you did</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <svg className="absolute inset-0" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2.5"
                  strokeDasharray={`${animateScore ? percentage : 0}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-green-600">
                  {animateScore ? percentage.toFixed(0) : '0'}%
                </span>
              </div>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-2xl font-semibold text-gray-800">Your Score</h2>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h3>
            <p className="text-gray-700 mb-4">
              {getFeedback()}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Correct Answers:</span>
                <span className="ml-2 font-bold text-green-600">{userAnswers.filter(a => a.isCorrect).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Questions:</span>
                <span className="ml-2 font-bold text-gray-800">{questions.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={toggleDetails}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          <button 
            onClick={handleRestartQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
        
        {showDetails && (
          <div className="space-y-6 border-t pt-6 animate-fade-in">
            {userAnswers.map((answer, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-500">
                    Question {index + 1}/{questions.length}
                  </h3>
                  <p className="text-gray-800 mt-2">
                    {questions[index].text.split('___').map((part, partIndex) => (
                      <React.Fragment key={partIndex}>
                        {part}
                        {partIndex < answer.correctAnswers.length && (
                          <span className="font-semibold">{partIndex < questions[index].text.split('___').length - 1 ? '_____' : ''}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-500">
                    Your response: {answer.isCorrect ? 
                      <span className="text-green-600">Correct</span> : 
                      <span className="text-red-600">Incorrect</span>}
                  </h4>
                  
                  <p className="text-gray-800 mt-1">
                    {questions[index].text.split('___').map((part, partIndex) => (
                      <React.Fragment key={partIndex}>
                        {part}
                        {partIndex < answer.userSelection.length && (
                          <span className={`font-semibold ${
                            answer.userSelection[partIndex] === answer.correctAnswers[partIndex] 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {answer.userSelection[partIndex]}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen; 