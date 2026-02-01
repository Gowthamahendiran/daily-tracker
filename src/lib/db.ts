import { db, storage } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, Timestamp, documentId } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface DailyLog {
    date: string;
    weight?: {
        morning?: number;
        night?: number;
    };
    food?: {
        morning?: string;
        snack_am?: string;
        afternoon?: string;
        snack_pm?: string;
        dinner?: string;
    };
    habits?: Record<string, boolean>;
    planning?: string;
    learning?: string;
    todos?: { text: string; done: boolean }[];
}

export interface Habit {
    id: string;
    name: string;
    active: boolean;
}

// --- Daily Logs ---

export const getDailyLog = async (uid: string, date: string): Promise<DailyLog | null> => {
    const docRef = doc(db, "users", uid, "daily_logs", date);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as DailyLog;
    }
    return null;
};

export const saveDailyLog = async (uid: string, date: string, data: Partial<DailyLog>) => {
    const docRef = doc(db, "users", uid, "daily_logs", date);
    await setDoc(docRef, { ...data, date }, { merge: true });
};

export const getDailyLogsRange = async (uid: string, startDate: string, endDate: string): Promise<DailyLog[]> => {
    const logsRef = collection(db, "users", uid, "daily_logs");
    const q = query(logsRef, where("date", ">=", startDate), where("date", "<=", endDate));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as DailyLog).sort((a, b) => a.date.localeCompare(b.date));
};

// --- Habits ---

export const getHabits = async (uid: string): Promise<Habit[]> => {
    const habitsRef = collection(db, "users", uid, "habits");
    const q = query(habitsRef);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Habit));
};

export const createHabit = async (uid: string, name: string) => {
    const newHabitRef = doc(collection(db, "users", uid, "habits"));
    await setDoc(newHabitRef, {
        name,
        active: true,
        created_at: Timestamp.now()
    });
};

export const toggleHabitStatus = async (uid: string, habitId: string, isActive: boolean) => {
    const habitRef = doc(db, "users", uid, "habits", habitId);
    await updateDoc(habitRef, { active: isActive });
};


// --- Storage ---
export const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}
