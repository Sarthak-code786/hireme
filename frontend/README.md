# HireMe - AI Candidate Assistant (Frontend)

A ChatGPT-inspired recruiter interview web application representing **Sarthak Mehrotra** (DevOps Engineer at TCS). Recruiters can interact with an AI candidate proxy that answers questions based strictly on verified resume data without hallucination.

---

## 🚀 Features

- **ChatGPT Dark Mode Aesthetics**: OpenAI-styled conversational UI with responsive sidebar, message streams, and floating input bar.
- **Strict Ground Truth & Zero Hallucination**: AI responses are bounded by the candidate's verified resume (Groq `openai/gpt-oss-120b`).
- **Recruiter Question Vault & Prompt Cards**: One-click prompt cards for quick evaluation of:
  - DevOps experience & 15+ Jenkins pipelines at TCS
  - AWS, Terraform, Docker, and Kubernetes orchestration
  - Metrics: 95%+ success rate, 75% manual deployment reduction, 55% faster MTTR
- **Candidate Profile & Resume Download**: Built-in verified credential modal and direct official resume PDF download.
- **Flexible Backend API Configuration**: Switch between `http://localhost:8000` for local development and deployed backend endpoints (Render, Railway, Fly.io) with live connection testing.
- **Chat History & Session Management**: Recruiter sessions are saved locally so conversations persist across page refreshes.

---

## 🛠️ Local Development

### 1. Start the FastAPI Backend
Ensure your backend is running:
```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying to Netlify

1. Push your repository to GitHub.
2. In the [Netlify Dashboard](https://app.netlify.com/), select **Add new site** -> **Import an existing project** and pick this repository.
3. Netlify will auto-detect settings from `netlify.toml`:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed FastAPI backend URL (e.g. `https://your-backend.onrender.com`).
5. Click **Deploy**!
   *(The included `netlify.toml` and `_redirects` ensure client-side routing works smoothly out of the box).*

