# LearnSphere Adventures 🚀

This is a friendly learning assistant web game for students, featuring lessons, quizzes, and a fun bonus zone.

## Project Setup & Deployment

This project has been refactored for a secure deployment model where the frontend (this React app) communicates with a backend service (e.g., an n8n workflow) which then calls the AI model's API. This prevents your API key from being exposed in the browser.

### 1. Environment Variables

Before running or building the project, you need to create an environment file.

1.  In the root of the project, create a new file named `.env.local`.
2.  Add the following line to it, replacing the placeholder with your actual backend URL:

    ```
    VITE_BACKEND_URL=https://YOUR_N8N_INSTANCE_URL_HERE
    ```

### 2. Backend Setup: Using a Free Backend with OpenRouter (Recommended for Students)

To keep this project completely free, you can use [OpenRouter](https://openrouter.ai/) to access free AI models. This is the recommended path.

1.  **Get an OpenRouter API Key:**
    *   Sign up for a free account at [OpenRouter.ai](https://openrouter.ai/).
    *   Go to your **Keys** page and create a new key. Copy it.

2.  **Deploy an n8n Instance on Render:**
    *   Follow a guide to deploy n8n on a free service like [Render](https://render.com/).
    *   In your n8n service's Environment Variables, create a secret:
        *   **Key:** `OPENROUTER_API_KEY`
        *   **Value:** Paste your OpenRouter API key.

3.  **Create n8n Workflows (Step-by-Step for `assisted-lesson`):**
    *   For each backend endpoint (e.g., `/assisted-lesson`), create a new workflow in n8n.
    *   **A. Trigger Node:** Use the **Webhook** node. Set the **HTTP Method** to `POST` and the **Path** to `assisted-lesson` (or the corresponding path).
    *   **B. Logic Node:** Add an **HTTP Request** node. Configure it as follows:
        *   **Method:** `POST`
        *   **URL:** `https://openrouter.ai/api/v1/chat/completions`
        *   **Authentication:** `Header Auth`
        *   **Credentials:**
            *   **Name:** `Authorization`
            *   **Value (use expression):** `Bearer {{ $env.OPENROUTER_API_KEY }}`
        *   **Body Content Type:** `JSON`
        *   **Body (use expression):** Paste the code below. This example uses the free `google/gemini-flash-1.5` model and asks for a JSON response, which is critical for the app to work.

        ```json
        {
          "model": "google/gemini-flash-1.5",
          "response_format": { "type": "json_object" },
          "messages": [
            {
              "role": "system",
              "content": "You are an expert educator. Your task is to generate a lesson and a quiz. The final output must be a single, valid JSON object with two keys: a 'lesson' key (containing the lesson text as a string) and a 'quiz' key (containing an array of 3 question objects, where each object has keys 'q', 'options', and 'answer')."
            },
            {
              "role": "user",
              "content": "Create a lesson and quiz about {{ $json.body.topic }} for a {{ $json.body.rank }} student in {{ $json.body.language }}."
            }
          ]
        }
        ```

    *   **C. Parser Node:** The app expects a clean JSON object, but the response from OpenRouter comes inside other properties. Add a **Code** node after the HTTP Request node with this code to extract and parse the JSON:
        ```javascript
        // This ensures a clean JSON object is sent back to the app
        const responseString = $('HTTP Request').item.json.choices[0].message.content;
        return JSON.parse(responseString);
        ```
    *   **D. Response Node:** Ensure the Code node is connected to the final **Respond to Webhook** node. The response will automatically be the output from the Code node.
    *   Activate and save the workflow. Repeat this process for all the required webhook paths listed below, adjusting the `"content"` in the user message for each specific task.

### 3. Required Backend Webhook Paths

Your backend service must have workflows that respond to these `POST` requests:
*   `/webhook/assisted-lesson`
*   `/webhook/self-lesson`
*   `/webhook/chat`
*   `/webhook/bonus-trivia`
*   `/webhook/test-connection` (Can just return `{ "message": "pong" }`)
*   `/webhook/signUp`
*   `/webhook/signIn`
*   `/webhook/updateSettings`
*   `/webhook/updateXP`
*   `/webhook/dashboard`
*   `/webhook/getBonus`

### 4. Frontend Deployment (Vercel)

1.  Push your code to a Git repository (e.g., GitHub, GitLab).
2.  Sign up for a [Vercel](https://vercel.com/) account and connect your Git repository.
3.  When configuring the project on Vercel, add an Environment Variable:
    *   **Name:** `VITE_BACKEND_URL`
    *   **Value:** Your live n8n instance URL.
4.  Deploy! Vercel will automatically build and deploy your React application.

### Running Locally

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

To create a production-ready build of the app:

```bash
npm run build
```

This will create a `dist` directory with the optimized, static assets for your application.
