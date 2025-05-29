import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import BasicLayout from '../components/BasicLayout';
import QuizCard from '../components/QuizCard';
import ScoreBoard from '../components/ScoreBoard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useError } from '../contexts/ErrorContext';
import useAsync from '../hooks/useAsync';
import { QuizService } from '../services/quiz.service';
import { GamificationService } from '../services/gamification.service';
import { QuizSession, QuizQuestion, QuizAnswer, QuizResult } from '../types/quiz';

const QuizPage: React.FC = () => {
  const { level = '1' } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { showError } = useError();
  
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<QuizAnswer | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  
  const quizService = QuizService.getInstance();
  const gamificationService = GamificationService.getInstance();
  const userId = 'default_user';
  const levelNum = parseInt(level, 10);
  
  // Generate quiz session
  const {
    loading: loadingQuiz,
    error: quizError,
    execute: generateQuiz,
  } = useAsync<QuizSession>(
    async () => {
      const session = await quizService.generateQuiz(levelNum, userId);
      setQuizSession(session);
      if (session.questions.length > 0) {
        setCurrentQuestion(session.questions[0]);
      }
      return session;
    },
    [levelNum, userId],
    {
      onError: (error) => {
        showError('퀴즈를 생성하는 중 오류가 발생했습니다.', 'error', error.message);
      },
    }
  );
  
  // Timer effect
  useEffect(() => {
    if (!quizSession || quizResult) return;
    
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [quizSession, quizResult]);
  
  // Handle answer submission
  const handleAnswer = async (answer: string) => {
    if (!quizSession || !currentQuestion) return;
    
    try {
      const result = await quizService.submitAnswer(
        quizSession.id,
        currentQuestion.id,
        answer,
        timeSpent
      );
      
      setSelectedAnswer(answer);
      setAnswerResult(result);
      
      // Update session with answer
      setQuizSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [currentQuestion.id]: {
              questionId: currentQuestion.id,
              answer,
              isCorrect: result.isCorrect,
              attempts: result.attempts,
              points: result.points,
              timeSpent,
            },
          },
          totalScore: prev.totalScore + (result.isCorrect ? result.points : 0),
        };
      });
      
      // If correct or max attempts reached, prepare to move to next question
      if (result.isCorrect || result.attempts >= quizService.getConfig().maxAttempts) {
        setTimeout(() => {
          moveToNextQuestion();
        }, 2000);
      }
    } catch (error) {
      showError('답변을 제출하는 중 오류가 발생했습니다.', 'error');
    }
  };
  
  // Move to next question
  const moveToNextQuestion = () => {
    if (!quizSession || !currentQuestion) return;
    
    const currentIndex = quizSession.questions.findIndex(q => q.id === currentQuestion.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < quizSession.questions.length) {
      setCurrentQuestion(quizSession.questions[nextIndex]);
      setSelectedAnswer(null);
      setAnswerResult(null);
    } else {
      // Quiz completed
      completeQuiz();
    }
  };
  
  // Complete quiz
  const completeQuiz = async () => {
    if (!quizSession) return;
    
    try {
      const result = await quizService.completeQuiz(quizSession.id);
      setQuizResult(result);
      
      // Update user progress
      await gamificationService.addPoints(
        userId,
        result.totalPoints,
        'quiz_completed',
        {
          level: levelNum,
          accuracy: result.accuracy,
          completionTime: result.timeSpent,
        }
      );
      
      await gamificationService.updateStatistics(
        userId,
        {
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          completionTime: result.timeSpent,
          wordsLearned: result.newWordsLearned.length,
        }
      );
    } catch (error) {
      showError('퀴즈를 완료하는 중 오류가 발생했습니다.', 'error');
    }
  };
  
  // Handle continue after quiz completion
  const handleContinue = () => {
    navigate('/');
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (loadingQuiz) {
    return (
      <BasicLayout
        title={`Level ${level} 퀴즈`}
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner size="lg" label="퀴즈를 준비하고 있어요..." />
        </div>
      </BasicLayout>
    );
  }
  
  if (quizError) {
    return (
      <BasicLayout
        title={`Level ${level} 퀴즈`}
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 font-child-friendly mb-4">
            퀴즈를 불러올 수 없어요
          </h2>
          <p className="text-gray-600 font-child-friendly mb-6">
            퀴즈를 생성하는 중 문제가 발생했습니다.
          </p>
          <Button onClick={generateQuiz}>
            다시 시도
          </Button>
        </div>
      </BasicLayout>
    );
  }
  
  if (quizResult) {
    return (
      <BasicLayout
        title="퀴즈 결과"
        showBackButton
        onBackClick={() => navigate('/')}
      >
        <ScoreBoard
          totalQuestions={quizResult.totalQuestions}
          correctAnswers={quizResult.correctAnswers}
          timeSpent={quizResult.timeSpent}
          points={quizResult.totalPoints}
          maxPoints={quizResult.maxPoints}
          newWordsLearned={quizResult.newWordsLearned}
          wordsToReview={quizResult.wordsToReview}
          onContinue={handleContinue}
        />
      </BasicLayout>
    );
  }
  
  return (
    <BasicLayout
      title={`Level ${level} 퀴즈`}
      showBackButton
      onBackClick={() => navigate('/')}
      subtitle={`문제 ${currentQuestion ? quizSession?.questions.findIndex(q => q.id === currentQuestion.id) + 1 : 0}/${quizSession?.questions.length || 0}`}
      rightContent={
        <div className="text-sm font-medium text-gray-600">
          시간: {formatTime(timeSpent)}
        </div>
      }
    >
      {currentQuestion && (
        <QuizCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          imageUrl={currentQuestion.imageUrl}
          onAnswer={handleAnswer}
          attempts={answerResult?.attempts || 0}
          maxAttempts={quizService.getConfig().maxAttempts}
          isAnswered={!!answerResult}
          selectedAnswer={selectedAnswer || undefined}
          isCorrect={answerResult?.isCorrect}
          feedback={answerResult?.feedback}
        />
      )}
    </BasicLayout>
  );
};

export default QuizPage;
