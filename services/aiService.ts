
// Fix: Integrated Google Gemini API for high-quality client-side content generation.
import { GoogleGenAI, Type } from "@google/genai";
import { AssistedLearningData, BonusData, ChatMessage, User } from '../types';
import { API_ENDPOINTS } from '../constants';
import { apiRequest } from './api';

// Initialize the Google GenAI client using the required environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an assisted lesson with a quiz using Gemini 3 series models.
 */
export const generateAssistedLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<AssistedLearningData> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class educational tutor. Generate a lesson and a 5-question multiple-choice quiz about "${topic}" for a student at the "${rank}" rank and level ${level}. 
        Language: ${language === 'en' ? 'English' : 'Arabic'}.
        Provide the response in valid JSON format.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    lesson: { type: Type.STRING, description: "Detailed educational lesson in Markdown." },
                    quiz: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                q: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                answer: { type: Type.STRING, description: "The correct option string." }
                            },
                            required: ["q", "options", "answer"]
                        }
                    }
                },
                required: ["lesson", "quiz"]
            }
        }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("AI tutor failed to generate content.");
    return JSON.parse(jsonStr.trim()) as AssistedLearningData;
};

/**
 * Generates a deep-dive self-paced study lesson using Gemini 3 Pro for complex text tasks.
 */
export const generateSelfLearningLesson = async (
    topic: string, 
    language: 'en' | 'ar',
    rank: User['rank'],
    level: number
): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a comprehensive, deep-dive educational lesson about "${topic}" for a student at the "${rank}" rank and level ${level}. 
        Use professional Markdown formatting with headers, lists, and bold text. 
        Language: ${language === 'en' ? 'English' : 'Arabic'}.`,
    });
    return response.text || "";
};

/**
 * Continues a chat conversation with the AI tutor using Gemini's stateful Chat API.
 */
export const continueChat = async (
  lessonContent: string,
  messages: ChatMessage[],
  language: 'en' | 'ar'
): Promise<string> => {
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: `You are a helpful and encouraging AI tutor. The current lesson context is: ${lessonContent}. Respond in ${language === 'en' ? 'English' : 'Arabic'}.`,
        },
    });

    // Extract the latest user query for the chat completion
    const userMessages = messages.filter(m => m.author === 'user');
    const lastMessage = userMessages[userMessages.length - 1]?.content || "Can you explain more?";
    
    const response = await chat.sendMessage({ message: lastMessage });
    return response.text || "";
};

/**
 * Generates bonus trivia questions using Gemini AI and structured JSON output.
 */
export const generateBonusTrivia = async (language: 'en' | 'ar'): Promise<BonusData> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a fun 10-question general knowledge trivia quiz for children in ${language === 'en' ? 'English' : 'Arabic'}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    quiz: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                q: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                answer: { type: Type.STRING }
                            },
                            required: ["q", "options", "answer"]
                        }
                    }
                },
                required: ["quiz"]
            }
        }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Failed to fetch bonus trivia.");
    return JSON.parse(jsonStr.trim()) as BonusData;
};

/**
 * Connection test to ensure the Python backend services are healthy.
 */
export const testBackendConnection = (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(API_ENDPOINTS.TEST_CONNECTION, { prompt: 'ping' });
};
