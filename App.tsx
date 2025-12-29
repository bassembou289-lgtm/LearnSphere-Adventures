
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
import { signInUser, signUpUser, updateUserSettings } from './services/userService';

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
      const response = mode === 'signIn' 
        ? await signInUser(username, password)
        : await signUpUser(username, password);
      
      // Robust check: If response is technically successful (200 OK) but contains no user data,
      // treat it as a "User not found" or logic error from backend.
      if (!response.user) {
         throw new Error('User not found');
      }

      setUser(response.user);
      setView('dashboard');
    } catch (err) {
      console.error(err);
      let errorMessage = t('auth.error.generic');
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        // Handle specific error cases for better UX
        if (mode === 'signIn') {
            // Check for 404 or "not found" indicating the account doesn't exist
            if (errorText.includes('not found') || errorText.includes('404') || errorText.includes('does not exist')) {
                errorMessage = t('auth.error.userNotFound');
            } else if (errorText.includes('password') || errorText.includes('credential') || errorText.includes('401')) {
                errorMessage = t('auth.error.signIn');
            } else {
                // For other errors, use the server message if available, otherwise generic
                errorMessage = err.message || errorMessage;
            }
        } else {
            // For sign up, just show the error (e.g., username taken)
            errorMessage = err.message || errorMessage;
        }
      }
      setError(errorMessage);
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
    
    // Check for Rank Up logic (frontend optimistically updates, but backend is source of truth)
    // We trust the backend response `xpResponse.rank`
    if (updatedCompletedTopics.length === TOPICS.length) {
         const currentRankIndex = RANKS.indexOf(user.rank);
         if (currentRankIndex < RANKS.length - 1 && user.rank !== newRank) {
            newCompletedTopicsInRank = []; // Reset progress for new rank
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

  const handleUpdateSettings = async (updatedUser: User) => {
      try {
        const response = await updateUserSettings(updatedUser.username, updatedUser);
        setUser(response.user);
      } catch (e) {
        console.error("Failed to update settings", e);
      }
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
