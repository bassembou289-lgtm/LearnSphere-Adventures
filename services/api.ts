// Consistent with constants.ts environment variable naming
const backendUrl = (import.meta as any).env.VITE_API_BASE_URL || "https://learnsphere-backend-d6gb.onrender.com";

if (!backendUrl) {
  console.warn("API Base URL is not set. Please check your .env.local file or deployment environment variables.");
}

/**
 * Generic helper for making HTTP requests to the Python backend.
 */
export const apiRequest = async <T>(endpoint: string, body: object): Promise<T> => {
    if (!backendUrl) {
        throw new Error("Backend URL is not configured. Please set VITE_API_BASE_URL.");
    }

    const url = endpoint.startsWith('http') ? endpoint : `${backendUrl}${endpoint}`;
    
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
                try {
                    const textBody = await response.text();
                    if (textBody) errorMessage = textBody;
                } catch (textErr) {
                    console.error("Could not parse error response body");
                }
            }
            throw new Error(errorMessage);
        }

        return await response.json() as T;
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.error(`Network or CORS Error at ${url}. Please ensure the backend at ${backendUrl} has CORS enabled for this origin.`);
            throw new Error("Unable to connect to the learning server. This might be a CORS issue or the server is waking up.");
        }
        console.error(`API Error at ${url}:`, error);
        throw error;
    }
};