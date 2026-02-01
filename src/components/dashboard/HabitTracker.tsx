import React, { useState } from 'react';
import styles from './HabitTracker.module.css';
import { CheckSquare, Settings, Plus } from 'lucide-react';
import { Habit } from '@/lib/db';

interface HabitTrackerProps {
    habits: Habit[];
    status?: Record<string, boolean>;
    onVerify: (habitId: string, verified: boolean) => void;
    onCreateHabit: (name: string) => void;
    onToggleHabitActive: (habitId: string, isActive: boolean) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
    habits,
    status,
    onVerify,
    onCreateHabit,
    onToggleHabitActive
}) => {
    const [isManaging, setIsManaging] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');

    const handleCreate = () => {
        if (newHabitName.trim()) {
            onCreateHabit(newHabitName);
            setNewHabitName('');
        }
    };

    const activeHabits = habits.filter(h => h.active);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <CheckSquare size={20} />
                    Daily Habits
                </h3>
                <button
                    className={styles.manageBtn}
                    onClick={() => setIsManaging(!isManaging)}
                    title={isManaging ? "Close Management" : "Manage Habits"}
                >
                    <Settings size={18} />
                </button>
            </div>

            {!isManaging ? (
                <div className={styles.habitList}>
                    {activeHabits.length === 0 ? (
                        <p className="text-gray-500 text-sm">No active habits. Click settings to add one.</p>
                    ) : (
                        activeHabits.map(habit => (
                            <label key={habit.id} className={styles.habitItem}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={status?.[habit.id] || false}
                                    onChange={(e) => onVerify(habit.id, e.target.checked)}
                                />
                                <span className={styles.habitName}>{habit.name}</span>
                            </label>
                        ))
                    )}
                </div>
            ) : (
                <div className={styles.manageView}>
                    <div className={styles.addForm}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="New habit..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                        />
                        <button className={styles.addBtn} onClick={handleCreate}>
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className={styles.listManage}>
                        {habits.map(habit => (
                            <div key={habit.id} className={styles.manageItem}>
                                <span>{habit.name}</span>
                                <button
                                    className={`${styles.toggleBtn} ${habit.active ? styles.active : styles.inactive}`}
                                    onClick={() => onToggleHabitActive(habit.id, !habit.active)}
                                >
                                    {habit.active ? 'Active' : 'Archived'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitTracker;
