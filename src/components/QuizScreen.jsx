/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
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
  
  // Handle timer logic
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
    dispatch(selectAnswerAction({ optionId, position }));
  };
  const handleQuit = () => {
    dispatch(restartQuiz());
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
    <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-auto shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold text-gray-700">
            Question {currentQuestionIndex + 1}
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={handleQuit}
          >
            Quit
          </button>
        </div>
        

        <div className="mb-4">
          <div className="text-xl font-bold text-center mb-2">
            {formatTimer(timer)}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-400 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timer / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600 mb-6">
          Select the missing words in the correct order
        </p>

        <div className="text-xl text-gray-800 mb-8 leading-relaxed">
          {sentenceParts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < sentenceParts.length - 1 && (
                <span 
                  className={`inline-block mx-1 px-3 py-1 border rounded min-w-20 text-center ${
                    filledBlanks[index] 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
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
                  {filledBlanks[index] || '______________'}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Word options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {question.options.map((option) => {
            const isSelected = Object.keys(selectedAnswers).includes(option.id.toString());
            
            return (
              <button
                key={option.id}
                className={`py-2 px-4 rounded border transition ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (isSelected) {
                    const position = selectedAnswers[option.id];
                    dispatch(selectAnswerAction({ optionId: option.id, position: -1 }));
                  } else {
                    const filledPositions = new Set(Object.values(selectedAnswers));
                    const availablePositions = option.positions.filter(pos => !filledPositions.has(pos));
                    
                    if (availablePositions.length > 0) {
                      handleSelectAnswer(option.id, availablePositions[0]);
                    } else if (option.positions.length > 0) {
                      handleSelectAnswer(option.id, option.positions[0]);
                    }
                  }
                }}
              >
                {option.word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded flex items-center ${
            allBlanksFilled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
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
  );
};

export default QuizScreen; 