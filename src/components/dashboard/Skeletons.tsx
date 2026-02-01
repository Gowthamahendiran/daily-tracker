import React from 'react';
import styles from '../dashboard/Dashboard.module.css';

export const WeightSkeleton = () => (
    <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '220px' }}></div>
);

export const HabitSkeleton = () => (
    <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '220px' }}></div>
);

export const FoodSkeleton = () => (
    <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '300px' }}></div>
);

export const PlanSkeleton = () => (
    <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '350px' }}></div>
);

export const TodoSkeleton = () => (
    <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '350px' }}></div>
);

export const AnalyticsSkeleton = () => (
    <div className={styles.container}>
        <div className={styles.summaryGrid}>
            <div className={`${styles.statCard} ${styles.skeleton}`} style={{ height: '100px' }}></div>
            <div className={`${styles.statCard} ${styles.skeleton}`} style={{ height: '100px' }}></div>
        </div>
        <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '350px' }}></div>
        <div className={`${styles.chartCard} ${styles.skeleton}`} style={{ height: '350px' }}></div>
    </div>
);
