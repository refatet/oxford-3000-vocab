export interface UserProfile {
  userId: string;
  currentLevel: number;
  totalPoints: number;
  appVersion: string;
  schema_version: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface WordStatus {
  word: string;
  oxfordId: string;
  level: number;
  leitnerBox: number; // 0: not learned, 1, 2, 3
  lastReviewed: string | null;
  nextReviewDate: string | null;
  timesCorrect: number;
  timesIncorrect: number;
  isMastered: boolean;
  schema_version: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface LeitnerConfig {
  intervals: Array<{
    from_box: number;
    to_box: number;
    days_offset: number;
  }>;
  reset_to_box: number;
  default_reset_interval_days: number;
}
