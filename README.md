# YouTube Video Analysis App

A high-performance, containerized microservices web application that analyzes YouTube videos using **Google Gemini Flash AI**. It provides premium insights, sentiment analysis, and common themes from comments.

## 🚀 Features
- **Premium UI**: Modern, responsive interface with Glassmorphism design.
- **Microservices Architecture**: Separate Frontend (Next.js 15) and Backend (Express).
- **Dockerized**: Easy deployment with Docker Compose.
- **AI-Powered**: Uses Gemini 2.0 Flash Preview for lightning-fast analysis.
- **Deep Insights**:
    - Video Statistics (Views, Likes, Comments).
    - Sentiment Analysis (Positive/Negative/Neutral).
    - Key Themes & Takeaways.
    - "Happy Points" & Valid Criticism.
- **Exportable Reports**: Download comprehensive analysis as PDF.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, TypeScript, Vanilla CSS (Modules).
- **Backend**: Node.js, Express, TypeScript.
- **AI**: Google Gemini (via `@google/generative-ai` SDK).
- **Data**: YouTube Data API v3.
- **Ops**: Docker, Docker Compose.

---

## 🔑 Getting Credentials
You need two API keys to run this application.

### 1. YouTube Data API v3 Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "YouTube Analysis").
3. In the search bar, type **"YouTube Data API v3"** and select it.
4. Click **Enable**.
5. Go to **Credentials** -> **Create Credentials** -> **API Key**.
6. Copy the key.

### 2. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** in the sidebar.
4. Click **"Create API key"**.
5. Copy the key.

---

## 🏃‍♂️ How to Run

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Youtube-Video-Analysis
   ```

2. **Set up Environment Variables**:
   Copy the example file and add your keys.
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your keys:
   ```env
   YOUTUBE_API_KEY=your_youtube_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

3. **Run with Docker Compose** (Recommended):
   ```bash
   docker-compose up --build
   ```
   - Frontend will be at: `http://localhost:3000`
   - Backend will be at: `http://localhost:5000`

---

## 🏗️ Project Structure
```
/
├── client/            # Next.js Frontend
├── server/            # Express Backend
├── .env.example       # Environment variables template
├── docker-compose.yml # Orchestration
└── README.md          # This file
```
