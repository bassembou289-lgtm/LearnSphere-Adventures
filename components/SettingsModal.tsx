import React, { useState } from 'react';
import { User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { testBackendConnection } from '../services/aiService';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  'https://api.multiavatar.com/Star.svg',
  'https://api.multiavatar.com/Rocket.svg',
  'https://api.multiavatar.com/Robot.svg',
  'https://api.multiavatar.com/Wizard.svg',
  'https://api.multiavatar.com/Cat.svg',
  'https://api.multiavatar.com/Dragon.svg',
];

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onSave }) => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(user.avatar);
  const [username, setUsername] = useState(user.username);
  const [school, setSchool] = useState(user.school || '');
  const [description, setDescription] = useState(user.description || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleRandomizeAvatar = () => {
    const randomString = Math.random().toString(36).substring(7);
    setAvatar(`https://api.multiavatar.com/${randomString}.svg`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError(t('settings.passwordMismatch'));
      return;
    }

    const updatedUser: User = {
      ...user,
      avatar,
      username,
      school,
      description,
    };
    
    onSave(updatedUser);
    setSuccessMessage(t('settings.updateSuccess'));
    
    setTimeout(() => {
        onClose();
    }, 1500)
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
        const response = await testBackendConnection();
        setTestResult({ type: 'success', message: `Success! Backend says: "${response.message}"` });
    } catch (error) {
        setTestResult({ type: 'error', message: `Failed to connect: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
        setIsTesting(false);
    }
  };

  const InputField: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string; placeholder?: string }> = 
  ({ label, value, onChange, type = "text", placeholder }) => (
      <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">{label}</label>
          <input 
              type={type} 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow"
          />
      </div>
  );

  return (
    <div className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 m-4 max-w-md w-full transform transition-all animate-fade-in-up overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-800">{t('settings.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2">{t('settings.editProfile')}</h3>
            
            <div className="flex flex-col items-center space-y-4 pt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-600 w-full text-left">{t('settings.avatar')}</label>
                
                <img src={avatar} alt="Current Avatar" className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-lg bg-white" />
                
                <div className="w-full">
                  <p className="text-xs text-gray-500 mb-2 font-bold">{t('settings.choosePreset')}</p>
                  <div className="flex justify-center gap-2 mb-3">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${avatar === preset ? 'border-purple-500 ring-2 ring-purple-200' : 'border-transparent'}`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                   <button
                      type="button"
                      onClick={handleRandomizeAvatar}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 text-sm"
                  >
                      <span className="text-lg">🎲</span> {t('settings.randomizeAvatar')}
                  </button>
                </div>
                
                <div className="w-full">
                   <input 
                      type="text" 
                      value={avatar} 
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder={t('settings.avatarUrlPlaceholder')}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-500"
                   />
                   <p className="text-[10px] text-gray-400 mt-1 pl-1">{t('settings.avatarUrlHint')}</p>
                </div>
            </div>

            <InputField label={t('settings.username')} value={username} onChange={setUsername} />
            <InputField label={t('settings.school')} value={school} onChange={setSchool} placeholder="e.g., School of Magic" />
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">{t('settings.description')}</label>
              <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Avid learner and future explorer!"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2 pt-4">{t('settings.changePassword')}</h3>
            <InputField label={t('settings.newPassword')} value={newPassword} onChange={setNewPassword} type="password" />
            <InputField label={t('settings.confirmPassword')} value={confirmPassword} onChange={setConfirmPassword} type="password" />

            <div className="pt-4 border-t mt-4">
                <button
                    type="button"
                    onClick={() => setIsTesting(!isTesting)}
                    className="text-xs text-gray-400 underline hover:text-gray-600 mb-2"
                >
                  {isTesting ? 'Hide Connection Test' : 'Show Connection Test'}
                </button>
                
                {isTesting && (
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Verify backend connection:</p>
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 text-sm"
                    >
                        Ping Backend
                    </button>
                    {testResult && (
                      <div className={`text-xs p-2 rounded-md ${testResult.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {testResult.message}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {error && <p className="text-sm text-red-500 font-bold bg-red-50 p-2 rounded">{error}</p>}
            {successMessage && <p className="text-sm text-green-500 font-bold bg-green-50 p-2 rounded">{successMessage}</p>}

            <div className="flex justify-end space-x-4 pt-2">
                 <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                >
                    {t('settings.close')}
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition transform hover:scale-105"
                >
                    {t('settings.save')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

// Fix: Added missing default export to resolve import error in App.tsx
export default SettingsModal;