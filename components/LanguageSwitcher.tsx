import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useTranslation();

    const buttonStyle = (lang: 'en' | 'ar') => `
        px-4 py-2 text-sm font-bold rounded-full transition-colors
        ${language === lang ? 'bg-purple-600 text-white' : 'bg-white/50 text-purple-800 hover:bg-white/80'}
    `;

    return (
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/30 p-1 rounded-full">
            <button onClick={() => setLanguage('en')} className={buttonStyle('en')}>
                {t('language.english')}
            </button>
            <button onClick={() => setLanguage('ar')} className={buttonStyle('ar')}>
                {t('language.arabic')}
            </button>
        </div>
    );
};

export default LanguageSwitcher;
