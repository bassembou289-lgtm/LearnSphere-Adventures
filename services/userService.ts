import { API_ENDPOINTS } from '../constants';
import { N8NAuthResponse, N8NUpdateXPResponse, N8NDashboardResponse, N8NBonusResponse, User, N8NUpdateSettingsResponse, AboutResponse } from '../types';
import { apiRequest } from './api';

export const signUpUser = (username: string, password?: string): Promise<N8NAuthResponse> => {
  return apiRequest<N8NAuthResponse>(API_ENDPOINTS.SIGN_UP, { username, password });
};

export const signInUser = (username: string, password?: string): Promise<N8NAuthResponse> => {
  return apiRequest<N8NAuthResponse>(API_ENDPOINTS.SIGN_IN, { username, password });
};

export const updateUserSettings = (username: string, settings: Partial<User & { newPassword?: string }>): Promise<N8NUpdateSettingsResponse> => {
    return apiRequest<N8NUpdateSettingsResponse>(API_ENDPOINTS.UPDATE_SETTINGS, { username, ...settings });
};

export const updateUserXP = (username: string, topic: string, score: number, level: number): Promise<N8NUpdateXPResponse> => {
  return apiRequest<N8NUpdateXPResponse>(API_ENDPOINTS.UPDATE_XP, { username, topic, score, level });
};

export const getDashboardData = (username: string): Promise<N8NDashboardResponse> => {
    return apiRequest<N8NDashboardResponse>(API_ENDPOINTS.DASHBOARD, { username });
};

export const sendBonusResults = (username: string, score: number): Promise<N8NBonusResponse> => {
    return apiRequest<N8NBonusResponse>(API_ENDPOINTS.BONUS_RESULT, { username, score });
};

export const getAboutInfo = (language: 'en' | 'ar'): Promise<AboutResponse> => {
    return apiRequest<AboutResponse>(API_ENDPOINTS.ABOUT, { language });
};