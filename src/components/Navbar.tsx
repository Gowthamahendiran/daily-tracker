"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/" className={styles.logoLink}>
                        Daily Tracker
                    </Link>
                </div>
                <div className={styles.navGroup}>
                    {user ? (
                        <>
                            <span className={styles.userEmail}>
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className={styles.logoutBtn}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className={styles.navLinks}>
                            <Link href="/login" className={styles.loginLink}>
                                Login
                            </Link>
                            <Link href="/signup" className={styles.signupLink}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
