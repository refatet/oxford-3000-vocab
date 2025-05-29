export interface QuizQuestion {
  id: string;
  wordId: string;
  questionType: 'word-to-meaning' | 'meaning-to-word' | 'image-to-word';
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  level: number;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    attempts: number;
    points: number;
    timeSpent: number;
  }>;
  startTime: string;
  endTime: string | null;
  isCompleted: boolean;
  totalScore: number;
  maxScore: number;
}

export interface QuizAnswer {
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
  attempts: number;
  feedback: string;
}

export interface QuizResult {
  sessionId: string;
  userId: string;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  totalPoints: number;
  maxPoints: number;
  timeSpent: number;
  newWordsLearned: string[];
  wordsToReview: string[];
  completedAt: string;
}

export interface QuizConfig {
  questionsPerSession: number;
  maxAttempts: number;
  pointsPerCorrectAnswer: number;
  pointsPerFirstAttempt: number;
  pointsPerSecondAttempt: number;
  timeLimit: number | null;
}
