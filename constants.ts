// Fix: Imported the User type to correctly type the RANKS constant.
import { User } from './types';

const API_BASE_URL = "https://learnsphere-backend-d6gb.onrender.com";

// REST API Endpoints for Python Backend
export const API_ENDPOINTS = {
  // Auth & User
  SIGN_UP: `${API_BASE_URL}/api/auth/signup`,
  SIGN_IN: `${API_BASE_URL}/api/auth/signin`,
  UPDATE_SETTINGS: `${API_BASE_URL}/api/user/settings`,
  UPDATE_XP: `${API_BASE_URL}/api/user/xp`,
  DASHBOARD: `${API_BASE_URL}/api/user/dashboard`,
  BONUS_RESULT: `${API_BASE_URL}/api/bonus`,
  
  // Content Generation (AI)
  ASSISTED_LESSON: `${API_BASE_URL}/api/lesson/assisted`,
  SELF_LESSON: `${API_BASE_URL}/api/lesson/self`,
  CHAT: `${API_BASE_URL}/api/chat`,
  TRIVIA: `${API_BASE_URL}/api/trivia`,
  
  // System
  TEST_CONNECTION: `${API_BASE_URL}/api/test`,
  ABOUT: `${API_BASE_URL}/api/about`,
};

// Fix: Added WEBHOOK_URLS to resolve import errors in n8nService.ts
export const WEBHOOK_URLS = {
  SIGN_UP: '/webhook/signup',
  SIGN_IN: '/webhook/signin',
  UPDATE_SETTINGS: '/webhook/settings',
  UPDATE_XP: '/webhook/xp',
  DASHBOARD: '/webhook/dashboard',
  GET_BONUS: '/webhook/bonus',
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