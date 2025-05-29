import React from 'react';
import { clsx } from 'clsx';
import { RWLContent, RWLSegment } from '../services/rwlParser.service';
import { useAudio } from '../contexts/AudioContext';
import Button from './ui/Button';

export interface RWLPlayerProps {
  content: RWLContent;
  onSegmentChange?: (segment: RWLSegment | null) => void;
  onComplete?: () => void;
  className?: string;
}

const RWLPlayer: React.FC<RWLPlayerProps> = ({
  content,
  onSegmentChange,
  onComplete,
  className,
}) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = React.useState<number>(-1);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [autoPlay, setAutoPlay] = React.useState<boolean>(true);
  
  const { play, pause, stop } = useAudio();
  
  const currentSegment = currentSegmentIndex >= 0 && currentSegmentIndex < content.segments.length
    ? content.segments[currentSegmentIndex]
    : null;
  
  // Handle segment change
  React.useEffect(() => {
    if (onSegmentChange) {
      onSegmentChange(currentSegment);
    }
    
    // Check if we've reached the end
    if (currentSegmentIndex === content.segments.length - 1 && !isPlaying) {
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentSegment, currentSegmentIndex, isPlaying, content.segments.length, onSegmentChange, onComplete]);
  
  // Handle segment playback
  React.useEffect(() => {
    if (!currentSegment || !isPlaying) {
      return;
    }
    
    // In a real app, this would play the audio for the current segment
    // For now, we'll just simulate it with a timer
    const timer = setTimeout(() => {
      if (currentSegmentIndex < content.segments.length - 1) {
        setCurrentSegmentIndex(currentSegmentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, currentSegment.duration * 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [currentSegment, currentSegmentIndex, isPlaying, content.segments.length]);
  
  const handlePlay = () => {
    if (currentSegmentIndex === -1) {
      setCurrentSegmentIndex(0);
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(-1);
    stop();
  };
  
  const handlePrevious = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentSegmentIndex < content.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    }
  };
  
  const handleSegmentClick = (index: number) => {
    setCurrentSegmentIndex(index);
    if (autoPlay) {
      setIsPlaying(true);
    }
  };
  
  return (
    <div className={clsx('bg-white rounded-xl shadow-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-100">
        <h2 className="text-2xl font-bold text-secondary-800 font-child-friendly">
          {content.title}
        </h2>
        <p className="text-sm text-secondary-600 font-child-friendly">
          총 {content.segments.length}개 문장, {Math.floor(content.totalDuration / 60)}분 {content.totalDuration % 60}초
        </p>
      </div>
      
      {/* Player Controls */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <Button
                variant="outline"
                onClick={handlePause}
                aria-label="일시정지"
              >
                ⏸️
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handlePlay}
                aria-label="재생"
              >
                ▶️
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleStop}
              aria-label="정지"
            >
              ⏹️
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSegmentIndex <= 0}
              aria-label="이전 문장"
            >
              ⏮️
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentSegmentIndex >= content.segments.length - 1}
              aria-label="다음 문장"
            >
              ⏭️
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm text-gray-700 font-child-friendly">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={() => setAutoPlay(!autoPlay)}
                className="rounded text-secondary-600 focus:ring-secondary-500"
              />
              자동 재생
            </label>
          </div>
        </div>
      </div>
      
      {/* Current Segment */}
      {currentSegment && (
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
          <p className="text-lg text-yellow-800 font-child-friendly">
            {currentSegment.text}
          </p>
        </div>
      )}
      
      {/* Segment List */}
      <div className="px-6 py-4 max-h-80 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-500 mb-2 font-child-friendly">
          전체 문장
        </h3>
        <div className="space-y-2">
          {content.segments.map((segment, index) => (
            <div
              key={segment.id}
              className={clsx(
                'p-3 rounded-lg cursor-pointer transition-colors',
                index === currentSegmentIndex
                  ? 'bg-secondary-100 border border-secondary-300'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              )}
              onClick={() => handleSegmentClick(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {Math.floor(segment.timestamp / 60)}:{(segment.timestamp % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-500">
                  {segment.duration}초
                </span>
              </div>
              <p className={clsx(
                'text-sm font-child-friendly',
                index === currentSegmentIndex ? 'text-secondary-800' : 'text-gray-800'
              )}>
                {segment.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RWLPlayer;
