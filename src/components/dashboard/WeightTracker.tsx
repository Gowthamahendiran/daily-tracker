import React from 'react';
import styles from './WeightTracker.module.css';
import { Scale } from 'lucide-react';

interface WeightTrackerProps {
    morningWeight?: number;
    nightWeight?: number;
    onUpdate: (field: 'morning' | 'night', value: number) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ morningWeight, nightWeight, onUpdate }) => {

    const diff = (nightWeight && morningWeight) ? (nightWeight - morningWeight).toFixed(1) : null;
    const isGain = diff && parseFloat(diff) > 0;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <Scale size={20} />
                Weight Tracker
            </h3>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Morning Weight (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={morningWeight || ''}
                    onChange={(e) => onUpdate('morning', parseFloat(e.target.value))}
                    placeholder="0.0"
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Night Weight (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={nightWeight || ''}
                    onChange={(e) => onUpdate('night', parseFloat(e.target.value))}
                    placeholder="0.0"
                />
            </div>

            {diff !== null && (
                <div className={styles.difference}>
                    <span>Day Difference:</span>
                    <span className={isGain ? styles.positive : styles.negative}>
                        {isGain ? '+' : ''}{diff} kg
                    </span>
                </div>
            )}
        </div>
    );
};

export default WeightTracker;
