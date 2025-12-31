/**
 * Generic helper for making HTTP requests to the Python backend.
 * Now uses endpoints that are fully qualified with the base URL.
 */
export const apiRequest = async <T>(endpoint: string, body: object): Promise<T> => {
    // The endpoint passed here is expected to be a full URL from API_ENDPOINTS in constants.ts
    const url = endpoint;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include', // Ensure cross-origin session support
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
            console.error(`Network or CORS Error at ${url}. Please ensure the backend has CORS enabled for this origin.`);
            throw new Error("Unable to connect to the learning server. This might be a CORS issue or the server is waking up.");
        }
        console.error(`API Error at ${url}:`, error);
        throw error;
    }
};
