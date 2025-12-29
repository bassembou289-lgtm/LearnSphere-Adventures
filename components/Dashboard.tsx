
import React, { useState } from 'react';
import { User } from '../types';
import { TOPICS, STAGE_COLORS, XP_PER_LEVEL, MAX_LEVEL_IN_RANK } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import LeaderboardModal from './LeaderboardModal';
import AboutModal from './AboutModal';

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
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const bonusUnlocked = user.topics_completed >= 2;
  
  const xpForCurrentLevel = (user.level - 1) * XP_PER_LEVEL;
  const xpIntoCurrentLevel = Math.max(0, user.total_xp - xpForCurrentLevel);
  // Ensure percentage is between 0 and 100 to prevent layout breakage
  const progressPercentage = Math.min(100, Math.max(0, (xpIntoCurrentLevel / XP_PER_LEVEL) * 100));

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">{t('dashboard.welcome', { username: user.username })}</h1>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-md">{t('dashboard.prompt')}</p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={() => setAboutModalOpen(true)} title={t('about.title')} className="p-2 rounded-full bg-white/50 hover:bg-white transition shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </button>
              <button onClick={onOpenSettings} title={t('settings.title')} className="p-2 rounded-full bg-white/50 hover:bg-white transition shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
               <button onClick={onLogout} title={t('dashboard.logout')} className="p-2 rounded-full bg-white/50 hover:bg-white transition shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
             <div className="w-full bg-slate-700 rounded-full h-4 mt-6 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
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

        <div 
            onClick={() => setSelfPacedModalOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-xl p-6 sm:p-10 mb-8 relative overflow-hidden group cursor-pointer transform transition-all hover:scale-[1.01] hover:shadow-2xl"
        >
             {/* Background Animation Layer: Linear Points at Bottom */}
             <div className="absolute inset-0 pointer-events-none opacity-60">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    
                    {/* Pattern: 3 White (smaller), 1 Yellow Blinking (smaller). Spaced evenly. */}
                    
                    {/* Group 1 */}
                    <circle cx="2" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="7" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="12" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="17" cy="80" r="1.5" fill="#FBBF24" stroke="white" strokeWidth="0.5" className="animate-pulse" />

                    {/* Group 2 */}
                    <circle cx="22" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="27" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="32" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="37" cy="80" r="1.5" fill="#FBBF24" stroke="white" strokeWidth="0.5" className="animate-pulse" style={{animationDelay: '0.2s'}} />

                    {/* Group 3 */}
                    <circle cx="42" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="47" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="52" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="57" cy="80" r="1.5" fill="#FBBF24" stroke="white" strokeWidth="0.5" className="animate-pulse" style={{animationDelay: '0.4s'}} />

                    {/* Group 4 */}
                    <circle cx="62" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="67" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="72" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="77" cy="80" r="1.5" fill="#FBBF24" stroke="white" strokeWidth="0.5" className="animate-pulse" style={{animationDelay: '0.6s'}} />

                     {/* Group 5 */}
                    <circle cx="82" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="87" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="92" cy="80" r="0.8" fill="white" className="opacity-80" />
                    <circle cx="97" cy="80" r="1.5" fill="#FBBF24" stroke="white" strokeWidth="0.5" className="animate-pulse" style={{animationDelay: '0.8s'}} />
                    
                </svg>
             </div>

             {/* Traveling Plane Animation: Straight Line */}
             <div className="absolute animate-plane-travel w-16 h-16 flex items-center justify-center z-0 pointer-events-none">
                {/* Classic Plane SVG: Yellow Fill (#FBBF24), White Stroke. */}
                <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 24 24" fill="#FBBF24" stroke="white" strokeWidth="1.5">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                {/* Trail effect behind the plane */}
                <div className="absolute bottom-1/2 left-0 w-full h-0.5 bg-white opacity-20 blur-sm rounded-full -translate-x-full translate-y-2"></div>
             </div>

             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start pb-6">
                <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 flex items-center justify-center md:justify-start gap-3">
                        <span className="text-4xl">🗺️</span> {t('dashboard.selfPacedStudy')}
                    </h2>
                    <p className="text-indigo-100 text-lg font-bold mb-2">{t('dashboard.selfPacedStudy.description')}</p>
                    <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                        {t('dashboard.selfPacedStudy.detail')}
                    </p>
                </div>
                 <div className="flex-shrink-0">
                    <button className="bg-white text-indigo-700 font-black py-3 px-8 rounded-full text-lg shadow-lg group-hover:bg-yellow-300 group-hover:text-indigo-900 group-hover:scale-105 transition-all duration-300 relative z-20">
                        {t('dashboard.startJourney')}
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
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
      {isAboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
