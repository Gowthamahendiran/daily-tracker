"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import styles from '@/components/dashboard/Dashboard.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WeightTracker from '@/components/dashboard/WeightTracker';
import HabitTracker from '@/components/dashboard/HabitTracker';
import FoodLogger from '@/components/dashboard/FoodLogger';
import PlanAndReview from '@/components/dashboard/PlanAndReview';
import TodoList from '@/components/dashboard/TodoList';
import Analytics from '@/components/dashboard/Analytics';
import { WeightSkeleton, HabitSkeleton, FoodSkeleton, PlanSkeleton, TodoSkeleton } from '@/components/dashboard/Skeletons';

export default function DashboardContent() {
    const {
        user,
        dailyLog,
        habits,
        loading,
        currentDate,
        setDate,
        updateDailyLog,
        updateHabitStatus,
        addHabit,
        toggleHabitActive
    } = useDashboard();

    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const router = useRouter();

    if (loading.auth) return null; // Auth loading handles redirect usually

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleDateChange = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setDate(newDate);
    };

    const handleWeightUpdate = (field: 'morning' | 'night', value: number) => {
        updateDailyLog({
            weight: { ...dailyLog?.weight, [field]: value }
        });
    };

    const handleHabitVerify = (habitId: string, verified: boolean) => {
        updateHabitStatus(habitId, verified);
    };

    const handleDateReset = () => {
        setDate(new Date());
    }

    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Daily Analyst</h1>

                {activeTab === 'daily' && (
                    <div className={styles.dateNav}>
                        <button className={styles.navBtn} onClick={() => handleDateChange(-1)}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className={styles.currentDate}>{currentDate.toDateString()}</span>
                            {!isToday && (
                                <button
                                    className="text-xs text-blue-500 hover:underline mt-1"
                                    onClick={handleDateReset}
                                >
                                    Jump to Today
                                </button>
                            )}
                        </div>
                        <button className={styles.navBtn} onClick={() => handleDateChange(1)}>
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'daily' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('daily')}
                >
                    Daily Tracker
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'weekly' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('weekly')}
                >
                    Weekly Report
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'monthly' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('monthly')}
                >
                    Monthly Report
                </button>
            </div>

            {activeTab === 'daily' ? (
                <div className={styles.grid}>
                    <div className={styles.weight}>
                        {loading.logs ? <WeightSkeleton /> : (
                            <WeightTracker
                                morningWeight={dailyLog?.weight?.morning}
                                nightWeight={dailyLog?.weight?.night}
                                onUpdate={handleWeightUpdate}
                            />
                        )}
                    </div>

                    <div className={styles.habits}>
                        {loading.habits || loading.logs ? <HabitSkeleton /> : (
                            <HabitTracker
                                habits={habits}
                                status={dailyLog?.habits}
                                onVerify={handleHabitVerify}
                                onCreateHabit={addHabit}
                                onToggleHabitActive={toggleHabitActive}
                            />
                        )}
                    </div>

                    <div className={styles.food}>
                        {loading.logs ? <FoodSkeleton /> : (
                            <FoodLogger
                                logDate={currentDate.toISOString().split('T')[0]}
                                foodData={dailyLog?.food}
                                onUpdate={(field, url) => updateDailyLog({ food: { ...dailyLog?.food, [field]: url } })}
                            />
                        )}
                    </div>

                    <div className={styles.planning}>
                        {loading.logs ? <PlanSkeleton /> : (
                            <PlanAndReview
                                planning={dailyLog?.planning}
                                learning={dailyLog?.learning}
                                onUpdate={(field, val) => updateDailyLog({ [field]: val })}
                            />
                        )}
                    </div>

                    <div className={styles.todos}>
                        {loading.logs ? <TodoSkeleton /> : (
                            <TodoList
                                todos={dailyLog?.todos}
                                onUpdate={(todos) => updateDailyLog({ todos })}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <Analytics range={activeTab as 'weekly' | 'monthly'} />
            )}
        </div>
    );
}
