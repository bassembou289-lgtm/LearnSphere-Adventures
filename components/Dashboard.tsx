import React, { useState } from 'react';
import { User } from '../types';
import { TOPICS, STAGE_COLORS, XP_PER_LEVEL, MAX_LEVEL_IN_RANK } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import LeaderboardModal from './LeaderboardModal';

interface DashboardProps {
  user: User;
  onSelectMode: (mode: 'assisted' | 'self' | 'bonus', topic?: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const StatIcon: React.FC<{ icon: string; value: React.ReactNode; label: string; color: string;}> = ({ icon, value, label, color }) => (
    <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} shadow-lg`}>
            <span className="text-2xl text-white font-bold">{icon}</span>
        </div>
        <div>
            <p className="font-bold text-lg text-white">{value}</p>
            <p className="text-sm text-gray-300">{label}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onSelectMode, onOpenSettings, onLogout }) => {
  const { t } = useTranslation();
  const [isSelfPacedModalOpen, setSelfPacedModalOpen] = useState(false);
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
  const bonusUnlocked = user.topics_completed >= 2;
  const xpForCurrentLevel = (user.level - 1) * XP_PER_LEVEL;
  const xpIntoCurrentLevel = user.total_xp - xpForCurrentLevel;
  const progressPercentage = (xpIntoCurrentLevel / XP_PER_LEVEL) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">{t('dashboard.welcome', { username: user.username })}</h1>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-md">{t('dashboard.prompt')}</p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={onOpenSettings} title={t('settings.title')} className="p-2 rounded-full bg-white/50 hover:bg-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
               <button onClick={onLogout} title={t('dashboard.logout')} className="p-2 rounded-full bg-white/50 hover:bg-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
              <LanguageSwitcher />
            </div>
        </header>
        
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-4">
                <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md"/>
                
                <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-4 rtl:space-x-reverse">
                    <div title={t(`rank.${user.rank}`)} className={`px-4 py-2 flex items-center justify-center rounded-full text-white font-bold text-sm ${STAGE_COLORS[user.rank]} shadow-md`}>
                        {t(`rank.${user.rank}`)}
                    </div>
                    <StatIcon icon="⭐" value={<>{user.level} <span className="text-gray-400">/ {MAX_LEVEL_IN_RANK}</span></>} label={t('dashboard.levelLabel')} color="bg-blue-500" />
                    <StatIcon icon="⚡" value={user.total_xp} label={t('dashboard.xpLabel')} color="bg-yellow-500" />
                    <button onClick={() => setLeaderboardOpen(true)} title={t('dashboard.leaderboard')} className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500 shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110">
                        <span className="text-2xl text-white font-bold">🏆</span>
                    </button>
                </div>
            </div>
             <div className="w-full bg-slate-700 rounded-full h-4 mt-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{t('dashboard.progressTracker.title')}</h2>
          <p className="text-gray-500 text-center mb-6">{t('dashboard.progressTracker.subtitle', { rank: t(`rank.${user.rank}`) })}</p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {TOPICS.map(topic => {
              const isCompleted = user.completed_topics_in_rank.includes(topic.id);
              return (
                <div key={topic.id} title={t(topic.labelKey)} className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-400 shadow-lg' : 'bg-gray-200'}`}>
                    <span className={`text-2xl transition-opacity ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>{topic.emoji}</span>
                    {isCompleted && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </div>
                    )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
             <div className="flex flex-col items-center mb-8 gap-2">
                <button 
                    onClick={() => setSelfPacedModalOpen(true)}
                    className="bg-purple-500 text-white font-bold py-2 px-5 rounded-full hover:bg-purple-600 transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    {t('dashboard.selfPacedStudy')}
                </button>
                <p className="text-sm text-gray-600 font-medium text-center">{t('dashboard.selfPacedStudy.description')}</p>
            </div>
            
            <div className="text-center mb-6 border-t pt-8 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.chooseTopic')}</h2>
                <p className="text-gray-500 mt-1">{t('dashboard.assisted.description')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-8">
                {TOPICS.map(topicInfo => (
                    <button
                        key={topicInfo.id}
                        onClick={() => onSelectMode('assisted', topicInfo.id)}
                        aria-label={t(topicInfo.labelKey)}
                        className="w-full aspect-square rounded-2xl cursor-pointer transition-all duration-300 shadow-lg flex flex-col justify-center items-center text-center bg-gray-50 hover:shadow-xl hover:transform hover:-translate-y-1 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-400 hover:ring-4 hover:ring-orange-400"
                    >
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">{topicInfo.emoji}</span>
                        <p className="mt-2 text-sm sm:text-base font-bold text-gray-800">
                            {t(topicInfo.labelKey)}
                        </p>
                    </button>
                ))}
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <button 
                onClick={() => onSelectMode('bonus')} 
                disabled={!bonusUnlocked}
                className="w-full max-w-md mx-auto bg-green-500 text-white font-black py-4 px-6 rounded-xl text-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-70"
            >
                {t('dashboard.bonusZone')}
            </button>
            {!bonusUnlocked && <p className="text-sm text-white/80 drop-shadow-md mt-2">{t('dashboard.bonusZone.locked')}</p>}
        </div>

      </div>

      {isSelfPacedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setSelfPacedModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-2xl w-full transform transition-all animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-black text-gray-800 text-center mb-6">{t('dashboard.selfPacedModalTitle')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => {
                                onSelectMode('self', topic.id);
                                setSelfPacedModalOpen(false);
                            }}
                            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-orange-100 hover:shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="text-4xl">{topic.emoji}</span>
                            <span className="mt-2 font-bold text-gray-700 text-center">{t(topic.labelKey)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {isLeaderboardOpen && <LeaderboardModal onClose={() => setLeaderboardOpen(false)} />}
    </div>
  );
};

export default Dashboard;