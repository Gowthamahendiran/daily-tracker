import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import styles from './Analytics.module.css';
import { DailyLog } from '@/lib/db';
import { useDashboard } from '@/context/DashboardContext';
import { AnalyticsSkeleton } from './Skeletons';

interface AnalyticsProps {
    range: 'weekly' | 'monthly';
}

const Analytics: React.FC<AnalyticsProps> = ({ range }) => {
    const { fetchAnalytics, loading } = useDashboard();
    const [data, setData] = useState<any[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setInternalLoading(true);
            const logs = await fetchAnalytics(range);

            if (mounted) {
                // Process logs for charts
                const processedData = logs.map(log => {
                    const completedHabits = log.habits ? Object.values(log.habits).filter(Boolean).length : 0;
                    return {
                        date: log.date.slice(5), // MM-DD
                        weightMorning: log.weight?.morning || null,
                        weightNight: log.weight?.night || null,
                        habitsCompleted: completedHabits
                    };
                });
                setData(processedData);
                setInternalLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [range]);

    if (loading.analytics || internalLoading) return <AnalyticsSkeleton />;

    const avgWeight = data.length
        ? (data.reduce((acc, curr) => acc + (curr.weightMorning || 0), 0) / data.filter(d => d.weightMorning).length).toFixed(1)
        : 'N/A';

    return (
        <div className={styles.container}>
            <div className={styles.summaryGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Avg Morning Weight</div>
                    <div className={styles.statValue}>{avgWeight} <span className="text-sm font-normal text-gray-500">kg</span></div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Days Logged</div>
                    <div className={styles.statValue}>{data.length}</div>
                </div>
            </div>

            <div className={styles.chartCard}>
                <div className={styles.title}>Weight Trend</div>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weightMorning" name="Morning" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="weightNight" name="Night" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.chartCard}>
                <div className={styles.title}>Habit Completion</div>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="habitsCompleted" name="Habits Done" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
