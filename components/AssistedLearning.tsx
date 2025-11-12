import React, { useState, useEffect } from 'react';
import { generateAssistedLesson } from '../services/geminiService';
// import { updateUserXP } from '../services/n8nService';
import { AssistedLearningData, User, N8NUpdateXPResponse } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Quiz from './Quiz';
import Modal from './Modal';
import { useTranslation } from '../i18n/LanguageContext';
import { TOPICS, MAX_LEVEL_IN_RANK } from '../constants';

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
        // MOCK RESPONSE - In a real app, you would uncomment the n8nService call
        // const response = await updateUserXP(user.username, topic, score, user.level);
        
        const xpGained = 25 + Math.round(score / 4); // Gain between 25-50 XP
        const newTotalXp = user.total_xp + xpGained;
        
        let newLevel = user.level;
        if (user.level < MAX_LEVEL_IN_RANK && score >= 80) { // Level up on good performance if not max level
            newLevel = user.level + 1;
        }

        const response: N8NUpdateXPResponse = {
            message: `Great effort! You got ${correctAnswers}/${totalQuestions} correct and earned ${xpGained} XP!`,
            new_xp: newTotalXp,
            new_level: newLevel,
            rank: user.rank,
        };

        await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
        setQuizResult(response);
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
        <button onClick={onBack} className="mb-6 bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 hover:bg-gray-100 transition" dangerouslySetInnerHTML={{ __html: t('common.backToDashboard') }}/>
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