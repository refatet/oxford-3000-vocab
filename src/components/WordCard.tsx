import React from 'react';
import { clsx } from 'clsx';
import Button from './ui/Button';

export interface WordCardProps {
  word: string;
  translation: string;
  example: string;
  imageUrl?: string;
  audioUrl?: string;
  onPlayAudio?: () => void;
  onNext?: () => void;
  className?: string;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  translation,
  example,
  imageUrl,
  audioUrl,
  onPlayAudio,
  onNext,
  className,
}) => {
  return (
    <div className={clsx('bg-white rounded-xl shadow-lg overflow-hidden', className)}>
      {/* Word Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <h2 className="text-2xl font-bold text-primary-800 font-child-friendly">
          {word}
        </h2>
        <p className="text-lg text-primary-600 font-child-friendly">
          {translation}
        </p>
      </div>
      
      {/* Word Content */}
      <div className="p-6">
        {/* Image */}
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageUrl}
              alt={word}
              className="rounded-lg max-h-48 object-contain"
            />
          </div>
        )}
        
        {/* Example */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1 font-child-friendly">
            예문
          </h3>
          <p className="text-gray-800 font-child-friendly">
            {example}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          {audioUrl && onPlayAudio && (
            <Button
              variant="secondary"
              onClick={onPlayAudio}
              className="flex items-center gap-2"
              aria-label="발음 듣기"
            >
              <span aria-hidden="true">🔊</span>
              발음 듣기
            </Button>
          )}
          
          {onNext && (
            <Button
              variant="primary"
              onClick={onNext}
              className="flex items-center gap-2"
              aria-label="다음 단어"
            >
              다음 단어
              <span aria-hidden="true">→</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCard;
