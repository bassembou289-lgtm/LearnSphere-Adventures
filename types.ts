// Fix: Removed circular import of User from the same file.
export interface User {
  id: number;
  username: string;
  avatar: string;
  total_xp: number;
  level: number; // Represents level within the rank (1, 2, or 3)
  rank: 'Beginner' | 'Rare' | 'Epic' | 'Mythic' | 'Legendary';
  topics_completed: number; // Total unique topics ever completed
  completed_topics_in_rank: string[]; // Topics completed for the current rank
  school?: string;
  description?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: string;
}

export interface AssistedLearningData {
  lesson: string;
  quiz: QuizQuestion[];
}

export interface BonusData {
    quiz: QuizQuestion[];
}

export interface ChatMessage {
  author: 'user' | 'bot';
  content: string;
}

export type View = 'login' | 'dashboard' | 'assisted' | 'self' | 'bonus';

export interface N8NAuthResponse {
  user: User;
  message: string;
}

export interface N8NUpdateSettingsResponse {
    user: User;
    message: string;
}

export interface N8NUpdateXPResponse {
  message: string;
  new_xp: number;
  new_level: number;
  rank: 'Beginner' | 'Rare' | 'Epic' | 'Mythic' | 'Legendary';
}

export interface N8NDashboardResponse {
    user: User;
}

export interface N8NBonusResponse {
    message: string;
    new_xp: number;
}

export interface LeaderboardEntry {
    id: number;
    username: string;
    avatar: string;
    total_xp: number;
    school?: string;
}

export interface TeamMember {
    name: string;
    role: string;
    photo: string;
}

export interface AboutResponse {
    school_description: string;
    team: TeamMember[];
}