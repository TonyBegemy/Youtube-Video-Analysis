"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import styles from './Hero.module.css';

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
        <section className={styles.heroSection}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.heroContent}
            >
                <span className={styles.badge}>
                    Powered by Gemini 3 Flash Preview
                </span>
                <h1 className={styles.title}>
                    Unlock Insights from <br />
                    <span className="gradient-text">YouTube Comments</span>
                </h1>
                <p className={styles.subtitle}>
                    Paste a video URL to instantly get sentiment analysis, common themes, and actionable feedback using advanced AI.
                </p>

                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.glow}></div>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube Video URL here..."
                            className={styles.input}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className={styles.analyzeButton}
                        >
                            {isLoading ? <Loader2 className={`${styles.icon} ${styles.loadingIcon}`} /> : <Search className={styles.icon} />}
                            <span>Analyze</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
}
