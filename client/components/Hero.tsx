"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
    onAnalyze: (url: string, lang: string) => void;
    isLoading: boolean;
}

export default function Hero({ onAnalyze, isLoading }: HeroProps) {
    const [url, setUrl] = useState('');
    const [lang, setLang] = useState('en');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url, lang);
        }
    };

    return (
        <section className={styles.heroSection}>
            <div style={{ width: '100%', maxWidth: '48rem', display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleButton} ${lang === 'en' ? styles.active : ''}`}
                        onClick={() => setLang('en')}
                    >
                        English
                    </button>
                    <button
                        className={`${styles.toggleButton} ${lang === 'ar' ? styles.active : ''}`}
                        onClick={() => setLang('ar')}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.heroContent}
            >
                <span className={styles.badge}>
                    Powered by Gemini 3.0 Flash Preview
                </span>
                <h1 className={styles.title}>
                    Unlock Insights from <br />
                    <span className="gradient-text">YouTube Comments</span>
                </h1>
                <p className={styles.subtitle}>
                    {lang === 'en'
                        ? "Paste a video URL to instantly get sentiment analysis, common themes, and actionable feedback using advanced AI."
                        : "قم بلصق رابط فيديو يوتيوب للحصول فوراً على تحليل المشاعر، والمواضيع المشتركة، والملاحظات البناءة باستخدام الذكاء الاصطناعي."}
                </p>

                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.glow}></div>
                    <div className={styles.inputWrapper} style={{ direction: 'ltr' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={lang === 'en' ? "Paste YouTube Video URL here..." : "ضع رابط الفيديو هنا..."}
                            className={styles.input}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className={styles.analyzeButton}
                        >
                            {isLoading ? <Loader2 className={`${styles.icon} ${styles.loadingIcon}`} /> : <Search className={styles.icon} />}
                            <span>{lang === 'en' ? "Analyze" : "تحليل"}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
}
