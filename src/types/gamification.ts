export interface UserProgress {
  userId: string;
  currentLevel: number;
  totalPoints: number;
  totalWordsLearned: number;
  totalQuizzesCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  achievements: Achievement[];
  statistics: Statistics;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string;
}

export interface Statistics {
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  fastestQuizTime: number;
  longestStreak: number;
}

export interface LevelConfig {
  level: number;
  name: string;
  badge: string;
  requiredPoints: number;
  requiredWords: number;
  description: string;
}
