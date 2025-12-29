import { AssistedLearningData, BonusData, ChatMessage, User } from '../types';
import { API_ENDPOINTS } from '../constants';
import { apiRequest } from './api';

export const generateAssistedLesson = (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<AssistedLearningData> => {
    return apiRequest<AssistedLearningData>(API_ENDPOINTS.ASSISTED_LESSON, { topic, language, rank, level });
};

export const generateSelfLearningLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<string> => {
    const response = await apiRequest<{ lesson: string }>(API_ENDPOINTS.SELF_LESSON, { topic, language, rank, level });
    return response.lesson;
};

export const continueChat = async (
  lessonContent: string,
  messages: ChatMessage[],
  language: 'en' | 'ar'
): Promise<string> => {
    const response = await apiRequest<{ reply: string }>(API_ENDPOINTS.CHAT, { lessonContent, messages, language });
    return response.reply;
};

export const generateBonusTrivia = (language: 'en' | 'ar'): Promise<BonusData> => {
  return apiRequest<BonusData>(API_ENDPOINTS.TRIVIA, { language });
};

export const testBackendConnection = (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(API_ENDPOINTS.TEST_CONNECTION, { prompt: 'ping' });
};