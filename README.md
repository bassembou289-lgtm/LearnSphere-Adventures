# LearnSphere Adventures 🚀

A friendly learning assistant web game for students, featuring lessons, quizzes, and a fun bonus zone.

## Project Overview

This project features a React frontend that connects to a **Production backend hosted on Render.com**. The backend handles authentication, user progress, and AI content generation (using Gemini).

**Backend URL:** `https://learnsphere-backend-d6gb.onrender.com`

---

## 1. Local Development Setup

Follow these steps to run the application on your local computer.

### Step 1: Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```

### Step 2: Create Local Environment File (`.env.local`)

1.  In the root of the project, create a new file named `.env.local`.
2.  Add the following line, replacing the placeholder with your production backend URL (or your local one if testing locally).

    ```
    VITE_API_BASE_URL=https://learnsphere-backend-d6gb.onrender.com
    ```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 2. Backend Requirements (Python/FastAPI)

To run this app, you need a running Python backend (previously on legacy hosting, now migrated to Render) exposing the REST endpoints listed below. 

### CORS Configuration (Crucial)
To allow the frontend to communicate with your backend, you **must** enable CORS (Cross-Origin Resource Sharing). In your FastAPI backend, include the following:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://your-vercel-app-name.vercel.app", # Your deployed frontend URL
    "http://localhost:5173",                 # Local development
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Endpoints
All endpoints expect `Content-Type: application/json`.

**Auth**
*   `POST /api/auth/signup` - Body: `{ username, password }`
*   `POST /api/auth/signin` - Body: `{ username, password }`

**User Data**
*   `POST /api/user/settings` - Body: `{ username, ...userFields }`
*   `POST /api/user/xp` - Body: `{ username, topic, score, level }`
*   `POST /api/user/dashboard` - Body: `{ username }`
*   `POST /api/bonus` - Body: `{ username, score }`

**AI Content Generation**
*   `POST /api/lesson/assisted` - Body: `{ topic, language, rank, level }`
*   `POST /api/lesson/self` - Body: `{ topic, language, rank, level }`
*   `POST /api/chat` - Body: `{ lessonContent, messages, language }`
*   `POST /api/trivia` - Body: `{ language }`
*   `POST /api/test` - Body: `{ prompt }`

---

## 3. Frontend Deployment (Vercel)

1.  Push your code to a Git repository.
2.  Deploy to Vercel.
3.  Set the `VITE_API_BASE_URL` environment variable in Vercel to your deployed Render backend URL: `https://learnsphere-backend-d6gb.onrender.com`.

---

## Building for Production

To create a production-ready build of the app, run:
```bash
npm run build
```