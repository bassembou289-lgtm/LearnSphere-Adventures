// Fix: Imported the User type to correctly type the RANKS constant.
import { User } from './types';

// These are now relative paths that will be appended to VITE_BACKEND_URL
export const WEBHOOK_URLS = {
  SIGN_UP: '/webhook/signUp',
  SIGN_IN: '/webhook/signIn',
  UPDATE_SETTINGS: '/webhook/updateSettings',
  UPDATE_XP: '/webhook/updateXP',
  DASHBOARD: '/webhook/dashboard',
  GET_BONUS: '/webhook/getBonus',
};

export const TOPICS = [
  { id: 'Math', labelKey: 'topic.math', emoji: '🧮' },
  { id: 'Science', labelKey: 'topic.science', emoji: '🔬' },
  { id: 'History', labelKey: 'topic.history', emoji: '🏛️' },
  { id: 'Geography', labelKey: 'topic.geography', emoji: '🌍' },
  { id: 'Art', labelKey: 'topic.art', emoji: '🎨' },
  { id: 'English', labelKey: 'topic.english', emoji: '📚' },
  { id: 'Computer', labelKey: 'topic.computer', emoji: '💻' },
  { id: 'Arabic', labelKey: 'topic.arabic', emoji: '📝' },
  { id: 'Biology', labelKey: 'topic.biology', emoji: '🧬' },
  { id: 'ProblemSolving', labelKey: 'topic.problem_solving', emoji: '💡' },
];

export const STAGE_COLORS: { [key: string]: string } = {
    Beginner: 'bg-green-500',
    Rare: 'bg-blue-500',
    Epic: 'bg-purple-500',
    Mythic: 'bg-yellow-500',
    Legendary: 'bg-red-500',
};

export const RANKS: User['rank'][] = ['Beginner', 'Rare', 'Epic', 'Mythic', 'Legendary'];

export const XP_PER_LEVEL = 100;
export const MAX_LEVEL_IN_RANK = 3;