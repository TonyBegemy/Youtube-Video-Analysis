from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai
from googleapiclient.discovery import build

# Load environment variables from root .env
load_dotenv(dotenv_path='../.env')

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = "gemini-3-flash-preview"

if not YOUTUBE_API_KEY or not GEMINI_API_KEY:
    print("WARNING: API Keys are missing in .env")

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Data Models
class AnalyzeRequest(BaseModel):
    url: str

# Helpers
def extract_video_id(url: str):
    match = re.search(r"(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})", url)
    return match.group(1) if match else None

def get_video_details(video_id: str):
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    request = youtube.videos().list(
        part="snippet,statistics",
        id=video_id
    )
    response = request.execute()
    
    if "items" not in response or len(response["items"]) == 0:
        raise HTTPException(status_code=404, detail="Video not found")
        
    item = response["items"][0]
    snippet = item["snippet"]
    stats = item["statistics"]
    
    return {
        "title": snippet["title"],
        "description": snippet["description"],
        "thumbnail": snippet["thumbnails"]["high"]["url"],
        "channelTitle": snippet["channelTitle"],
        "publishedAt": snippet["publishedAt"],
        "viewCount": stats.get("viewCount", "0"),
        "likeCount": stats.get("likeCount", "0"),
        "commentCount": stats.get("commentCount", "0"),
    }

def get_comments(video_id: str, max_results: int = 100):
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=max_results,
            order="relevance"
        )
        response = request.execute()
        
        comments = []
        for item in response.get("items", []):
            comment = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "author": comment["authorDisplayName"],
                "text": comment["textDisplay"],
                "likeCount": comment["likeCount"],
                "publishedAt": comment["publishedAt"]
            })
        return comments
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return []

def analyze_with_gemini(comments, video_details):
    model = genai.GenerativeModel(GEMINI_MODEL_NAME)
    
    # Prepare prompt
    comment_texts = [c["text"] for c in comments[:100]] # Limit context
    prompt = f"""
    Analyze the following YouTube video comments and metadata.
    Video Title: {video_details['title']}
    Description: {video_details['description'][:300]}...

    Comments (Top {len(comment_texts)}):
    {json.dumps(comment_texts)}

    Output strictly in this JSON format:
    {{
        "sentiment_summary": "One sentence summary",
        "sentiment_score": 0.5, 
        "common_themes": ["Theme 1", "Theme 2"],
        "happy_points": ["Point 1", "Point 2"],
        "issues_and_problems": ["Issue 1", "Issue 2"],
        "key_takeaways": ["Takeaway 1", "Takeaway 2"]
    }}
    sentiment_score should be between -1 (Negative) and 1 (Positive).
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        # Clean up code blocks if present
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Fallback
        return {
            "sentiment_summary": "Error analyzing comments.",
            "sentiment_score": 0,
            "common_themes": [],
            "happy_points": [],
            "issues_and_problems": [],
            "key_takeaways": ["AI Analysis Failed"]
        }

@app.post("/api/analyze")
async def analyze_video(request: AnalyzeRequest):
    video_id = extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    
    print(f"Analyzing: {video_id}")
    
    # 1. Fetch Data
    details = get_video_details(video_id)
    comments = get_comments(video_id)
    
    # 2. Analyze
    if not comments:
         analysis = {
             "sentiment_summary": "No comments found.",
             "sentiment_score": 0,
             "common_themes": [],
             "happy_points": [],
             "issues_and_problems": [],
             "key_takeaways": ["No audience feedback."]
         }
    else:
        analysis = analyze_with_gemini(comments, details)
    
    return {
        "videoDetails": details,
        "analysis": analysis
    }

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
