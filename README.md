# LearnSphere Adventures 🚀

This is a friendly learning assistant web game for students, featuring lessons, quizzes, and a fun bonus zone.

## Project Setup & Deployment

This project has been refactored for a secure deployment model where the frontend (this React app) communicates with a backend service (e.g., an n8n workflow) which then calls the Gemini API. This prevents the API key from being exposed in the browser.

### 1. Environment Variables

Before running or building the project, you need to create an environment file.

1.  In the root of the project, create a new file named `.env.local`.
2.  Add the following line to it, replacing the placeholder with your actual backend URL:

    ```
    VITE_BACKEND_URL=https://YOUR_N8N_ENDPOINT_URL_HERE
    ```

### 2. Backend Setup (n8n on Render)

You need a backend service to proxy requests to the Gemini API.

1.  **Set up an n8n instance.** A platform like [Render](https://render.com/) is a good choice for hosting it.
2.  **Create workflows** in n8n that correspond to the API calls made by the frontend:
    *   `POST /assisted-lesson`
    *   `POST /self-lesson`
    *   `POST /chat`
    *   `POST /bonus-trivia`
    *   `POST /test-connection`
3.  Each workflow should receive the request, securely call the appropriate Gemini API with your stored API key, and return the response in the format the frontend expects.
4.  Once your n8n instance is live, copy its public URL and use it for `VITE_BACKEND_URL` in your `.env.local` file.

### 3. Frontend Deployment (Vercel)

1.  Push your code to a Git repository (e.g., GitHub, GitLab).
2.  Sign up for a [Vercel](https://vercel.com/) account and connect your Git repository.
3.  When configuring the project on Vercel, add an Environment Variable:
    *   **Name:** `VITE_BACKEND_URL`
    *   **Value:** Your live n8n workflow URL.
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
