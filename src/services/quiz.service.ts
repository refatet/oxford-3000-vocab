import { QuizQuestion, QuizSession, QuizAnswer, QuizResult, QuizConfig } from '../types/quiz';
import { getCurrentISOString, addDaysToToday } from '../utils/date.utils';
import { IndexedDBService } from './indexedDB.service';

export class QuizService {
  private static instance: QuizService;
  private indexedDBService: IndexedDBService;
  
  private config: QuizConfig = {
    questionsPerSession: 5,
    maxAttempts: 2,
    pointsPerCorrectAnswer: 15,
    pointsPerFirstAttempt: 15,
    pointsPerSecondAttempt: 10,
    timeLimit: null,
  };

  private constructor() {
    this.indexedDBService = IndexedDBService.getInstance();
  }

  static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  /**
   * Generate a new quiz session
   */
  async generateQuiz(level: number, userId: string): Promise<QuizSession> {
    // Initialize database if not already
    await this.indexedDBService.initializeDB();
    
    const questions = await this.generateQuestions(level);
    
    const session: QuizSession = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      level,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: getCurrentISOString(),
      endTime: null,
      isCompleted: false,
      totalScore: 0,
      maxScore: questions.length * this.config.pointsPerCorrectAnswer,
    };
    
    return session;
  }

  /**
   * Generate questions for a quiz
   */
  private async generateQuestions(level: number): Promise<QuizQuestion[]> {
    // In a real app, this would fetch words from a database based on level
    // For now, we'll generate some sample questions
    
    const questionTypes: Array<'word-to-meaning' | 'meaning-to-word' | 'image-to-word'> = [
      'word-to-meaning',
      'meaning-to-word',
      'image-to-word',
    ];
    
    const sampleWords = [
      { id: 'apple_n_01', word: 'apple', meaning: '사과', imageUrl: '/images/apple.jpg' },
      { id: 'book_n_01', word: 'book', meaning: '책', imageUrl: '/images/book.jpg' },
      { id: 'cat_n_01', word: 'cat', meaning: '고양이', imageUrl: '/images/cat.jpg' },
      { id: 'dog_n_01', word: 'dog', meaning: '개', imageUrl: '/images/dog.jpg' },
      { id: 'elephant_n_01', word: 'elephant', meaning: '코끼리', imageUrl: '/images/elephant.jpg' },
      { id: 'flower_n_01', word: 'flower', meaning: '꽃', imageUrl: '/images/flower.jpg' },
      { id: 'guitar_n_01', word: 'guitar', meaning: '기타', imageUrl: '/images/guitar.jpg' },
      { id: 'house_n_01', word: 'house', meaning: '집', imageUrl: '/images/house.jpg' },
    ];
    
    // Filter words by level (in a real app)
    const levelWords = sampleWords;
    
    // Shuffle and take required number of words
    const shuffledWords = this.shuffleArray([...levelWords]);
    const selectedWords = shuffledWords.slice(0, this.config.questionsPerSession);
    
    // Generate questions
    const questions: QuizQuestion[] = selectedWords.map((word, index) => {
      // Cycle through question types
      const questionType = questionTypes[index % questionTypes.length];
      
      // Generate wrong options (excluding the correct answer)
      const otherWords = levelWords.filter(w => w.id !== word.id);
      const shuffledOtherWords = this.shuffleArray(otherWords);
      const wrongOptions = shuffledOtherWords.slice(0, 3);
      
      let question = '';
      let options: string[] = [];
      let correctAnswer = '';
      
      switch (questionType) {
        case 'word-to-meaning':
          question = `"${word.word}"의 뜻은 무엇인가요?`;
          options = [...wrongOptions.map(w => w.meaning), word.meaning];
          correctAnswer = word.meaning;
          break;
        
        case 'meaning-to-word':
          question = `"${word.meaning}"를 영어로 하면 무엇인가요?`;
          options = [...wrongOptions.map(w => w.word), word.word];
          correctAnswer = word.word;
          break;
        
        case 'image-to-word':
          question = '이 그림에 해당하는 영어 단어는 무엇인가요?';
          options = [...wrongOptions.map(w => w.word), word.word];
          correctAnswer = word.word;
          break;
      }
      
      return {
        id: `q_${index}_${Date.now()}`,
        wordId: word.id,
        questionType,
        question,
        options: this.shuffleArray(options),
        correctAnswer,
        imageUrl: questionType === 'image-to-word' ? word.imageUrl : undefined,
      };
    });
    
    return questions;
  }

  /**
   * Submit an answer for a question
   */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string,
    timeSpent: number
  ): Promise<QuizAnswer> {
    // In a real app, this would fetch the session from a database
    // For now, we'll assume the session is passed in memory
    
    // Get the question from the session
    const session = { id: sessionId } as QuizSession; // Placeholder
    const question = { id: questionId, correctAnswer: '' } as QuizQuestion; // Placeholder
    
    // Check if the question has already been answered
    const existingAnswer = session.answers[questionId];
    const attempts = existingAnswer ? existingAnswer.attempts + 1 : 1;
    
    // Check if maximum attempts exceeded
    if (attempts > this.config.maxAttempts) {
      throw new Error('Maximum attempts exceeded');
    }
    
    // Check if the answer is correct
    const isCorrect = answer === question.correctAnswer;
    
    // Calculate points
    let points = 0;
    if (isCorrect) {
      points = attempts === 1 ? 
        this.config.pointsPerFirstAttempt : 
        this.config.pointsPerSecondAttempt;
    }
    
    // Generate feedback
    let feedback = '';
    if (isCorrect) {
      feedback = attempts === 1 ? 
        '정답입니다! 완벽해요!' : 
        '정답입니다! 잘했어요!';
    } else {
      feedback = attempts < this.config.maxAttempts ? 
        '틀렸어요. 다시 시도해보세요.' : 
        `틀렸어요. 정답은 "${question.correctAnswer}"입니다.`;
    }
    
    // Update session
    session.answers[questionId] = {
      questionId,
      answer,
      isCorrect,
      attempts,
      points,
      timeSpent,
    };
    
    if (isCorrect) {
      session.totalScore += points;
    }
    
    // Return result
    return {
      isCorrect,
      points,
      correctAnswer: question.correctAnswer,
      attempts,
      feedback,
    };
  }

  /**
   * Complete a quiz session
   */
  async completeQuiz(sessionId: string): Promise<QuizResult> {
    // In a real app, this would fetch the session from a database
    // For now, we'll assume the session is passed in memory
    
    // Get the session
    const session = { 
      id: sessionId,
      userId: 'test-user',
      level: 1,
      questions: [],
      answers: {},
      totalScore: 0,
      maxScore: 0
    } as QuizSession; // Placeholder
    
    // Calculate results
    const totalQuestions = session.questions.length;
    const correctAnswers = Object.values(session.answers).filter(a => a.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Calculate time spent
    const startTime = new Date(session.startTime).getTime();
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Update Leitner boxes for words
    const newWordsLearned: string[] = [];
    const wordsToReview: string[] = [];
    
    for (const question of session.questions) {
      const answer = session.answers[question.id];
      
      if (answer && answer.isCorrect) {
        // In a real app, update the word's Leitner box
        // For now, just add to newWordsLearned
        newWordsLearned.push(question.wordId);
      } else {
        wordsToReview.push(question.wordId);
      }
    }
    
    // Mark session as completed
    session.isCompleted = true;
    session.endTime = getCurrentISOString();
    
    // Return result
    return {
      sessionId,
      userId: session.userId,
      level: session.level,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      totalPoints: session.totalScore,
      maxPoints: session.maxScore,
      timeSpent,
      newWordsLearned,
      wordsToReview,
      completedAt: getCurrentISOString(),
    };
  }

  /**
   * Get quiz configuration
   */
  getConfig(): QuizConfig {
    return { ...this.config };
  }

  /**
   * Update quiz configuration
   */
  updateConfig(newConfig: Partial<QuizConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  /**
   * Utility function to shuffle an array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
