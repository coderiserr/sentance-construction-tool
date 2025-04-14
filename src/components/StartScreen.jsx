import React from 'react';
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
    <div className="shadow-2xl p-5 w-1/2 flex flex-col items-center justify-center">
      <div className="flex justify-center mb-4">
        <div className="text-5xl font-bold text-center">
          <h1 className="text-gray-800">Sentence Construction</h1>
        </div>
      </div>
      
      <p className="text-gray-600 text-xl text-center mb-8">
        Select the correct words to complete the sentence by arranging
        the provided options in the right order.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-gray-700">
          <span className="font-semibold text-lg ">Time Per Question</span>
          <p className="text-gray-500 text-lg">30 sec</p>
        </div>
        
        <div className="text-gray-700">
          <span className="font-semibold text-lg">Total Questions</span>
          <p className="text-gray-500 text-lg">{questions.length}</p>
        </div>
        
        <div className="text-gray-700 col-span-2">
          <span className="font-semibold text-lg">Coins</span>
          <p className="text-gray-500 flex items-center text-lg">
            <span className="text-yellow-500 mr-1">🪙</span> 0
          </p>
        </div>
      </div>
      
      <div className="flex gap-32 mt-4">
        <button 
          className="px-5 -ml-5 text-lg py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 "
        >
          Back
        </button>
        
        <button 
          onClick={handleStartQuiz}
          className="px-5 text-lg py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 "
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 