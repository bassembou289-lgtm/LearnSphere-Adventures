// Fix: Add Vite client types to resolve import.meta.env errors.
/// <reference types="vite/client" />

import { WEBHOOK_URLS } from '../constants';
import { N8NAuthResponse, N8NUpdateXPResponse, N8NDashboardResponse, N8NBonusResponse, User, N8NUpdateSettingsResponse } from '../types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl || backendUrl.includes('YOUR_N8N_ENDPOINT_URL_HERE')) {
  console.warn("VITE_BACKEND_URL is not set or is using the placeholder value for n8n services. Please check your .env.local file or deployment environment variables.");
}

// NOTE: These functions will fail if you don't have a running n8n instance with these webhooks.
// The app uses mock data in App.tsx for demonstration purposes.
// To use with a real backend, replace mock logic with these service calls.

const post = async <T,>(endpoint: string, body: object): Promise<T> => {
    if (!backendUrl || backendUrl.includes('YOUR_N8N_ENDPOINT_URL_HERE')) {
        const isProduction = import.meta.env.PROD; // Use Vite's standard flag for production
        const errorMessage = isProduction
            ? "Authentication service is not configured. Please set the VITE_BACKEND_URL environment variable in your deployment settings."
            : "Authentication service is not configured. Please set VITE_BACKEND_URL in your .env.local file.";
        return Promise.reject(new Error(errorMessage));
    }
    const url = `${backendUrl}${endpoint}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Webhook call to ${endpoint} failed with status ${response.status}: ${errorText}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`Error calling webhook at ${url}:`, error);
        // In a real app, you'd want more robust error handling, but for this demo, we re-throw.
        throw error;
    }
};


export const signUpUser = (username: string, password: string): Promise<N8NAuthResponse> => {
  return post<N8NAuthResponse>(WEBHOOK_URLS.SIGN_UP, { username, password });
};

export const signInUser = (username: string, password: string): Promise<N8NAuthResponse> => {
  return post<N8NAuthResponse>(WEBHOOK_URLS.SIGN_IN, { username, password });
};

export const updateUserSettings = (username: string, settings: Partial<User & { newPassword?: string }>): Promise<N8NUpdateSettingsResponse> => {
    return post<N8NUpdateSettingsResponse>(WEBHOOK_URLS.UPDATE_SETTINGS, { username, ...settings });
};

export const updateUserXP = (username: string, topic: string, score: number, level: number): Promise<N8NUpdateXPResponse> => {
  return post<N8NUpdateXPResponse>(WEBHOOK_URLS.UPDATE_XP, { user: username, action: 'updateXP', topic, score, level });
};

export const getDashboardData = (username: string): Promise<N8NDashboardResponse> => {
    return post<N8NDashboardResponse>(WEBHOOK_URLS.DASHBOARD, { user: username, action: 'dashboard' });
};

export const sendBonusResults = (username: string, score: number): Promise<N8NBonusResponse> => {
    return post<N8NBonusResponse>(WEBHOOK_URLS.GET_BONUS, { user: username, action: 'getBonus', score });
};