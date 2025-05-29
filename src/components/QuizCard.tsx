import React from 'react';
import { clsx } from 'clsx';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

export interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  onAnswer: (answer: string) => void;
  attempts: number;
  maxAttempts: number;
  isAnswered: boolean;
  selectedAnswer?: string;
  isCorrect?: boolean;
  feedback?: string;
  className?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctAnswer,
  imageUrl,
  onAnswer,
  attempts,
  maxAttempts,
  isAnswered,
  selectedAnswer,
  isCorrect,
  feedback,
  className,
}) => {
  const handleOptionClick = (option: string) => {
    if (isAnswered || attempts >= maxAttempts) return;
    onAnswer(option);
  };

  return (
    <div className={clsx('bg-white rounded-xl shadow-lg overflow-hidden', className)}>
      {/* Question Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <h2 className="text-xl font-bold text-primary-800 font-child-friendly">
          {question}
        </h2>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-primary-600 font-child-friendly">
            시도: {attempts}/{maxAttempts}
          </span>
          {isAnswered && (
            <span className={clsx(
              'text-sm font-medium font-child-friendly',
              isCorrect ? 'text-green-600' : 'text-red-600'
            )}>
              {isCorrect ? '정답!' : '오답'}
            </span>
          )}
        </div>
      </div>
      
      {/* Question Content */}
      <div className="p-6">
        {/* Image */}
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageUrl}
              alt="문제 이미지"
              className="rounded-lg max-h-48 object-contain"
            />
          </div>
        )}
        
        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              className={clsx(
                'w-full p-3 rounded-lg border-2 text-left transition-colors font-child-friendly',
                isAnswered && option === correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : isAnswered && option === selectedAnswer && !isCorrect
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : option === selectedAnswer
                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
              )}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered || attempts >= maxAttempts}
              aria-pressed={option === selectedAnswer}
            >
              {option}
            </button>
          ))}
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div className={clsx(
            'mt-4 p-3 rounded-lg',
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          )}>
            <p className="font-child-friendly">{feedback}</p>
          </div>
        )}
        
        {/* Attempts Progress */}
        {maxAttempts > 1 && (
          <div className="mt-4">
            <ProgressBar
              value={attempts}
              max={maxAttempts}
              label="남은 시도"
              color={attempts >= maxAttempts ? "danger" : "warning"}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
