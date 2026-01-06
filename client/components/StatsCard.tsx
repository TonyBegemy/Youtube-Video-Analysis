import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './StatsCard.module.css';

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
            className={styles.card}
        >
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <div>
                <p className={styles.label}>{label}</p>
                <h3 className={styles.value}>{value}</h3>
            </div>
        </motion.div>
    );
}
