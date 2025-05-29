import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import BasicLayout from '../components/BasicLayout';
import RWLPlayer from '../components/RWLPlayer';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useError } from '../contexts/ErrorContext';
import useAsync from '../hooks/useAsync';
import { RWLParserService, RWLContent, RWLSegment } from '../services/rwlParser.service';

const RWLPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [currentSegment, setCurrentSegment] = useState<RWLSegment | null>(null);
  
  const rwlParserService = RWLParserService.getInstance();
  
  // Fetch RWL content
  const {
    data: rwlContent,
    loading,
    error,
    execute: fetchRWLContent,
  } = useAsync<RWLContent>(
    async () => {
      // In a real app, this would fetch from an API or service
      // For now, we'll just use the sample content
      return rwlParserService.createSampleContent();
    },
    [],
    {
      onError: (error) => {
        showError('RWL 콘텐츠를 불러오는 중 오류가 발생했습니다.', 'error', error.message);
      },
    }
  );
  
  const handleSegmentChange = (segment: RWLSegment | null) => {
    setCurrentSegment(segment);
  };
  
  const handleComplete = () => {
    // In a real app, this would update user progress
    // For now, we'll just show a message
    showError('학습을 완료했습니다!', 'info');
  };
  
  if (loading) {
    return (
      <BasicLayout
        title="읽으면서 듣기"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner size="lg" label="콘텐츠를 불러오고 있어요..." />
        </div>
      </BasicLayout>
    );
  }
  
  if (error || !rwlContent) {
    return (
      <BasicLayout
        title="읽으면서 듣기"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 font-child-friendly mb-4">
            콘텐츠를 불러올 수 없어요
          </h2>
          <p className="text-gray-600 font-child-friendly mb-6">
            RWL 콘텐츠를 불러오는 중 문제가 발생했습니다.
          </p>
          <Button onClick={fetchRWLContent}>
            다시 시도
          </Button>
        </div>
      </BasicLayout>
    );
  }
  
  return (
    <BasicLayout
      title="읽으면서 듣기"
      showBackButton
      onBackClick={() => navigate('/')}
      subtitle={rwlContent.title}
    >
      <div className="flex flex-col items-center">
        <RWLPlayer
          content={rwlContent}
          onSegmentChange={handleSegmentChange}
          onComplete={handleComplete}
          className="max-w-2xl w-full"
        />
        
        {/* Additional content or controls can be added here */}
        <div className="mt-8 max-w-2xl w-full">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 font-child-friendly mb-2">
              💡 읽으면서 듣기 학습 팁
            </h3>
            <ul className="text-sm text-blue-700 font-child-friendly space-y-1">
              <li>• 먼저 전체 내용을 한 번 들어보세요.</li>
              <li>• 각 문장을 따라 읽으며 발음을 연습해보세요.</li>
              <li>• 모르는 단어는 클릭하여 의미를 확인할 수 있어요.</li>
              <li>• 반복해서 들으면 더 효과적으로 학습할 수 있어요.</li>
            </ul>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default RWLPage;
