import { UserProgress, Achievement, Statistics, LevelConfig } from '../types/gamification';
import { getCurrentISOString, getCurrentDateString } from '../utils/date.utils';

export class GamificationService {
  private static instance: GamificationService;
  private readonly storageKey = 'oxford_vocab_gamification';
  
  private readonly levelConfigs: LevelConfig[] = [
    {
      level: 1,
      name: '영어 새싹',
      badge: '🌱',
      requiredPoints: 0,
      requiredWords: 0,
      description: '영어 학습을 시작한 새싹 단계입니다.',
    },
    {
      level: 2,
      name: '영어 꽃봉오리',
      badge: '🌸',
      requiredPoints: 500,
      requiredWords: 50,
      description: '기초 단어를 익히고 있는 꽃봉오리 단계입니다.',
    },
    {
      level: 3,
      name: '영어 나무',
      badge: '🌳',
      requiredPoints: 1500,
      requiredWords: 150,
      description: '중급 단어를 익히고 있는 나무 단계입니다.',
    },
    {
      level: 4,
      name: '영어 숲',
      badge: '🏞️',
      requiredPoints: 3000,
      requiredWords: 300,
      description: '고급 단어를 익히고 있는 숲 단계입니다.',
    },
  ];

  private constructor() {}

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  /**
   * Initialize user progress with default values
   */
  async initializeUserProgress(userId: string): Promise<UserProgress> {
    const now = getCurrentISOString();
    const today = getCurrentDateString();
    
    const initialProgress: UserProgress = {
      userId,
      currentLevel: 1,
      totalPoints: 0,
      totalWordsLearned: 0,
      totalQuizzesCompleted: 0,
      streakDays: 0,
      lastActiveDate: today,
      achievements: [],
      statistics: {
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        averageTimePerQuestion: 0,
        fastestQuizTime: 0,
        longestStreak: 0,
      },
      createdAt: now,
      lastUpdatedAt: now,
    };
    
    await this.saveUserProgress(initialProgress);
    return initialProgress;
  }

  /**
   * Get user progress from storage
   */
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const data = localStorage.getItem(`${this.storageKey}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return null;
    }
  }

  /**
   * Save user progress to storage
   */
  private async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      progress.lastUpdatedAt = getCurrentISOString();
      localStorage.setItem(`${this.storageKey}_${progress.userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
      throw new Error('Failed to save user progress');
    }
  }

  /**
   * Add points to user progress
   */
  async addPoints(
    userId: string,
    points: number,
    source: string,
    metadata?: Record<string, any>
  ): Promise<{
    newPoints: number;
    totalPoints: number;
    leveledUp: boolean;
    newLevel?: number;
    unlockedAchievements: Achievement[];
  }> {
    let progress = await this.getUserProgress(userId);
    
    if (!progress) {
      progress = await this.initializeUserProgress(userId);
    }
    
    const oldLevel = progress.currentLevel;
    progress.totalPoints += points;
    
    // Check for achievements
    const unlockedAchievements = await this.checkAchievements(progress, source, metadata);
    
    // Check for level up
    await this.checkLevelUp(progress);
    
    await this.saveUserProgress(progress);
    
    return {
      newPoints: points,
      totalPoints: progress.totalPoints,
      leveledUp: progress.currentLevel > oldLevel,
      newLevel: progress.currentLevel > oldLevel ? progress.currentLevel : undefined,
      unlockedAchievements,
    };
  }

  /**
   * Update user statistics
   */
  async updateStatistics(
    userId: string,
    stats: {
      correctAnswers: number;
      totalQuestions: number;
      completionTime: number;
      wordsLearned: number;
    }
  ): Promise<void> {
    let progress = await this.getUserProgress(userId);
    
    if (!progress) {
      progress = await this.initializeUserProgress(userId);
    }
    
    // Update statistics
    progress.statistics.totalCorrectAnswers += stats.correctAnswers;
    progress.statistics.totalIncorrectAnswers += (stats.totalQuestions - stats.correctAnswers);
    progress.statistics.totalTimeSpent += stats.completionTime;
    
    // Update averages
    const totalQuestions = progress.statistics.totalCorrectAnswers + progress.statistics.totalIncorrectAnswers;
    progress.statistics.averageAccuracy = Math.round((progress.statistics.totalCorrectAnswers / totalQuestions) * 100);
    progress.statistics.averageTimePerQuestion = Math.round(progress.statistics.totalTimeSpent / totalQuestions);
    
    // Update fastest quiz time
    if (progress.statistics.fastestQuizTime === 0 || stats.completionTime < progress.statistics.fastestQuizTime) {
      progress.statistics.fastestQuizTime = stats.completionTime;
    }
    
    // Update words learned
    progress.totalWordsLearned += stats.wordsLearned;
    
    // Update quiz count
    progress.totalQuizzesCompleted += 1;
    
    // Update streak
    const today = getCurrentDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (progress.lastActiveDate === yesterdayStr) {
      // Consecutive day
      progress.streakDays += 1;
      
      // Update longest streak
      if (progress.streakDays > progress.statistics.longestStreak) {
        progress.statistics.longestStreak = progress.streakDays;
      }
    } else if (progress.lastActiveDate !== today) {
      // Not consecutive and not today, reset streak
      progress.streakDays = 1;
    }
    
    progress.lastActiveDate = today;
    
    // Check for level up
    await this.checkLevelUp(progress);
    
    await this.saveUserProgress(progress);
  }

  /**
   * Check for level up
   */
  private async checkLevelUp(progress: UserProgress): Promise<boolean> {
    const currentLevel = progress.currentLevel;
    const maxLevel = this.levelConfigs.length;
    
    if (currentLevel >= maxLevel) {
      return false; // Already at max level
    }
    
    const nextLevelConfig = this.levelConfigs[currentLevel]; // 0-indexed array, so current level is next level index
    
    if (
      progress.totalPoints >= nextLevelConfig.requiredPoints &&
      progress.totalWordsLearned >= nextLevelConfig.requiredWords
    ) {
      progress.currentLevel += 1;
      
      // Add achievement for level up
      const levelUpAchievement: Achievement = {
        id: `level_up_${progress.currentLevel}`,
        name: `레벨 ${progress.currentLevel} 달성!`,
        description: `${nextLevelConfig.name} 단계에 도달했습니다.`,
        icon: nextLevelConfig.badge,
        points: 100,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(levelUpAchievement);
      
      return true;
    }
    
    return false;
  }

  /**
   * Check for achievements
   */
  private async checkAchievements(
    progress: UserProgress,
    source: string,
    metadata?: Record<string, any>
  ): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];
    
    // First quiz completion
    if (
      source === 'quiz_completed' &&
      progress.totalQuizzesCompleted === 0 &&
      !this.hasAchievement(progress, 'first_quiz')
    ) {
      const achievement: Achievement = {
        id: 'first_quiz',
        name: '첫 걸음',
        description: '첫 번째 퀴즈를 완료했습니다.',
        icon: '🎯',
        points: 50,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(achievement);
      unlockedAchievements.push(achievement);
    }
    
    // Perfect score
    if (
      source === 'quiz_completed' &&
      metadata?.accuracy === 100 &&
      !this.hasAchievement(progress, 'perfect_score')
    ) {
      const achievement: Achievement = {
        id: 'perfect_score',
        name: '완벽한 점수',
        description: '퀴즈에서 100% 정확도를 달성했습니다.',
        icon: '🏆',
        points: 100,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(achievement);
      unlockedAchievements.push(achievement);
    }
    
    // 7-day streak
    if (
      progress.streakDays >= 7 &&
      !this.hasAchievement(progress, 'week_streak')
    ) {
      const achievement: Achievement = {
        id: 'week_streak',
        name: '일주일 연속',
        description: '7일 연속으로 학습했습니다.',
        icon: '🔥',
        points: 150,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(achievement);
      unlockedAchievements.push(achievement);
    }
    
    // 50 words mastered
    if (
      progress.totalWordsLearned >= 50 &&
      !this.hasAchievement(progress, 'words_50')
    ) {
      const achievement: Achievement = {
        id: 'words_50',
        name: '단어 마스터 50',
        description: '50개의 단어를 학습했습니다.',
        icon: '📚',
        points: 200,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(achievement);
      unlockedAchievements.push(achievement);
    }
    
    // Fast learner (complete quiz in under 60 seconds)
    if (
      source === 'quiz_completed' &&
      metadata?.completionTime &&
      metadata.completionTime < 60 &&
      !this.hasAchievement(progress, 'fast_learner')
    ) {
      const achievement: Achievement = {
        id: 'fast_learner',
        name: '빠른 학습자',
        description: '60초 안에 퀴즈를 완료했습니다.',
        icon: '⚡',
        points: 100,
        unlockedAt: getCurrentISOString(),
      };
      
      progress.achievements.push(achievement);
      unlockedAchievements.push(achievement);
    }
    
    return unlockedAchievements;
  }

  /**
   * Check if user has achievement
   */
  private hasAchievement(progress: UserProgress, achievementId: string): boolean {
    return progress.achievements.some(a => a.id === achievementId);
  }

  /**
   * Get level configuration
   */
  getLevelConfig(level: number): LevelConfig | null {
    return this.levelConfigs[level - 1] || null;
  }

  /**
   * Get all level configurations
   */
  getAllLevelConfigs(): LevelConfig[] {
    return [...this.levelConfigs];
  }

  /**
   * Get progress to next level
   */
  async getProgressToNextLevel(userId: string): Promise<{
    currentLevel: number;
    nextLevel: number | null;
    pointsNeeded: number;
    wordsNeeded: number;
    progressPercentage: number;
  }> {
    const progress = await this.getUserProgress(userId);
    
    if (!progress) {
      throw new Error('User progress not found');
    }
    
    const currentLevel = progress.currentLevel;
    const maxLevel = this.levelConfigs.length;
    
    if (currentLevel >= maxLevel) {
      return {
        currentLevel,
        nextLevel: null,
        pointsNeeded: 0,
        wordsNeeded: 0,
        progressPercentage: 100,
      };
    }
    
    const nextLevelConfig = this.levelConfigs[currentLevel]; // 0-indexed array
    
    const pointsNeeded = Math.max(0, nextLevelConfig.requiredPoints - progress.totalPoints);
    const wordsNeeded = Math.max(0, nextLevelConfig.requiredWords - progress.totalWordsLearned);
    
    // Calculate progress percentage (average of points and words progress)
    const pointsProgress = Math.min(100, (progress.totalPoints / nextLevelConfig.requiredPoints) * 100);
    const wordsProgress = Math.min(100, (progress.totalWordsLearned / nextLevelConfig.requiredWords) * 100);
    const progressPercentage = Math.round((pointsProgress + wordsProgress) / 2);
    
    return {
      currentLevel,
      nextLevel: currentLevel + 1,
      pointsNeeded,
      wordsNeeded,
      progressPercentage,
    };
  }
}
