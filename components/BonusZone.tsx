import React, { useState, useEffect } from 'react';
import { generateBonusTrivia } from '../services/geminiService';
// import { sendBonusResults } from '../services/n8nService';
import { BonusData, User, N8NBonusResponse } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Quiz from './Quiz';
import Modal from './Modal';
import { useTranslation } from '../i18n/LanguageContext';

interface BonusZoneProps {
  user: User;
  onComplete: (xpResponse: N8NBonusResponse) => void;
  onBack: () => void;
}

const BonusZone: React.FC<BonusZoneProps> = ({ user, onComplete, onBack }) => {
  const [data, setData] = useState<BonusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<N8NBonusResponse | null>(null);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bonusData = await generateBonusTrivia(language);
        setData(bonusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('bonus.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [language, t]);

  const handleQuizSubmit = async (score: number) => {
    setIsLoading(true);
    try {
        // MOCK RESPONSE - In a real app, you would uncomment the n8nService call
        // const response = await sendBonusResults(user.username, score);
        let response: N8NBonusResponse;
        if (score === 100) {
            response = { message: "Awesome! You aced the bonus round! 🤩", new_xp: user.total_xp + 40 };
        } else {
            response = { message: "Fun stuff! Keep learning to earn more XP!", new_xp: user.total_xp };
        }
        await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
        setQuizResult(response);
    } catch (err) {
        setError('Could not submit your bonus score. Please check your connection.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (quizResult) {
      onComplete(quizResult);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-6 bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 hover:bg-gray-100 transition" dangerouslySetInnerHTML={{ __html: t('common.backToDashboard') }}/>
        <h1 className="text-4xl font-black text-gray-800 mb-2">{t('bonus.title')}</h1>
        <h2 className="text-2xl font-bold text-orange-600 mb-6">{t('bonus.subtitle')}</h2>

        {isLoading && !data && <LoadingSpinner />}
        {error && <p className="text-red-500 text-center bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {data && (
            <div className="animate-fade-in-up">
                <Quiz questions={data.quiz} onSubmit={handleQuizSubmit} />
            </div>
        )}

        {quizResult && (
            <Modal title={t('modal.bonusResults')} onClose={handleCloseModal}>
                <p className="text-lg">{quizResult.message}</p>
                {quizResult.new_xp > user.total_xp && (
                    <p className="font-bold text-xl mt-4 text-purple-600">+ {quizResult.new_xp - user.total_xp} XP</p>
                )}
            </Modal>
        )}
        
        {isLoading && data && (
            <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col justify-center items-center z-40">
                <LoadingSpinner/>
                <p className="text-lg font-semibold text-gray-700">{t('bonus.loadingAnswers')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BonusZone;