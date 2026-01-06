import { useEffect, useState } from 'react';
import { fetchHistory } from '@/services/api';
import styles from './HistorySection.module.css';

interface HistoryItem {
    id: number;
    title: string;
    thumbnail: string;
    channel_title: string;
    language: string;
    analysis_json: string; // stored as stringified JSON
    created_at: string;
}

interface Props {
    onSelect: (data: any) => void;
    refreshTrigger: number;
}

export default function HistorySection({ onSelect, refreshTrigger }: Props) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        fetchHistory().then(setHistory);
    }, [refreshTrigger]);

    const handleSelect = (item: HistoryItem) => {
        try {
            const analysis = JSON.parse(item.analysis_json);
            // Reconstruct the data shape expected by AnalysisDashboard
            const reconstructedData = {
                videoDetails: {
                    title: item.title,
                    thumbnail: item.thumbnail,
                    channelTitle: item.channel_title,
                    // Fallback for fields not stored in simple history
                    viewCount: "N/A",
                    likeCount: "N/A",
                    commentCount: "N/A",
                    publishedAt: "",
                    description: ""
                },
                analysis: analysis
            };
            onSelect(reconstructedData);
        } catch (e) {
            console.error("Failed to parse history item", e);
        }
    };

    if (history.length === 0) return null;

    return (
        <div className={styles.historyContainer}>
            <h3 className={styles.title}>Recent Analyses</h3>
            <div className={styles.grid}>
                {history.map((item) => (
                    <div key={item.id} className={styles.historyCard} onClick={() => handleSelect(item)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                        <div className={styles.content}>
                            <h4 className={styles.videoTitle}>{item.title}</h4>
                            <div className={styles.meta}>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                <span className={item.language === 'ar' ? styles.langAr : styles.langEn}>
                                    {item.language.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
