import { questions } from '../data/questions';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const fetchQuestions = async () => {
  try {
    await delay(500);
    return { 
      success: true, 
      data: questions
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { 
      success: false, 
      error: 'Failed to fetch questions. Please try again later.' 
    };
  }
};
export const submitAnswers = async (userAnswers) => {
  try {
    await delay(500);
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    
    return { 
      success: true, 
      data: { 
        score: correctCount,
        totalQuestions,
        percentage,
        userAnswers
      }
    };
  } catch (error) {
    console.error('Error submitting answers:', error);
    return { 
      success: false, 
      error: 'Failed to submit answers. Please try again later.' 
    };
  }
}; 