import React, { useState, useEffect } from 'react';
import { generateAssistedLesson } from '../services/aiService';
import { updateUserXP } from '../services/userService';
import { AssistedLearningData, User, N8NUpdateXPResponse } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Quiz from './Quiz';
import Modal from './Modal';
import { useTranslation } from '../i18n/LanguageContext';
import { TOPICS } from '../constants';

interface AssistedLearningProps {
  topic: string;
  user: User;
  onComplete: (xpResponse: N8NUpdateXPResponse, completedTopicId: string) => void;
  onBack: () => void;
}

const AssistedLearning: React.FC<AssistedLearningProps> = ({ topic, user, onComplete, onBack }) => {
  const [data, setData] = useState<AssistedLearningData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<N8NUpdateXPResponse | null>(null);
  const { t, language, dir } = useTranslation();

  const topicInfo = TOPICS.find(t => t.id === topic);
  const displayTopic = topicInfo ? `${t(topicInfo.labelKey)} ${topicInfo.emoji}` : topic;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const lessonData = await generateAssistedLesson(topic, language, user.rank, user.level);
        setData(lessonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('assisted.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [topic, language, t, user.rank, user.level]);

  const handleQuizSubmit = async (score: number, correctAnswers: number, totalQuestions: number) => {
    setIsLoading(true);
    try {
        const response = await updateUserXP(user.username, topic, score, user.level);
        setQuizResult({
            ...response,
            message: `Great effort! You got ${correctAnswers}/${totalQuestions} correct!` 
        });
    } catch (err) {
        setError('Could not update your score. Please check your connection.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (quizResult) {
        onComplete(quizResult, topic);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.backToDashboard')}
        </button>

        <h1 className="text-4xl font-black text-gray-800 mb-2">{t('assisted.title')}</h1>
        <h2 className="text-2xl font-bold text-blue-600 mb-6">{displayTopic}</h2>

        {isLoading && !data && <LoadingSpinner />}
        {error && <p className="text-red-500 text-center bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {data && (
            <div className="space-y-8 animate-fade-in-up">
                <div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('assisted.lessonTitle')}</h3>
                    <div className="prose max-w-none bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md whitespace-pre-wrap" dir={dir}>
                        {data.lesson}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('assisted.quizTitle')}</h3>
                    <Quiz questions={data.quiz} onSubmit={handleQuizSubmit} />
                </div>
            </div>
        )}

        {quizResult && (
            <Modal title={t('modal.quizResults')} onClose={handleCloseModal}>
                <p className="text-lg">{quizResult.message}</p>
                <p className="font-bold text-xl mt-4 text-purple-600">+ {quizResult.new_xp - user.total_xp} XP</p>
            </Modal>
        )}

        {isLoading && data && (
            <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col justify-center items-center z-40">
                <LoadingSpinner/>
                <p className="text-lg font-semibold text-gray-700">{t('assisted.loadingScore')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AssistedLearning;