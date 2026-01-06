import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import styles from './InsightCard.module.css';

interface InsightCardProps {
    title: string;
    description: string;
    items: string[];
    icon: ReactNode;
    colorClass: string; // expects specific map keys now
    delay?: number;
}

const colorMap: Record<string, string> = {
    'text-blue-400': styles.colorBlue,
    'text-green-400': styles.colorGreen,
    'text-red-400': styles.colorRed,
    'text-yellow-400': styles.colorYellow,
};

export default function InsightCard({ title, description, items, icon, colorClass, delay = 0 }: InsightCardProps) {
    const activeColor = colorMap[colorClass] || styles.colorBlue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={styles.card}
        >
            <div className={`${styles.header} ${activeColor}`}>
                {icon}
                <h3 className={styles.title}>{title}</h3>
            </div>
            <p className={styles.description}>{description}</p>
            <ul className={styles.list}>
                {items.map((item, i) => (
                    <li key={i} className={styles.listItem}>
                        <span className={`${styles.dot} ${activeColor}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
