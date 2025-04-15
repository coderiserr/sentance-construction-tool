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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-5xl">
        {!quizStarted && !quizFinished && <StartScreen />}
        {quizStarted && !quizFinished && <QuizScreen />}
        {quizFinished && <ResultScreen />}
      </div>
    </div>
  );
};

export default App;
