/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
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
  useEffect(() => {
    dispatch(submitAnswersThunk(userAnswers));
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

  return (
    <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-auto shadow-lg border border-red-300">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <svg className="absolute inset-0" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2.5"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">{percentage.toFixed(0)}</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Overall Score</h2>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-6">
          {getFeedback()}
        </p>
        
        <button 
          onClick={handleRestartQuiz}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mb-4"
        >
          Go to Dashboard
        </button>
      </div>

      <div className="space-y-6">
        {userAnswers.map((answer, index) => (
          <div key={index} className="border-t pt-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-500">
                Prompt: {index + 1}/{questions.length}
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
    </div>
  );
};

export default ResultScreen; 