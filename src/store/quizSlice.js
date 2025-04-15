/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuestions, submitAnswers } from '../services/questionService';

export const fetchQuestionsThunk = createAsyncThunk(
  'quiz/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchQuestions();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue('Failed to load questions. Please try again later.');
    }
  }
);

export const submitAnswersThunk = createAsyncThunk(
  'quiz/submitAnswers',
  async (userAnswers, { rejectWithValue }) => {
    try {
      const response = await submitAnswers(userAnswers);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue('Failed to submit answers. Please try again later.');
    }
  }
);

const initialState = {
  questions: [],
  currentQuestion: 0,
  selectedAnswers: {},
  timer: 30,
  isTimerActive: false,
  quizStarted: false,
  quizFinished: false,
  score: 0,
  userAnswers: [],
  availableCoins: 0,
  status: 'idle',
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state) => {
      state.quizStarted = true;
      state.isTimerActive = true;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.userAnswers = [];
      state.score = 0;
      state.timer = 30;
      state.quizFinished = false;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
    setTimerActive: (state, action) => {
      state.isTimerActive = action.payload;
    },
    selectAnswer: (state, action) => {
      const { optionId, position } = action.payload;
      const currentQuestion = state.questions[state.currentQuestion];
      
      // If position is -1, remove the selection for this option
      if (position === -1) {
        delete state.selectedAnswers[optionId];
        return;
      }

      // If a specific position is provided, use it
      if (position !== undefined && position >= 0) {
        // Remove any existing selection for this option
        if (state.selectedAnswers[optionId] !== undefined) {
          delete state.selectedAnswers[optionId];
        }
        
        // Add the new selection
        state.selectedAnswers[optionId] = position;
        return;
      }

      // Find the first empty position in the sentence
      let targetPosition = -1;
      const blankCount = currentQuestion.text.split('___').length - 1;
      
      for (let i = 0; i < blankCount; i++) {
        if (!Object.values(state.selectedAnswers).includes(i)) {
          targetPosition = i;
          break;
        }
      }

      // If no empty position found, don't allow selection
      if (targetPosition === -1) {
        return;
      }

      // Remove any existing selection for this option
      if (state.selectedAnswers[optionId] !== undefined) {
        delete state.selectedAnswers[optionId];
      }

      // Add the new selection
      state.selectedAnswers[optionId] = targetPosition;
    },
    moveToNextQuestion: (state) => {
      const currentQuestionData = state.questions[state.currentQuestion];
      
      if (currentQuestionData) {
        const userSelectedOptions = Object.entries(state.selectedAnswers).map(([optionId, position]) => {
          const option = currentQuestionData.options.find(opt => opt.id === parseInt(optionId));
          return { position, word: option ? option.word : null };
        });
  
        userSelectedOptions.sort((a, b) => a.position - b.position);
        
        const selectedWords = userSelectedOptions.map(option => option.word);
        
        const isCorrect = selectedWords.every((word, index) => word === currentQuestionData.correctAnswers[index]);
        
     
        state.userAnswers.push({
          questionId: currentQuestionData.id,
          userSelection: selectedWords,
          correctAnswers: currentQuestionData.correctAnswers,
          isCorrect
        });
  
    
        if (isCorrect) {
          state.score += 1;
          state.availableCoins += 1;
        }
      }
  
    
      state.timer = 30;
      state.selectedAnswers = {};
  
     
      if (state.currentQuestion >= state.questions.length - 1) {
        state.quizFinished = true;
        state.isTimerActive = false;
      } else {
        state.currentQuestion += 1;
      }
    },
    restartQuiz: (state) => {
      state.quizStarted = false;
      state.quizFinished = false;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.userAnswers = [];
      state.score = 0;
      state.timer = 30;
      state.isTimerActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
 
      .addCase(submitAnswersThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitAnswersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(submitAnswersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});


export const { 
  startQuiz, 
  decrementTimer, 
  setTimerActive, 
  selectAnswer, 
  moveToNextQuestion,
  restartQuiz
} = quizSlice.actions;


export const selectQuestions = state => state.quiz.questions;
export const selectCurrentQuestion = state => state.quiz.currentQuestion;
export const selectCurrentQuestionData = state => state.quiz.questions[state.quiz.currentQuestion];
export const selectSelectedAnswers = state => state.quiz.selectedAnswers;
export const selectTimer = state => state.quiz.timer;
export const selectQuizStarted = state => state.quiz.quizStarted;
export const selectQuizFinished = state => state.quiz.quizFinished;
export const selectIsTimerActive = state => state.quiz.isTimerActive;
export const selectScore = state => state.quiz.score;
export const selectUserAnswers = state => state.quiz.userAnswers;
export const selectAvailableCoins = state => state.quiz.availableCoins;
export const selectQuizStatus = state => state.quiz.status;
export const selectQuizError = state => state.quiz.error;


export const selectAllBlanksFilled = state => {
  const currentQuestionData = state.quiz.questions[state.quiz.currentQuestion];
  if (!currentQuestionData) return false;
  
  
  const blankCount = currentQuestionData.text.split('___').length - 1;
  
 
  const filledPositions = new Set(Object.values(state.quiz.selectedAnswers));
  
  return filledPositions.size === blankCount;
};


export const selectPercentageScore = state => {
  const { score, questions } = state.quiz;
  return questions.length > 0 ? (score / questions.length) * 100 : 0;
};

export default quizSlice.reducer; 