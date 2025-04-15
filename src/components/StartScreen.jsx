import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  startQuiz,
  selectQuestions,
  selectQuizStatus,
  selectQuizError
} from '../store/quizSlice';
import LoadingIndicator from './LoadingIndicator';

const StartScreen = () => {
  const dispatch = useDispatch();
  const questions = useSelector(selectQuestions);
  const status = useSelector(selectQuizStatus);
  const error = useSelector(selectQuizError);
  const [isHovered, setIsHovered] = useState(false);

  const handleStartQuiz = () => {
    dispatch(startQuiz());
  };

  if (status === 'loading') {
    return (
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto shadow-lg border border-purple-300 flex justify-center items-center">
        <LoadingIndicator message="Loading questions..." />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto shadow-lg border border-red-300">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Sentence Construction</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Test your grammar skills by completing sentences with the correct words in the right order.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all duration-300 hover:scale-[1.01]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-semibold text-lg text-gray-700">Time Per Question</h3>
            <p className="text-gray-500 text-xl">30 sec</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-lg text-gray-700">Total Questions</h3>
            <p className="text-gray-500 text-xl">{questions.length}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-2">🪙</div>
            <h3 className="font-semibold text-lg text-gray-700">Coins</h3>
            <p className="text-gray-500 text-xl">0</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={handleStartQuiz}
            className={`px-8 py-4 text-xl font-medium rounded-lg transition-all duration-300 ${
              isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                : 'bg-blue-600 text-white'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Quiz
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>Click "Start Quiz" to begin the sentence construction challenge!</p>
      </div>
    </div>
  );
};

export default StartScreen; 