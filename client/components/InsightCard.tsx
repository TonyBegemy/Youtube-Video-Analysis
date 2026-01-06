import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InsightCardProps {
    title: string;
    items: string[];
    icon: ReactNode;
    colorClass: string; // e.g., 'text-green-400'
    delay?: number;
}

export default function InsightCard({ title, items, icon, colorClass, delay = 0 }: InsightCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass-card flex flex-col h-full"
        >
            <div className={`flex items-center gap-2 mb-4 ${colorClass}`}>
                {icon}
                <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current opacity-70 ${colorClass}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
