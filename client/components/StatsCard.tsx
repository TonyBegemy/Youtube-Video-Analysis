import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    delay?: number;
}

export default function StatsCard({ label, value, icon, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className="glass-card flex items-center gap-4"
        >
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </motion.div>
    );
}
