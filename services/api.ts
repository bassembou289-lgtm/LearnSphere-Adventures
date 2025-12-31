// Fix: Removed missing type reference and cast import.meta to any for env access.
const backendUrl = (import.meta as any).env.VITE_BACKEND_URL;

if (!backendUrl) {
  console.warn("VITE_BACKEND_URL is not set. Please check your .env.local file or deployment environment variables.");
}

/**
 * Generic helper for making HTTP requests to the Python backend.
 */
export const apiRequest = async <T>(endpoint: string, body: object): Promise<T> => {
    if (!backendUrl) {
        throw new Error("Backend URL is not configured. Please set VITE_BACKEND_URL.");
    }

    const url = `${backendUrl}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let errorMessage = `Request failed with status ${response.status}`;
            try {
                const errorBody = await response.json();
                if (errorBody.detail) errorMessage = errorBody.detail;
                else if (errorBody.message) errorMessage = errorBody.message;
            } catch (e) {
                // Fallback if response is not JSON
                const textBody = await response.text();
                if (textBody) errorMessage = textBody;
            }
            throw new Error(errorMessage);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`API Error at ${url}:`, error);
        throw error;
    }
};