"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DailyLog, Habit, getDailyLog, getHabits, saveDailyLog, toggleHabitStatus, createHabit, getDailyLogsRange } from '@/lib/db';

interface DashboardState {
    user: User | null;
    currentDate: Date;
    dailyLog: DailyLog | null;
    habits: Habit[];
    loading: {
        auth: boolean;
        logs: boolean;
        habits: boolean;
        analytics: boolean;
    };
    setDate: (date: Date) => void;
    updateDailyLog: (data: Partial<DailyLog>) => Promise<void>;
    updateHabitStatus: (habitId: string, status: boolean) => Promise<void>;
    addHabit: (name: string) => Promise<void>;
    toggleHabitActive: (habitId: string, active: boolean) => Promise<void>;
    fetchAnalytics: (range: 'weekly' | 'monthly') => Promise<DailyLog[]>;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);

    // Caching: store logs by date string to avoid refetching
    const [logsCache, setLogsCache] = useState<Record<string, DailyLog>>({});

    // Analytics Cache
    const [analyticsCache, setAnalyticsCache] = useState<Record<string, DailyLog[]>>({});
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    const [loading, setLoading] = useState({
        auth: true,
        logs: false,
        habits: true, // Habits load once essentially
    });

    const dateStr = currentDate.toISOString().split('T')[0];

    // Auth Change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(prev => ({ ...prev, auth: false }));
        });
        return () => unsubscribe();
    }, []);

    // Initial Data Fetch (Habits only need fetching once per session mostly, or invalidation)
    useEffect(() => {
        if (!user) {
            setHabits([]);
            setLoading(prev => ({ ...prev, habits: false }));
            return;
        }

        const fetchHabits = async () => {
            // Habits logic
            try {
                const h = await getHabits(user.uid);
                setHabits(h);
            } catch (e) {
                console.error("Habits fetch failed", e);
            } finally {
                setLoading(prev => ({ ...prev, habits: false }));
            }
        };

        fetchHabits();
    }, [user]);

    // Daily Log Fetch (Dependent on Date)
    useEffect(() => {
        if (!user) {
            setDailyLog(null);
            return;
        }

        const fetchLog = async () => {
            // Check cache first
            if (logsCache[dateStr]) {
                setDailyLog(logsCache[dateStr]);
                return;
            }

            setLoading(prev => ({ ...prev, logs: true }));
            try {
                const log = await getDailyLog(user.uid, dateStr);
                const logData = log || { date: dateStr };
                setDailyLog(logData);
                setLogsCache(prev => ({ ...prev, [dateStr]: logData }));
            } catch (error) {
                console.error("Log fetch failed", error);
            } finally {
                setLoading(prev => ({ ...prev, logs: false }));
            }
        };

        fetchLog();
    }, [user, dateStr]);

    const updateDailyLog = async (data: Partial<DailyLog>) => {
        if (!user) return;

        // Optimistic Update
        const current = dailyLog || { date: dateStr };
        const newLog = {
            ...current,
            ...data,
            // Deep merge specific sections to avoid overwriting with partial data
            weight: { ...current.weight, ...data.weight },
            food: { ...current.food, ...data.food },
            todos: data.todos || current.todos, // Arrays usually replaced
            habits: { ...current.habits, ...data.habits }
        };

        setDailyLog(newLog);
        setLogsCache(prev => ({ ...prev, [dateStr]: newLog }));

        // API Call
        try {
            await saveDailyLog(user.uid, dateStr, data);
        } catch (error) {
            console.error("Failed to save log", error);
        }
    };

    const updateHabitStatus = async (habitId: string, status: boolean) => {
        // Optimistic update for log
        const newHabitsMap = { ...dailyLog?.habits, [habitId]: status };
        await updateDailyLog({ habits: newHabitsMap });
    };

    const addHabit = async (name: string) => {
        if (!user) return;
        try {
            await createHabit(user.uid, name);
            // Re-fetch habits to get the ID and ensure sync
            const newHabits = await getHabits(user.uid);
            setHabits(newHabits);
        } catch (error) {
            console.error("Add habit failed", error);
        }
    };

    const toggleHabitActive = async (habitId: string, isActive: boolean) => {
        if (!user) return;
        // Optimistic
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, active: isActive } : h));

        try {
            await toggleHabitStatus(user.uid, habitId, isActive);
        } catch (error) {
            console.error("Toggle habit failed", error);
        }
    };

    const fetchAnalytics = async (range: 'weekly' | 'monthly'): Promise<DailyLog[]> => {
        if (!user) return [];

        // Simple cache key based on range (could be improved with dates but good for session)
        const cacheKey = `${range}-${new Date().toISOString().split('T')[0]}`; // invalidates daily

        if (analyticsCache[cacheKey]) {
            return analyticsCache[cacheKey];
        }

        setAnalyticsLoading(true);
        try {
            const endDate = new Date();
            const startDate = new Date();
            if (range === 'weekly') startDate.setDate(endDate.getDate() - 7);
            else startDate.setDate(endDate.getDate() - 30);

            // Import dynamically or assume it's available via db import at top

            const logs = await getDailyLogsRange(
                user.uid,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            setAnalyticsCache(prev => ({ ...prev, [cacheKey]: logs }));
            return logs;
        } catch (error) {
            console.error("Analytics fetch failed", error);
            return [];
        } finally {
            setAnalyticsLoading(false);
        }
    };

    return (
        <DashboardContext.Provider value={{
            user,
            currentDate,
            dailyLog,
            habits,
            loading: { ...loading, analytics: analyticsLoading },
            setDate: setCurrentDate,
            updateDailyLog,
            updateHabitStatus,
            addHabit,
            toggleHabitActive,
            fetchAnalytics
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
};
