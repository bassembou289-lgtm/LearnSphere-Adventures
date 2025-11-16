# LearnSphere Adventures 🚀

A friendly learning assistant web game for students, featuring lessons, quizzes, and a fun bonus zone.

## Project Overview

This project uses a secure deployment model where the frontend (this React app) communicates with a backend service (e.g., n8n). The backend is responsible for calling the AI model's API, which prevents your secret API keys from being exposed in the browser.

---

## 1. Local Development Setup

Follow these steps to run the application on your local computer.

### Step 1: Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```

### Step 2: Create Local Environment File (`.env.local`)

This file is **only for local development** and tells your app where to find the backend. **Do not commit this file to GitHub.**

1.  In the root of the project, create a new file named `.env.local`.
2.  Add the following line, replacing the placeholder with your n8n URL (which you'll set up in the next section). If you don't have it yet, you can use a placeholder.

    ```
    VITE_BACKEND_URL=https://YOUR_N8N_INSTANCE_URL_HERE
    ```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 2. Backend Setup: n8n with OpenRouter (Free)

To keep this project completely free, you can use [OpenRouter](https://openrouter.ai/) to access free AI models.

1.  **Get an OpenRouter API Key:**
    *   Sign up for a free account at [OpenRouter.ai](https://openrouter.ai/).
    *   Go to your **Keys** page, create a new key, and copy it.

2.  **Deploy an n8n Instance on Render:**
    *   Follow a guide to deploy n8n on a free service like [Render](https://render.com/).
    *   In your n8n service's **Environment Variables** on Render, create a secret:
        *   **Key:** `OPENROUTER_API_KEY`
        *   **Value:** Paste your OpenRouter API key.

3.  **Create n8n Workflows (Example for `assisted-lesson`):**
    *   **A. Trigger Node:** Use the **Webhook** node. Set **HTTP Method** to `POST` and **Path** to `assisted-lesson`.
    *   **B. Logic Node:** Add an **HTTP Request** node.
        *   **Method:** `POST`
        *   **URL:** `https://openrouter.ai/api/v1/chat/completions`
        *   **Authentication:** `Header Auth`
        *   **Credentials:**
            *   **Name:** `Authorization`
            *   **Value (use expression):** `Bearer {{ $env.OPENROUTER_API_KEY }}`
        *   **Body Content Type:** `JSON`
        *   **Body (use expression):**
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
    *   **C. Parser Node:** Add a **Code** node after the HTTP Request node to extract the clean JSON.
        ```javascript
        const responseString = $('HTTP Request').item.json.choices[0].message.content;
        return JSON.parse(responseString);
        ```
    *   **D. Response Node:** Connect the Code node to the final **Respond to Webhook** node.
    *   Activate and save the workflow. Repeat for all required webhook paths, adjusting the user message for each task.

---

## 3. Frontend Deployment (Vercel)

1.  Push your code to a Git repository (GitHub, GitLab, etc.).
2.  Sign up for [Vercel](https://vercel.com/) and connect your Git repository.
3.  When configuring the project, go to the **Environment Variables** section and add:
    *   **Name:** `VITE_BACKEND_URL`
    *   **Value:** Your live n8n instance URL from Render.
4.  Deploy!

---

## 4. Required Backend Webhook Paths

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

---

## Building for Production

To create a production-ready build of the app, run:
```bash
npm run build
```
This creates a `dist` directory with optimized, static assets. Vercel runs this command for you automatically when you deploy.
