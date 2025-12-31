import { WEBHOOK_URLS } from '../constants';
import { N8NAuthResponse, N8NUpdateXPResponse, N8NDashboardResponse, N8NBonusResponse, User, N8NUpdateSettingsResponse } from '../types';

// Safely access environment variables with a fallback
const getBackendUrl = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
      return process.env.VITE_API_BASE_URL;
    }
    const meta = import.meta as any;
    if (meta && meta.env && meta.env.VITE_API_BASE_URL) {
      return meta.env.VITE_API_BASE_URL;
    }
  } catch (e) {}
  return "https://learnsphere-backend-d6gb.onrender.com";
};

const backendUrl = getBackendUrl();

/**
 * Generic POST helper for n8n webhooks or legacy endpoints.
 */
const post = async <T,>(endpoint: string, body: object): Promise<T> => {
    if (!backendUrl) {
        const meta = import.meta as any;
        const isProduction = meta && meta.env ? meta.env.PROD : true;
        const errorMessage = isProduction
            ? "API service is not configured. Please set the VITE_API_BASE_URL environment variable."
            : "API service is not configured. Please set VITE_API_BASE_URL in your .env.local file.";
        return Promise.reject(new Error(errorMessage));
    }
    
    // Ensure we don't double up slashes
    const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${path}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Call to ${endpoint} failed with status ${response.status}: ${errorText}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`Error calling endpoint at ${url}:`, error);
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