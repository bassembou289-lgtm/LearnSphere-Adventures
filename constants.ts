// Fix: Imported the User type to correctly type the RANKS constant.
import { User } from './types';

//const API_BASE_URL = "https://learnsphere-backend-d6gb.onrender.com";

// REST API Endpoints for Python Backend
export const API_ENDPOINTS = {
  // Auth & User
  SIGN_UP: "/api/auth/signup",
  SIGN_IN: "/api/auth/signin",
  UPDATE_SETTINGS: "/api/user/settings",
  UPDATE_XP: "/api/user/xp",
  DASHBOARD: "/api/user/dashboard",
  BONUS_RESULT: "/api/bonus",
  
  // Content Generation (AI)
  ASSISTED_LESSON: "/api/lesson/assisted",
  SELF_LESSON: "/api/lesson/self",
  CHAT: "/api/chat",
  TRIVIA: "/api/trivia",
  
  // System
  TEST_CONNECTION: "/api/test",
  ABOUT: "/api/about",
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
