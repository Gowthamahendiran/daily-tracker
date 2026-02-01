"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.card}>
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>
                Welcome to Your Daily Tracker
              </h1>
              <p className={styles.heroText}>
                Track your habits, monitor your progress, and achieve your goals with our premium dashboard.
              </p>
            </div>
            <div className={styles.bodySection}>
              <div className={styles.prose}> {/* Prose class optional/removed, mostly custom styles now */}
                <p className={styles.welcomeText}>
                  This is your protected home page. You are successfully logged in as <span className={styles.userEmail}>{user.email}</span>. Start exploring your features by navigating through the menu.
                </p>
                <div className={styles.grid}>
                  <div className={styles.widget}>
                    <h3 className={styles.widgetTitle}>Quick Stats</h3>
                    <p className={styles.widgetText}>Your recent activity summary will appear here.</p>
                  </div>
                  <div className={styles.widget}>
                    <h3 className={styles.widgetTitle}>Recent Logs</h3>
                    <p className={styles.widgetText}>View your latest tracked items here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
