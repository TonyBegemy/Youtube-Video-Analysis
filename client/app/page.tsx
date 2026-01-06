"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import HistorySection from '@/components/HistorySection';
import { analyzeVideo, VideoAnalysis, translateAnalysis } from '@/services/api';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [isArabic, setIsArabic] = useState(false);

  // Helper to determine language direction based on content
  const detectLanguage = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  const handleAnalyze = async (url: string, lang: string) => {
    setLoading(true);
    setAnalysisData(null);
    setIsArabic(lang === 'ar');

    try {
      const data = await analyzeVideo(url, lang);
      setAnalysisData(data);
      setRefreshHistory(prev => prev + 1); // Trigger history refresh

      toast.success(lang === 'ar' ? 'تم التحليل بنجاح!' : 'Analysis complete!');

      setTimeout(() => {
        const results = document.getElementById('results');
        results?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (data: any) => {
    // Check if the loaded analysis is arabic
    const summary = data.analysis.sentiment_summary || "";
    setIsArabic(detectLanguage(summary));
    setAnalysisData(data);
    setTimeout(() => {
      const results = document.getElementById('results');
      results?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTranslate = async (targetLang: string) => {
    if (!analysisData) return;

    const toastId = toast.loading('Translating...');
    try {
      const translatedAnalysis = await translateAnalysis(analysisData.analysis, targetLang);

      setAnalysisData({
        ...analysisData,
        analysis: translatedAnalysis
      });

      setIsArabic(targetLang === 'ar');
      toast.success('Translation complete!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Translation failed', { id: toastId });
    }
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', paddingBottom: '5rem' }}>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />

      <div className="container">
        <Hero onAnalyze={handleAnalyze} isLoading={loading} />

        {analysisData && (
          <div id="results" dir={isArabic ? 'rtl' : 'ltr'}>
            <AnalysisDashboard
              data={analysisData}
              onTranslate={handleTranslate}
              currentLang={isArabic ? 'ar' : 'en'}
            />
          </div>
        )}

        <HistorySection onSelect={handleHistorySelect} refreshTrigger={refreshHistory} />
      </div>
    </main>
  );
}
