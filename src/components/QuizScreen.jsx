/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  decrementTimer,
  selectAnswer as selectAnswerAction,
  moveToNextQuestion,
  selectCurrentQuestionData,
  selectCurrentQuestion,
  selectTimer,
  selectSelectedAnswers,
  selectAllBlanksFilled,
  selectIsTimerActive,
  restartQuiz
} from '../store/quizSlice';

const QuizScreen = () => {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestionData);
  const currentQuestionIndex = useSelector(selectCurrentQuestion);
  const timer = useSelector(selectTimer);
  const selectedAnswers = useSelector(selectSelectedAnswers);
  const allBlanksFilled = useSelector(selectAllBlanksFilled);
  const isTimerActive = useSelector(selectIsTimerActive);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  

  useEffect(() => {
    let interval;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      dispatch(moveToNextQuestion());
    }

    return () => clearInterval(interval);
  }, [timer, isTimerActive, dispatch]);
  
  if (!question) return null;
  const sentenceParts = question.text.split('___');
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSelectAnswer = (optionId, position) => {
    setSelectedOption(optionId);
    dispatch(selectAnswerAction({ optionId, position }));
  };
  
  const handleQuit = () => {
    setShowConfirmation(true);
  };

  const confirmQuit = () => {
    setShowConfirmation(false);
    dispatch(restartQuiz());
  };

  const cancelQuit = () => {
    setShowConfirmation(false);
  };

  const handleNextQuestion = () => {
    dispatch(moveToNextQuestion());
  };
  
  const filledBlanks = {};
  Object.entries(selectedAnswers).forEach(([optionId, position]) => {
    const option = question.options.find(opt => opt.id === parseInt(optionId));
    if (option) {
      filledBlanks[position] = option.word;
    }
  });

  const getSelectedOptionForPosition = (position) => {
    const entry = Object.entries(selectedAnswers).find(([_, pos]) => pos === position);
    return entry ? entry[0] : null;
  };

  return (
    <div className="w-full h-full flex flex-col">
    
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-700">
            Question {currentQuestionIndex + 1}
          </div>
          
          <div className="flex items-center">
            <div className="mr-6">
              <div className="text-xl font-bold text-center mb-1">
                {formatTimer(timer)}
              </div>
              <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${
                    timer > 10 ? 'bg-green-500' : timer > 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(timer / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              className="text-gray-500 hover:text-red-600 transition-colors"
              onClick={handleQuit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Complete the sentence by selecting the correct words
          </h2>

        
          <div className="text-xl text-gray-800 mb-12 leading-relaxed p-6 bg-gray-50 rounded-lg">
            {sentenceParts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < sentenceParts.length - 1 && (
                  <span 
                    className={`inline-block mx-1 px-4 py-2 border-2 rounded-lg min-w-24 text-center transition-all duration-300 ${
                      filledBlanks[index] 
                        ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                    onClick={() => {
                      const selectedOptionId = getSelectedOptionForPosition(index);
                      if (selectedOptionId) {
                        dispatch(selectAnswerAction({ 
                          optionId: parseInt(selectedOptionId), 
                          position: -1 
                        }));
                      }
                    }}
                  >
                    {filledBlanks[index] || '________'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

       
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {question.options.map((option) => {
              const isSelected = Object.keys(selectedAnswers).includes(option.id.toString());
              
              return (
                <button
                  key={option.id}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    isSelected 
                      ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (isSelected) {
                     
                      dispatch(selectAnswerAction({ optionId: option.id, position: -1 }));
                    } else {
                    
                      const filledPositions = new Set(Object.values(selectedAnswers));
                      let targetPosition = -1;
                      
                     
                      for (let i = 0; i < sentenceParts.length - 1; i++) {
                        if (!filledPositions.has(i)) {
                          targetPosition = i;
                          break;
                        }
                      }
                      
                      if (targetPosition !== -1) {
                        dispatch(selectAnswerAction({ optionId: option.id, position: targetPosition }));
                      }
                    }
                  }}
                >
                  {option.word}
                </button>
              );
            })}
          </div>

       
          <div className="flex justify-end">
            <button
              className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                allBlanksFilled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleNextQuestion}
              disabled={!allBlanksFilled}
            >
              <span>Next</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

   
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quit Quiz?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to quit? Your progress will be lost.</p>
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                onClick={cancelQuit}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={confirmQuit}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScreen; 