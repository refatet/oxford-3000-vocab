import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import BasicLayout from '../components/BasicLayout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useError } from '../contexts/ErrorContext';
import useAsync from '../hooks/useAsync';
import { GamificationService } from '../services/gamification.service';
import { UserProgress } from '../types/gamification';

const HomePage: React.FC = () => {
  const { showError } = useError();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const gamificationService = GamificationService.getInstance();
  const userId = 'default_user';

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

  const currentLevel = userProgress?.currentLevel || 1;
  const totalPoints = userProgress?.totalPoints || 0;
  const totalWordsLearned = userProgress?.totalWordsLearned || 0;
  const streakDays = userProgress?.streakDays || 0;

  // Calculate overall progress (rough estimate)
  const progressPercentage = Math.min(100, (totalWordsLearned / (currentLevel * 50)) * 100);

  const handleQuizStart = () => {
    try {
      navigate(`/quiz/${currentLevel}`);
    } catch (error) {
      showError('퀴즈 페이지로 이동하는 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      showError('페이지 이동 중 오류가 발생했습니다.', 'error');
    }
  };

  if (loading) {
    return (
      <BasicLayout
        title="톡톡! 영어 학습"
        showProgress={false}
      >
        <div className="text-center space-y-8">
          <SkeletonCard variant="progress" />
          <LoadingSpinner size="lg" label="사용자 정보를 불러오고 있어요..." />
        </div>
      </BasicLayout>
    );
  }

  if (error) {
    return (
      <BasicLayout
        title="톡톡! 영어 학습"
        showProgress={false}
      >
        <div className="text-center space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-bold text-gray-800 font-child-friendly mb-4">
              데이터를 불러올 수 없어요
            </h2>
            <p className="text-gray-600 font-child-friendly mb-6">
              사용자 정보를 불러오는 중 문제가 발생했습니다.
            </p>
            <Button onClick={loadUserProgress}>
              다시 시도
            </Button>
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout
      title="톡톡! 영어 학습"
      showProgress={true}
      progressValue={progressPercentage}
      progressLabel="전체 학습 진행률"
    >
      <div className="text-center space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 font-child-friendly animate-bounce-gentle">
            환영합니다! 🌟
          </h2>
          <p className="text-lg text-gray-600 font-child-friendly">
            재미있게 영어 단어를 배워보세요!
          </p>
          
          {/* User Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mx-auto max-w-md">
            <div className="grid grid-cols-2 gap-4 text-sm font-child-friendly">
              <div className="flex flex-col items-center p-3 bg-primary-50 rounded-lg">
                <span className="text-2xl font-bold text-primary-600">Level {currentLevel}</span>
                <span className="text-primary-600">현재 레벨</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-secondary-50 rounded-lg">
                <span className="text-2xl font-bold text-secondary-600">{totalPoints}</span>
                <span className="text-secondary-600">총 포인트</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-warning-50 rounded-lg">
                <span className="text-2xl font-bold text-warning-600">{totalWordsLearned}</span>
                <span className="text-warning-600">학습한 단어</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                <span className="text-2xl font-bold text-red-600">{streakDays}</span>
                <span className="text-red-600">연속 학습일</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Action Buttons */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Button
            variant="secondary"
            onClick={() => handleNavigation('/rwl')}
            className="flex flex-col items-center justify-center aspect-square p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="읽으면서 듣기 학습 시작"
          >
            <div className="text-6xl mb-4">🎧</div>
            <div className="text-base font-semibold text-center leading-tight">읽으면서<br />듣기</div>
          </Button>
          
          <Button
            variant="primary"
            onClick={() => handleNavigation('/wordcard')}
            className="flex flex-col items-center justify-center aspect-square p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="단어 카드 학습 시작"
          >
            <div className="text-6xl mb-4">📚</div>
            <div className="text-base font-semibold text-center leading-tight">단어 카드<br />보기</div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center justify-center aspect-square p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2"
            aria-label="앱 정보 보기"
          >
            <div className="text-6xl mb-4">ℹ️</div>
            <div className="text-base font-semibold text-center leading-tight">앱<br />정보</div>
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleQuizStart}
            className="flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={`Level ${currentLevel} 퀴즈 시작`}
          >
            <span className="text-xl" aria-hidden="true">🎯</span>
            퀴즈 시작하기
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleNavigation('/progress')}
            className="flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="내 학습 진행률 확인"
          >
            <span className="text-xl" aria-hidden="true">📊</span>
            내 진행률 보기
          </Button>
        </div>

        {/* Quick Access Tips */}
        {totalWordsLearned === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-lg font-semibold text-blue-800 font-child-friendly mb-2">
              처음 시작하시나요?
            </h3>
            <p className="text-sm text-blue-700 font-child-friendly mb-4">
              단어 카드로 기본 단어를 익힌 후 퀴즈에 도전해보세요!
            </p>
            <Button
              size="sm"
              onClick={() => handleNavigation('/wordcard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              단어 카드 시작하기
            </Button>
          </div>
        )}

        {/* Achievement Notification */}
        {userProgress?.achievements && userProgress.achievements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 max-w-md mx-auto">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-yellow-800 font-child-friendly">
              {userProgress.achievements.length}개의 업적을 달성했어요! 진행률에서 확인해보세요.
            </p>
          </div>
        )}
      </div>
      
      {/* App Info Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="앱 정보"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-child-friendly">
            이 앱은 옥스포드 3000 핵심 단어를 기반으로 만들어진 영어 학습 앱입니다.
          </p>
          <p className="text-gray-700 font-child-friendly">
            단어 카드, '읽으면서 듣기', 퀴즈 기능을 통해 효과적으로 영어를 배울 수 있어요!
          </p>
          
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-800 font-child-friendly mb-2">
              🌟 주요 기능
            </h4>
            <ul className="text-sm text-primary-700 font-child-friendly space-y-1">
              <li>• 인터랙티브 퀴즈 시스템</li>
              <li>• 스마트 복습 알고리즘 (Leitner 시스템)</li>
              <li>• 레벨업 및 업적 시스템</li>
              <li>• 개인 맞춤 학습 진행률</li>
              <li>• 읽으면서 듣기 기능</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 font-child-friendly mb-2">
              📱 사용법
            </h4>
            <ul className="text-sm text-green-700 font-child-friendly space-y-1">
              <li>1. 단어 카드로 새로운 단어 학습하기</li>
              <li>2. 퀴즈로 학습한 단어 테스트하기</li>
              <li>3. 읽으면서 듣기로 문장 속에서 단어 익히기</li>
              <li>4. 진행률 페이지에서 학습 상황 확인하기</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Button onClick={() => setShowModal(false)} className="w-full">
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </BasicLayout>
  );
};

export default HomePage;
