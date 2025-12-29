import React, { useState, useEffect } from 'react';
import { generateBonusTrivia } from '../services/geminiService';
import { sendBonusResults } from '../services/userService';
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
        const response = await sendBonusResults(user.username, score);
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
        <button 
          onClick={onBack} 
          className="mb-6 bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 group"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.backToDashboard')}
        </button>

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