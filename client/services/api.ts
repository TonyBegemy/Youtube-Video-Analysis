const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface VideoAnalysis {
    videoDetails: {
        title: string;
        description: string;
        thumbnail: string;
        channelTitle: string;
        publishedAt: string;
        viewCount: string;
        likeCount: string;
        commentCount: string;
    };
    analysis: {
        sentiment_summary: string;
        sentiment_score: number;
        common_themes: string[];
        happy_points: string[];
        issues_and_problems: string[];
        key_takeaways: string[];
    };
}

export const analyzeVideo = async (url: string, language: string = 'en'): Promise<VideoAnalysis> => {
    const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, language }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video');
    }

    return response.json();
};

export const fetchHistory = async (): Promise<any[]> => {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) return [];
    return response.json();
};

export const translateAnalysis = async (analysis: any, targetLang: string): Promise<any> => {
    const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis_json: analysis, target_language: targetLang }),
    });

    if (!response.ok) {
        throw new Error('Translation failed');
    }

    return response.json();
};
