
import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface LoginScreenProps {
  onAuth: (mode: 'signIn' | 'signUp', username: string, password?: string) => void;
  error: string | null;
}

type AuthMode = 'signIn' | 'signUp';

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuth, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signIn');
  const { t, dir } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onAuth(mode, username.trim(), password.trim());
    }
  };

  const switchMode = () => {
    setUsername('');
    setPassword('');
    setMode(prevMode => (prevMode === 'signIn' ? 'signUp' : 'signIn'));
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-1/2 pb-2 font-bold text-lg border-b-4 transition-colors ${
        active ? 'border-yellow-400 text-white' : 'border-transparent text-white/70 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/20 p-4">
      <div className={`absolute top-4 z-10 ${dir === 'rtl' ? 'left-4' : 'right-4'}`}>
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center animate-fade-in-up">
        <h1 className="text-5xl font-black text-white mb-2">{t('login.title')}</h1>
        <p className="text-xl font-bold text-white mb-6">{t('login.subtitle')}</p>
        
        <div className="flex mb-6">
          <TabButton active={mode === 'signIn'} onClick={() => setMode('signIn')}>{t('auth.signIn')}</TabButton>
          <TabButton active={mode === 'signUp'} onClick={() => setMode('signUp')}>{t('auth.signUp')}</TabButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('auth.usernamePlaceholder')}
            className="w-full px-5 py-3 text-lg text-center text-gray-700 bg-white/90 rounded-full border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            className="w-full px-5 py-3 text-lg text-center text-gray-700 bg-white/90 rounded-full border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-300"
          />
          {error && <p className="text-red-200 font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={!username.trim() || !password.trim()}
            className="w-full mt-4 bg-yellow-400 text-gray-900 font-black py-3 px-6 rounded-full text-xl hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
          >
            {mode === 'signIn' ? t('auth.signInButton') : t('auth.signUpButton')}
          </button>
        </form>
        <p className="mt-6 text-white">
          {mode === 'signIn' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button onClick={switchMode} className="font-bold underline hover:text-yellow-300">
             {mode === 'signIn' ? t('auth.signUpNow') : t('auth.signInNow')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;