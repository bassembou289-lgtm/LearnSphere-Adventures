import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { getAboutInfo } from '../services/userService';
import { AboutResponse, TeamMember } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { t, language } = useTranslation();
  const [data, setData] = useState<AboutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAboutInfo(language);
        setData(response);
      } catch (err) {
        console.error("Failed to fetch about info:", err);
        // Fallback mock data
        setData({
            school_description: t('about.mockDescription'),
            team: [
                { name: "Mr. Teacher", role: "Super Teacher 🎓", photo: "https://api.multiavatar.com/Teacher.svg" },
                { name: "Alex", role: "Code Wizard 💻", photo: "https://api.multiavatar.com/Alex.svg" },
                { name: "Sarah", role: "Design Artist 🎨", photo: "https://api.multiavatar.com/Sarah.svg" },
                { name: "Omar", role: "Bug Hunter 🐞", photo: "https://api.multiavatar.com/Omar.svg" },
                { name: "Lina", role: "Storyteller 📚", photo: "https://api.multiavatar.com/Lina.svg" }
            ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [language, t]);

  const TeamCard: React.FC<{ member: TeamMember; isTeacher?: boolean }> = ({ member, isTeacher }) => (
    <div className={`flex flex-col items-center p-4 rounded-xl shadow-sm transition-transform hover:scale-105 ${isTeacher ? 'bg-orange-100 border-2 border-orange-200 col-span-2 sm:col-span-1' : 'bg-white border border-gray-100'}`}>
        <img 
            src={member.photo} 
            alt={member.name} 
            className={`rounded-full shadow-md mb-3 object-cover bg-white ${isTeacher ? 'w-24 h-24 border-4 border-orange-300' : 'w-20 h-20 border-2 border-purple-200'}`} 
        />
        <h4 className="font-bold text-gray-800 text-center">{member.name}</h4>
        <p className={`text-xs font-semibold uppercase tracking-wide text-center ${isTeacher ? 'text-orange-600' : 'text-purple-600'}`}>{member.role}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 m-4 max-w-2xl w-full transform transition-all animate-fade-in-up overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
                ℹ️ {t('about.title')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {isLoading ? (
            <LoadingSpinner />
        ) : (
            <div className="space-y-8">
                {/* School Description Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
                    <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                        🏫 {t('about.school')}
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">
                        {data?.school_description}
                    </p>
                </div>

                {/* Team Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🌟 {t('about.team')}
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
                        {/* Render Teacher First (assuming first in list or explicit check) */}
                        {data?.team.map((member, index) => (
                            <TeamCard key={index} member={member} isTeacher={index === 0} />
                        ))}
                    </div>
                </div>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} LearnSphere Adventures. Made with ❤️ by Students & Teachers.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AboutModal;