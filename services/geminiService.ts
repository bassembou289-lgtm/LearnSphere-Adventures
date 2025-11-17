// Fix: Add Vite client types to resolve import.meta.env errors.
/// <reference types="vite/client" />

import { AssistedLearningData, BonusData, ChatMessage, User } from '../types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl || backendUrl.includes('YOUR_N8N_ENDPOINT_URL_HERE')) {
  console.warn("VITE_BACKEND_URL is not set or is using the placeholder value. Please check your .env.local file or deployment environment variables.");
}

// Generic POST helper for backend calls
const postToBackend = async <T,>(endpoint: string, body: object): Promise<T> => {
    // Return a mocked error if the URL is not configured
    if (!backendUrl || backendUrl.includes('YOUR_N8N_ENDPOINT_URL_HERE')) {
        const isProduction = import.meta.env.PROD; // Use Vite's standard flag for production
        const errorMessage = isProduction
            ? "Backend URL is not configured. Please set the VITE_BACKEND_URL environment variable in your deployment settings (e.g., on Vercel)."
            : "Backend URL is not configured. Please set VITE_BACKEND_URL in your .env.local file.";
        return Promise.reject(new Error(errorMessage));
    }

    const url = `${backendUrl}${endpoint}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Backend request to ${endpoint} failed with status ${response.status}: ${errorBody}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`Error calling backend at ${url}:`, error);
        throw error;
    }
};

export const generateAssistedLesson = (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<AssistedLearningData> => {
    return postToBackend<AssistedLearningData>('/assisted-lesson', { topic, language, rank, level });
};

export const generateSelfLearningLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<string> => {
    const response = await postToBackend<{ lesson: string }>('/self-lesson', { topic, language, rank, level });
    return response.lesson;
};

export const continueChat = async (
  lessonContent: string,
  messages: ChatMessage[],
  language: 'en' | 'ar'
): Promise<string> => {
    const response = await postToBackend<{ reply: string }>('/chat', { lessonContent, messages, language });
    return response.reply;
};

export const generateBonusTrivia = (language: 'en' | 'ar'): Promise<BonusData> => {
  return postToBackend<BonusData>('/bonus-trivia', { language });
};

// New function for the test button
export const testBackendConnection = (): Promise<{ message: string }> => {
    return postToBackend<{ message: string }>('/test-connection', { prompt: 'ping' });
}