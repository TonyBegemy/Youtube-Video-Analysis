"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { analyzeVideo, VideoAnalysis } from '@/services/api';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setAnalysisData(null);
    try {
      const data = await analyzeVideo(url);
      setAnalysisData(data);
      toast.success('Analysis complete!');
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
          <div id="results">
            <AnalysisDashboard data={analysisData} />
          </div>
        )}
      </div>
    </main>
  );
}
