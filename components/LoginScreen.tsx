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
    const form = document.getElementById('auth-form');
    form?.classList.remove('animate-fade-in-up');
    void form?.offsetWidth; // Trigger reflow
    form?.classList.add('animate-fade-in-up');
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-1/2 py-3 font-extrabold text-lg transition-all duration-300 rounded-2xl ${
        active 
          ? 'bg-yellow-400 text-gray-900 shadow-md transform scale-105 z-10' 
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/10 relative overflow-hidden p-4">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className={`absolute top-6 z-20 ${dir === 'rtl' ? 'left-6' : 'right-6'}`}>
        <LanguageSwitcher />
      </div>

      <div id="auth-form" className="w-full max-w-md bg-white/15 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-2xl p-8 sm:p-10 text-center animate-fade-in-up">
        <div className="mb-8">
            <div className="w-20 h-20 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg transform -rotate-6 mb-4">
                <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                {t('login.title')}
                <span className="block text-yellow-400 text-2xl mt-1">{t('login.subtitle')}</span>
            </h1>
        </div>
        
        <div className="flex bg-black/20 p-1.5 rounded-[1.5rem] mb-8 relative">
          <TabButton active={mode === 'signIn'} onClick={() => setMode('signIn')}>{t('auth.signIn')}</TabButton>
          <TabButton active={mode === 'signUp'} onClick={() => setMode('signUp')}>{t('auth.signUp')}</TabButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                className="w-full px-6 py-4 text-lg text-center text-gray-800 bg-white/95 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all placeholder:text-gray-400"
                required
              />
          </div>
          <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full px-6 py-4 text-lg text-center text-gray-800 bg-white/95 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all placeholder:text-gray-400"
                required
              />
          </div>

          {error && (
            <div className="bg-red-500/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-lg border border-red-400/50 animate-shake">
                <p className="font-bold text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!username.trim() || !password.trim()}
            className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black py-4 px-6 rounded-2xl text-xl shadow-xl hover:shadow-yellow-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            {mode === 'signIn' ? t('auth.signInButton') : t('auth.signUpButton')}
          </button>
        </form>

        <p className="mt-8 text-white/90 font-medium">
          {mode === 'signIn' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button onClick={switchMode} className="text-yellow-400 font-extrabold underline hover:text-yellow-300 transition-colors">
             {mode === 'signIn' ? t('auth.signUpNow') : t('auth.signInNow')}
          </button>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default LoginScreen;