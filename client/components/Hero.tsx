"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

interface HeroProps {
    onAnalyze: (url: string) => void;
    isLoading: boolean;
}

export default function Hero({ onAnalyze, isLoading }: HeroProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
            >
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6">
                    Powered by Gemini 2.0 Flash
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Unlock Insights from <br />
                    <span className="gradient-text">YouTube Comments</span>
                </h1>
                <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                    Paste a video URL to instantly get sentiment analysis, common themes, and actionable feedback using advanced AI.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-[#0f172a] rounded-xl border border-gray-700/50 p-2 shadow-2xl">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube Video URL here..."
                            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-gray-500 text-lg"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            <span>Analyze</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
}
