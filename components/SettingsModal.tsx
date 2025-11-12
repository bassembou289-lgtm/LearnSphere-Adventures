import React, { useState } from 'react';
import { User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { testBackendConnection } from '../services/geminiService';


interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            
            <div className="flex flex-col items-center space-y-2 pt-2">
                <label className="block text-sm font-bold text-gray-600 mb-1">{t('settings.avatar')}</label>
                <img src={avatar} alt="Current Avatar" className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-lg" />
                <button
                    type="button"
                    onClick={handleRandomizeAvatar}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
                >
                    <span className="text-xl">🎲</span> {t('settings.randomizeAvatar')}
                </button>
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

            <div className="pt-4">
                <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Test Backend Connection</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500">Verify the app can communicate with your backend service (n8n).</p>
                  <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition"
                  >
                      {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>
                  {testResult && (
                    <div className={`text-sm p-2 rounded-md ${testResult.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {testResult.message}
                    </div>
                  )}
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}

            <div className="flex justify-end space-x-4 pt-4">
                 <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                >
                    {t('settings.close')}
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                >
                    {t('settings.save')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;