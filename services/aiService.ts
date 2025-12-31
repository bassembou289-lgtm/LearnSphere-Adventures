import { AssistedLearningData, BonusData, ChatMessage, User } from '../types';
import { API_ENDPOINTS } from '../constants';
import { apiRequest } from './api';

/**
 * Generates an assisted lesson with a quiz by calling the backend API.
 */
export const generateAssistedLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<AssistedLearningData> => {
    return apiRequest<AssistedLearningData>(API_ENDPOINTS.ASSISTED_LESSON, {
        topic,
        language,
        rank,
        level
    });
};

/**
 * Generates a deep-dive self-paced study lesson by calling the backend API.
 */
export const generateSelfLearningLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<string> => {
    const response = await apiRequest<{ lesson: string }>(API_ENDPOINTS.SELF_LESSON, {
        topic,
        language,
        rank,
        level
    });
    return response.lesson;
};

/**
 * Continues a chat conversation with the AI tutor by calling the backend API.
 */
export const continueChat = async (
  lessonContent: string,
  messages: ChatMessage[],
  language: 'en' | 'ar'
): Promise<string> => {
    const response = await apiRequest<{ reply: string }>(API_ENDPOINTS.CHAT, {
        lessonContent,
        messages,
        language
    });
    return response.reply;
};

/**
 * Generates bonus trivia questions by calling the backend API.
 */
export const generateBonusTrivia = async (language: 'en' | 'ar'): Promise<BonusData> => {
    return apiRequest<BonusData>(API_ENDPOINTS.TRIVIA, {
        language
    });
};

/**
 * Connection test to ensure the Python backend services are healthy.
 */
export const testBackendConnection = (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(API_ENDPOINTS.TEST_CONNECTION, { prompt: 'ping' });
};