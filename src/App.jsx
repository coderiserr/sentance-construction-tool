import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchQuestionsThunk,
  selectQuizStarted,
  selectQuizFinished
} from './store/quizSlice';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const App = () => {
  const dispatch = useDispatch();
  const quizStarted = useSelector(selectQuizStarted);
  const quizFinished = useSelector(selectQuizFinished);

  useEffect(() => {
    // Fetch questions when the app loads
    dispatch(fetchQuestionsThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      {!quizStarted && !quizFinished && <StartScreen />}
      {quizStarted && !quizFinished && <QuizScreen />}
      {quizFinished && <ResultScreen />}
    </div>
  );
};

export default App;
