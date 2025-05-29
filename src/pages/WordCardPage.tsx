import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import BasicLayout from '../components/BasicLayout';
import WordCard from '../components/WordCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAudio } from '../contexts/AudioContext';
import { useError } from '../contexts/ErrorContext';
import useAsync from '../hooks/useAsync';

// 샘플 단어 데이터 (실제로는 API나 서비스에서 가져올 것)
const sampleWords = [
  {
    id: 'apple_n_01',
    word: 'apple',
    translation: '사과',
    example: 'I eat an apple every day.',
    imageUrl: '/images/apple.jpg',
    audioUrl: '/audio/apple.mp3',
    level: 1,
  },
  {
    id: 'book_n_01',
    word: 'book',
    translation: '책',
    example: 'I read a book before bed.',
    imageUrl: '/images/book.jpg',
    audioUrl: '/audio/book.mp3',
    level: 1,
  },
  {
    id: 'cat_n_01',
    word: 'cat',
    translation: '고양이',
    example: 'The cat is sleeping on the sofa.',
    imageUrl: '/images/cat.jpg',
    audioUrl: '/audio/cat.mp3',
    level: 1,
  },
  {
    id: 'dog_n_01',
    word: 'dog',
    translation: '개',
    example: 'My dog likes to play in the park.',
    imageUrl: '/images/dog.jpg',
    audioUrl: '/audio/dog.mp3',
    level: 1,
  },
];

const WordCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useError();
  const { play } = useAudio();
  
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [words, setWords] = useState<typeof sampleWords>([]);
  
  // Fetch words
  const {
    loading,
    error,
    execute: fetchWords,
  } = useAsync<typeof sampleWords>(
    async () => {
      // In a real app, this would fetch from an API or service
      // For now, we'll just use the sample data
      return sampleWords;
    },
    [],
    {
      onSuccess: (data) => {
        setWords(data);
      },
      onError: (error) => {
        showError('단어를 불러오는 중 오류가 발생했습니다.', 'error', error.message);
      },
    }
  );
  
  const currentWord = words[currentWordIndex];
  
  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Reached the end, show completion message or navigate
      navigate('/');
    }
  };
  
  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };
  
  const handlePlayAudio = () => {
    if (currentWord?.audioUrl) {
      play(currentWord.audioUrl).catch((error) => {
        showError('오디오를 재생하는 중 오류가 발생했습니다.', 'error');
      });
    }
  };
  
  if (loading) {
    return (
      <BasicLayout
        title="단어 카드"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner size="lg" label="단어를 불러오고 있어요..." />
        </div>
      </BasicLayout>
    );
  }
  
  if (error || words.length === 0) {
    return (
      <BasicLayout
        title="단어 카드"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 font-child-friendly mb-4">
            단어를 불러올 수 없어요
          </h2>
          <p className="text-gray-600 font-child-friendly mb-6">
            단어를 불러오는 중 문제가 발생했습니다.
          </p>
          <Button onClick={fetchWords}>
            다시 시도
          </Button>
        </div>
      </BasicLayout>
    );
  }
  
  return (
    <BasicLayout
      title="단어 카드"
      showBackButton
      onBackClick={() => navigate('/')}
      subtitle={`${currentWordIndex + 1}/${words.length}`}
    >
      <div className="flex flex-col items-center">
        {currentWord && (
          <WordCard
            word={currentWord.word}
            translation={currentWord.translation}
            example={currentWord.example}
            imageUrl={currentWord.imageUrl}
            audioUrl={currentWord.audioUrl}
            onPlayAudio={handlePlayAudio}
            onNext={handleNext}
            className="max-w-md w-full"
          />
        )}
        
        <div className="flex justify-between w-full max-w-md mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
            className="flex items-center gap-2"
            aria-label="이전 단어"
          >
            <span aria-hidden="true">←</span>
            이전
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center gap-2"
            aria-label="다음 단어"
          >
            다음
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </BasicLayout>
  );
};

export default WordCardPage;
