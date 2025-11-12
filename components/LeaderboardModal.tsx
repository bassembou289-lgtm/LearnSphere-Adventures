import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LeaderboardEntry } from '../types';

// Mock data for the leaderboard
const topPlayers: LeaderboardEntry[] = [
  { id: 101, username: 'Zelda', avatar: 'https://api.multiavatar.com/Zelda.svg', total_xp: 9850, school: 'Hyrule High' },
  { id: 102, username: 'Link', avatar: 'https://api.multiavatar.com/Link.svg', total_xp: 9500, school: 'Kokiri Forest School' },
  { id: 103, username: 'Ganon', avatar: 'https://api.multiavatar.com/Ganon.svg', total_xp: 9200, school: 'Gerudo Academy' },
];

const medalEmojis = ['🥇', '🥈', '🥉'];

interface LeaderboardModalProps {
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-md w-full transform transition-all animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-800">{t('leaderboard.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
        </div>
        
        <ul className="space-y-4">
          {topPlayers.map((player, index) => (
            <li key={player.id} className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm">
              <span className="text-3xl font-bold w-12 text-center">{medalEmojis[index]}</span>
              <img src={player.avatar} alt={player.username} className="w-12 h-12 rounded-full border-2 border-yellow-400 mx-4" />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{player.username}</p>
                <p className="text-sm text-gray-500">{player.school || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-purple-600">{player.total_xp}</p>
                <p className="text-xs text-gray-500">{t('leaderboard.xp')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardModal;
