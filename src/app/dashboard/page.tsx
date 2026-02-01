"use client";

import { DashboardProvider } from '@/context/DashboardContext';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
}
