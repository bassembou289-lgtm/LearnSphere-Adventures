import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import AssistedLearning from './components/AssistedLearning';
import SelfLearning from './components/SelfLearning';
import BonusZone from './components/BonusZone';
import LoadingSpinner from './components/LoadingSpinner';
import SettingsModal from './components/SettingsModal';
import { User, View, N8NUpdateXPResponse, N8NBonusResponse } from './types';
import { useTranslation } from './i18n/LanguageContext';
import { TOPICS, RANKS } from './constants';
// import { signInUser, signUpUser } from './services/n8nService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleAuth = async (mode: 'signIn' | 'signUp', username: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // MOCK RESPONSE - In a real app, you would use the n8nService calls
      await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
      
      // const response = mode === 'signIn' 
      //   ? await signInUser(username, password!)
      //   : await signUpUser(username, password!);
      // setUser(response.user);
      
      // For this mock version, both sign-in and sign-up will create a fresh user.
      // This ensures a new player always starts at zero, addressing the user's issue.
      const freshUser: User = {
          id: Date.now(),
          username,
          avatar: `https://api.multiavatar.com/${username}.svg`,
          total_xp: 0,
          level: 1,
          rank: 'Beginner',
          topics_completed: 0,
          completed_topics_in_rank: [],
          school: '',
          description: `A new adventurer!`,
      };
      setUser(freshUser);

      setView('dashboard');
    } catch (err) {
      setError(t('auth.error.generic'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setError(null);
  };

  const handleSelectMode = (mode: 'assisted' | 'self' | 'bonus', topic: string = '') => {
    setCurrentTopic(topic);
    setView(mode);
  };
  
  const handleBackToDashboard = () => {
    setView('dashboard');
    setCurrentTopic('');
  };

  const handleAssistedLearningComplete = (xpResponse: N8NUpdateXPResponse, completedTopicId: string) => {
    if(!user) return;
    
    const wasAlreadyCompletedInRank = user.completed_topics_in_rank.includes(completedTopicId);
    const updatedCompletedTopics = [...new Set([...user.completed_topics_in_rank, completedTopicId])];
    
    let newRank = xpResponse.rank;
    let newLevel = xpResponse.new_level;
    let newCompletedTopicsInRank = updatedCompletedTopics;
    
    // Check for Rank Up
    if (updatedCompletedTopics.length === TOPICS.length) {
        const currentRankIndex = RANKS.indexOf(user.rank);
        if (currentRankIndex < RANKS.length - 1) {
            newRank = RANKS[currentRankIndex + 1];
            newLevel = 1; // Reset level for new rank
            newCompletedTopicsInRank = []; // Reset progress for new rank
            // Could add a rank-up modal/notification here
        }
    }

    setUser({
        ...user,
        total_xp: xpResponse.new_xp,
        level: newLevel,
        rank: newRank,
        completed_topics_in_rank: newCompletedTopicsInRank,
        // Only increment total completed if it's a new topic for this rank
        topics_completed: wasAlreadyCompletedInRank ? user.topics_completed : user.topics_completed + 1,
    });
    
    setView('dashboard');
  };

  const handleBonusComplete = (xpResponse: N8NBonusResponse) => {
    if(user) {
        setUser({
            ...user,
            total_xp: xpResponse.new_xp,
        });
    }
    setView('dashboard');
  };

  const handleUpdateSettings = (updatedUser: User) => {
      setUser(updatedUser);
      // Here you would also call n8nService.updateUserSettings
  };

  const renderContent = () => {
    if (isLoading && view === 'login') {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-black/40">
                <LoadingSpinner />
                <p className="text-white text-lg font-semibold mt-4">{t('login.loading')}</p>
            </div>
        )
    }

    switch (view) {
      case 'login':
        return <LoginScreen onAuth={handleAuth} error={error} />;
      case 'dashboard':
        return user && <Dashboard user={user} onSelectMode={handleSelectMode} onOpenSettings={() => setSettingsModalOpen(true)} onLogout={handleLogout} />;
      case 'assisted':
        return user && <AssistedLearning topic={currentTopic} user={user} onComplete={handleAssistedLearningComplete} onBack={handleBackToDashboard} />;
      case 'self':
        return user && <SelfLearning topic={currentTopic} user={user} onBack={handleBackToDashboard} />;
       case 'bonus':
        return user && <BonusZone user={user} onComplete={handleBonusComplete} onBack={handleBackToDashboard} />;
      default:
        return <LoginScreen onAuth={handleAuth} error={error} />;
    }
  };

  return (
    <div className="App">
        {renderContent()}
        {isSettingsModalOpen && user && (
            <SettingsModal 
                user={user} 
                onClose={() => setSettingsModalOpen(false)}
                onSave={handleUpdateSettings}
            />
        )}
    </div>
  );
};

export default App;