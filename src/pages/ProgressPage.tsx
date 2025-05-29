import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import BasicLayout from '../components/BasicLayout';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useError } from '../contexts/ErrorContext';
import useAsync from '../hooks/useAsync';
import { GamificationService } from '../services/gamification.service';
import { UserProgress, Achievement } from '../types/gamification';

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useError();
  
  const gamificationService = GamificationService.getInstance();
  const userId = 'default_user';
  
  // Fetch user progress
  const {
    data: userProgress,
    loading,
    error,
    execute: loadUserProgress,
  } = useAsync<UserProgress>(
    async () => {
      let progress = await gamificationService.getUserProgress(userId);
      if (!progress) {
        progress = await gamificationService.initializeUserProgress(userId);
      }
      return progress;
    },
    [userId],
    {
      onError: (error) => {
        showError('사용자 진행률을 불러오는 중 오류가 발생했습니다.', 'error', error.message);
      },
    }
  );
  
  // Fetch next level progress
  const {
    data: nextLevelProgress,
    loading: loadingNextLevel,
  } = useAsync(
    async () => {
      if (!userProgress) return null;
      return gamificationService.getProgressToNextLevel(userId);
    },
    [userProgress],
    {
      onError: (error) => {
        showError('다음 레벨 정보를 불러오는 중 오류가 발생했습니다.', 'error', error.message);
      },
    }
  );
  
  // Get current level config
  const currentLevelConfig = userProgress 
    ? gamificationService.getLevelConfig(userProgress.currentLevel)
    : null;
  
  if (loading) {
    return (
      <BasicLayout
        title="학습 진행률"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner size="lg" label="진행률을 불러오고 있어요..." />
        </div>
      </BasicLayout>
    );
  }
  
  if (error || !userProgress) {
    return (
      <BasicLayout
        title="학습 진행률"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 font-child-friendly mb-4">
            진행률을 불러올 수 없어요
          </h2>
          <p className="text-gray-600 font-child-friendly mb-6">
            사용자 진행률을 불러오는 중 문제가 발생했습니다.
          </p>
          <Button onClick={loadUserProgress}>
            다시 시도
          </Button>
        </div>
      </BasicLayout>
    );
  }
  
  return (
    <BasicLayout
      title="학습 진행률"
      showBackButton
      onBackClick={() => navigate('/')}
    >
      <div className="space-y-8">
        {/* Current Level */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
            <h2 className="text-xl font-bold text-primary-800 font-child-friendly">
              현재 레벨
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl mb-2">
                  {currentLevelConfig?.badge || '🌱'}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-child-friendly">
                  Level {userProgress.currentLevel}: {currentLevelConfig?.name || '영어 학습자'}
                </h3>
                <p className="text-gray-600 font-child-friendly">
                  {currentLevelConfig?.description || '영어 학습을 시작한 단계입니다.'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {userProgress.totalPoints}
                </div>
                <div className="text-sm text-gray-500">
                  총 포인트
                </div>
              </div>
            </div>
            
            {nextLevelProgress && nextLevelProgress.nextLevel && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 font-child-friendly">
                    다음 레벨까지
                  </span>
                  <span className="font-medium text-gray-700 font-child-friendly">
                    {nextLevelProgress.progressPercentage}%
                  </span>
                </div>
                
                <ProgressBar
                  value={nextLevelProgress.progressPercentage}
                  max={100}
                  color="primary"
                />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700 font-child-friendly">
                      필요한 포인트
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {nextLevelProgress.pointsNeeded}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700 font-child-friendly">
                      필요한 단어
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {nextLevelProgress.wordsNeeded}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-100">
            <h2 className="text-xl font-bold text-secondary-800 font-child-friendly">
              학습 통계
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
                    학습한 단어
                  </h3>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.totalWordsLearned}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
                    완료한 퀴즈
                  </h3>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.totalQuizzesCompleted}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
                    연속 학습일
                  </h3>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.streakDays}일 🔥
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
                    정확도
                  </h3>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.statistics.averageAccuracy}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3 font-child-friendly">
                상세 통계
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-700 font-child-friendly">
                    정답 수
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {userProgress.statistics.totalCorrectAnswers}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-700 font-child-friendly">
                    오답 수
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {userProgress.statistics.totalIncorrectAnswers}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-700 font-child-friendly">
                    최장 연속 학습일
                  </div>
                  <div className="text-lg font-bold text-yellow-600">
                    {userProgress.statistics.longestStreak}일
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-700 font-child-friendly">
                    가장 빠른 퀴즈 시간
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.floor(userProgress.statistics.fastestQuizTime / 60)}:{(userProgress.statistics.fastestQuizTime % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
            <h2 className="text-xl font-bold text-yellow-800 font-child-friendly">
              업적
            </h2>
          </div>
          
          <div className="p-6">
            {userProgress.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProgress.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start"
                  >
                    <div className="text-3xl mr-3">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-yellow-800 font-child-friendly">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-yellow-700 font-child-friendly">
                        {achievement.description}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-yellow-600">
                        <span className="font-medium">+{achievement.points} 포인트</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-lg font-semibold text-gray-800 font-child-friendly mb-2">
                  아직 업적이 없어요
                </h3>
                <p className="text-gray-600 font-child-friendly">
                  퀴즈를 풀고 단어를 학습하면 업적을 획득할 수 있어요!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProgressPage;
