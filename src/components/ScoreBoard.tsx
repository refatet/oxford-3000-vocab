import React from 'react';
import { clsx } from 'clsx';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

export interface ScoreBoardProps {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  points: number;
  maxPoints: number;
  newWordsLearned: string[];
  wordsToReview: string[];
  onContinue?: () => void;
  className?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  totalQuestions,
  correctAnswers,
  timeSpent,
  points,
  maxPoints,
  newWordsLearned,
  wordsToReview,
  onContinue,
  className,
}) => {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  
  // Generate feedback based on accuracy
  const getFeedback = () => {
    if (accuracy === 100) {
      return {
        emoji: '🎉',
        message: '완벽해요! 모든 문제를 맞혔어요!',
        color: 'text-green-600',
      };
    } else if (accuracy >= 80) {
      return {
        emoji: '🌟',
        message: '훌륭해요! 대부분의 문제를 맞혔어요!',
        color: 'text-green-600',
      };
    } else if (accuracy >= 60) {
      return {
        emoji: '👍',
        message: '잘했어요! 더 연습하면 더 좋아질 거예요!',
        color: 'text-yellow-600',
      };
    } else {
      return {
        emoji: '💪',
        message: '괜찮아요! 다음에 더 잘할 수 있을 거예요!',
        color: 'text-yellow-600',
      };
    }
  };
  
  const feedback = getFeedback();
  
  return (
    <div className={clsx('bg-white rounded-xl shadow-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <h2 className="text-2xl font-bold text-primary-800 font-child-friendly">
          퀴즈 결과
        </h2>
      </div>
      
      {/* Feedback */}
      <div className="px-6 py-4 border-b border-gray-200 text-center">
        <div className="text-4xl mb-2">{feedback.emoji}</div>
        <p className={clsx('text-lg font-semibold font-child-friendly', feedback.color)}>
          {feedback.message}
        </p>
      </div>
      
      {/* Stats */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
              정확도
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gray-800">
                {accuracy}%
              </span>
              <span className="text-sm text-gray-600 mb-1">
                ({correctAnswers}/{totalQuestions})
              </span>
            </div>
            <ProgressBar
              value={accuracy}
              max={100}
              color={accuracy >= 80 ? 'primary' : accuracy >= 60 ? 'secondary' : 'warning'}
              size="sm"
              className="mt-2"
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
              소요 시간
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gray-800">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-gray-600 mb-1">
                분:초
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              평균 {Math.round(timeSpent / totalQuestions)}초/문제
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
              획득 포인트
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gray-800">
                {points}
              </span>
              <span className="text-sm text-gray-600 mb-1">
                /{maxPoints}
              </span>
            </div>
            <ProgressBar
              value={points}
              max={maxPoints}
              color="secondary"
              size="sm"
              className="mt-2"
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
              학습 단어
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gray-800">
                {newWordsLearned.length}
              </span>
              <span className="text-sm text-gray-600 mb-1">
                개 학습
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {wordsToReview.length}개 단어 복습 필요
            </div>
          </div>
        </div>
      </div>
      
      {/* Word Lists */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-green-600 mb-2 font-child-friendly">
            새로 배운 단어 ({newWordsLearned.length})
          </h3>
          <div className="bg-green-50 p-3 rounded-lg max-h-32 overflow-y-auto">
            {newWordsLearned.length > 0 ? (
              <ul className="space-y-1">
                {newWordsLearned.map((word, index) => (
                  <li key={index} className="text-sm text-green-800 font-child-friendly">
                    {word}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-800 font-child-friendly">
                새로 배운 단어가 없습니다.
              </p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-red-600 mb-2 font-child-friendly">
            복습할 단어 ({wordsToReview.length})
          </h3>
          <div className="bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
            {wordsToReview.length > 0 ? (
              <ul className="space-y-1">
                {wordsToReview.map((word, index) => (
                  <li key={index} className="text-sm text-red-800 font-child-friendly">
                    {word}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-800 font-child-friendly">
                복습할 단어가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 flex justify-center">
        {onContinue && (
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            className="min-w-[200px]"
          >
            계속하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;
