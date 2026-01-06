import { VideoAnalysis } from '@/services/api';
import StatsCard from './StatsCard';
import InsightCard from './InsightCard';
import { Eye, ThumbsUp, MessageSquare, TrendingUp, Smile, AlertTriangle, Lightbulb, Download, Loader2, Globe } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import styles from './AnalysisDashboard.module.css';

interface DashboardProps {
    data: VideoAnalysis;
    onTranslate?: (lang: string) => void;
    currentLang?: 'en' | 'ar';
}

export default function AnalysisDashboard({ data, onTranslate, currentLang = 'en' }: DashboardProps) {
    const { videoDetails, analysis } = data;
    const [downloading, setDownloading] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!reportRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0f172a',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('youtube-analysis-report.pdf');
        } catch (error) {
            console.error('PDF Generation failed:', error);
            alert('Failed to generate PDF report.');
        } finally {
            setDownloading(false);
        }
    };

    const toggleLang = () => {
        if (onTranslate) {
            onTranslate(currentLang === 'en' ? 'ar' : 'en');
        }
    };

    return (
        <div className={styles.dashboard}>
            {/* Report Container for PDF Capture */}
            <div ref={reportRef} style={{ padding: '20px', backgroundColor: '#0f172a' }}>

                {/* Video Header */}
                <div className={styles.videoSection}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={videoDetails.thumbnail}
                        alt="Thumbnail"
                        className={styles.thumbnail}
                        crossOrigin="anonymous"
                    />
                    <div className={styles.videoInfo}>
                        <h2 className={styles.videoTitle}>{videoDetails.title}</h2>
                        <p className={styles.channelTitle}>{videoDetails.channelTitle}</p>
                        <div className={styles.statsGrid}>
                            <StatsCard
                                label="Views"
                                value={parseInt(videoDetails.viewCount).toLocaleString()}
                                icon={<Eye size={20} />}
                                delay={0.1}
                            />
                            <StatsCard
                                label="Likes"
                                value={parseInt(videoDetails.likeCount).toLocaleString()}
                                icon={<ThumbsUp size={20} />}
                                delay={0.2}
                            />
                            <StatsCard
                                label="Comments"
                                value={parseInt(videoDetails.commentCount).toLocaleString()}
                                icon={<MessageSquare size={20} />}
                                delay={0.3}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Sentiment Section */}
                <section>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Deep Analysis</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {onTranslate && (
                                <button
                                    onClick={toggleLang}
                                    className={styles.downloadButton}
                                    style={{ borderColor: '#3b82f6', color: '#60a5fa' }}
                                >
                                    <Globe size={16} />
                                    {currentLang === 'en' ? 'Translate to Arabic' : 'Translate to English'}
                                </button>
                            )}
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className={styles.downloadButton}
                                style={downloading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                            >
                                {downloading ? <Loader2 className={styles.loadingIcon} size={16} /> : <Download size={16} />}
                                {downloading ? 'Generating...' : 'Download Report'}
                            </button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={styles.sentimentCard}
                    >
                        <div className={styles.sentimentHeader}>
                            <TrendingUp />
                            <h4 className={styles.sentimentTitle}>Sentiment Summary</h4>
                        </div>
                        <p className={styles.summaryText}>
                            {analysis.sentiment_summary}
                        </p>
                        <div className={styles.scoreContainer}>
                            <div className={styles.barBackground}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${((analysis.sentiment_score + 1) / 2) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`${styles.barFill} ${analysis.sentiment_score > 0 ? styles.barPositive : styles.barNegative}`}
                                />
                            </div>
                            <span className={styles.scoreValue}>{analysis.sentiment_score > 0 ? '+' : ''}{analysis.sentiment_score}</span>
                        </div>
                    </motion.div>

                    <div className={styles.insightsGrid}>
                        <InsightCard
                            title="Key Takeaways"
                            description="High-level summary of the most important points discussed."
                            items={analysis.key_takeaways}
                            icon={<Lightbulb />}
                            colorClass="text-yellow-400"
                            delay={0.2}
                        />
                        <InsightCard
                            title="Common Themes"
                            description="Recurring topics and threads found across multiple comments."
                            items={analysis.common_themes}
                            icon={<MessageSquare />}
                            colorClass="text-blue-400"
                            delay={0.3}
                        />
                        <InsightCard
                            title="Issues & Problems"
                            description="Complaints, bugs, or constructive criticism from viewers."
                            items={analysis.issues_and_problems}
                            icon={<AlertTriangle />}
                            colorClass="text-red-400"
                            delay={0.4}
                        />
                        <InsightCard
                            title="What People Love"
                            description="Positive highlights and aspects viewers appreciated most."
                            items={analysis.happy_points}
                            icon={<Smile />}
                            colorClass="text-green-400"
                            delay={0.5}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
