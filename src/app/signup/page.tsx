"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Create Account</h2>
                    <p className={styles.subtitle}>Join the community and start tracking</p>
                </div>

                {error && (
                    <div className={styles.errorBox}>
                        <p className={styles.errorText}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSignup} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Already have an account?{" "}
                        <Link href="/login" className={styles.link}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
