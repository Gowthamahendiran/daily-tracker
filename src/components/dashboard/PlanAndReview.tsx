import React from 'react';
import styles from './PlanAndReview.module.css';
import { Sun, Moon } from 'lucide-react';

interface PlanAndReviewProps {
    planning?: string;
    learning?: string;
    onUpdate: (field: 'planning' | 'learning', value: string) => void;
}

const PlanAndReview: React.FC<PlanAndReviewProps> = ({ planning, learning, onUpdate }) => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <label className={styles.label}>
                    <Sun size={20} className="text-orange-500" />
                    Day Start Planning
                </label>
                <textarea
                    className={styles.textarea}
                    placeholder="What are your main goals for today?"
                    value={planning || ''}
                    onChange={(e) => onUpdate('planning', e.target.value)}
                />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>
                    <Moon size={20} className="text-indigo-500" />
                    Day End Reflection / Learning
                </label>
                <textarea
                    className={styles.textarea}
                    placeholder="What did you learn today? What went well?"
                    value={learning || ''}
                    onChange={(e) => onUpdate('learning', e.target.value)}
                />
            </div>
        </div>
    );
};

export default PlanAndReview;
