import { VideoAnalysis } from '@/services/api';
import StatsCard from './StatsCard';
import InsightCard from './InsightCard';
import { Eye, ThumbsUp, MessageSquare, TrendingUp, Smile, AlertTriangle, Lightbulb, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

interface DashboardProps {
    data: VideoAnalysis;
}

export default function AnalysisDashboard({ data }: DashboardProps) {
    const { videoDetails, analysis } = data;

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('YouTube Video Analysis Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Video: ${videoDetails.title.substring(0, 50)}...`, 20, 35);
        doc.text(`Channel: ${videoDetails.channelTitle}`, 20, 42);

        doc.text(`Sentiment Score: ${analysis.sentiment_score}`, 20, 55);
        doc.text(`Summary: ${analysis.sentiment_summary}`, 20, 62, { maxWidth: 170 });

        let y = 80;
        doc.setFontSize(16);
        doc.text('Key Takeaways:', 20, y);
        y += 10;
        doc.setFontSize(12);
        analysis.key_takeaways.forEach(point => {
            doc.text(`- ${point}`, 20, y, { maxWidth: 170 });
            y += 10;
        });

        y += 10;
        doc.setFontSize(16);
        doc.text('Common Themes:', 20, y);
        y += 10;
        doc.setFontSize(12);
        analysis.common_themes.forEach(point => {
            doc.text(`- ${point}`, 20, y, { maxWidth: 170 });
            y += 10;
        });

        doc.save('video-analysis-report.pdf');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Video Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                    src={videoDetails.thumbnail}
                    alt="Thumbnail"
                    className="w-full md:w-64 rounded-xl shadow-lg"
                />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{videoDetails.title}</h2>
                    <p className="text-gray-400 mb-4">{videoDetails.channelTitle}</p>
                    <div className="flex flex-wrap gap-2">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
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
            </div>

            <div className="h-px bg-gray-700/50" />

            {/* Sentiment Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Deep Analysis</h3>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-gray-700 text-sm font-medium"
                    >
                        <Download size={16} />
                        Download Report
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card mb-8 border-l-4 border-l-blue-500"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-blue-500" />
                        <h4 className="font-bold text-lg">Sentiment Summary</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        {analysis.sentiment_summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="bg-gray-800 h-2 rounded-full flex-1 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${((analysis.sentiment_score + 1) / 2) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${analysis.sentiment_score > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            />
                        </div>
                        <span className="font-mono font-bold">{analysis.sentiment_score > 0 ? '+' : ''}{analysis.sentiment_score}</span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InsightCard
                        title="Key Takeaways"
                        items={analysis.key_takeaways}
                        icon={<Lightbulb />}
                        colorClass="text-yellow-400"
                        delay={0.2}
                    />
                    <InsightCard
                        title="Common Themes"
                        items={analysis.common_themes}
                        icon={<MessageSquare />}
                        colorClass="text-blue-400"
                        delay={0.3}
                    />
                    <InsightCard
                        title="Issues & Problems"
                        items={analysis.issues_and_problems}
                        icon={<AlertTriangle />}
                        colorClass="text-red-400"
                        delay={0.4}
                    />
                    <InsightCard
                        title="What People Love"
                        items={analysis.happy_points}
                        icon={<Smile />}
                        colorClass="text-green-400"
                        delay={0.5}
                    />
                </div>
            </section>
        </div>
    );
}
