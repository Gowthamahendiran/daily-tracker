import React, { useRef } from 'react';
import styles from './FoodLogger.module.css';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/db';

interface FoodLoggerProps {
    logDate: string;
    foodData?: {
        morning?: string;
        snack_am?: string;
        afternoon?: string;
        snack_pm?: string;
        dinner?: string;
    };
    onUpdate: (field: string, url: string) => void;
}

const MEALS = [
    { key: 'morning', label: 'Breakfast' },
    { key: 'snack_am', label: 'Morning Snack' },
    { key: 'afternoon', label: 'Lunch' },
    { key: 'snack_pm', label: 'Evening Snack' },
    { key: 'dinner', label: 'Dinner' },
] as const;

const FoodLogger: React.FC<FoodLoggerProps> = ({ logDate, foodData, onUpdate }) => {
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [uploading, setUploading] = React.useState<string | null>(null);

    const handleClick = (key: string) => {
        fileInputRefs.current[key]?.click();
    };

    const handleFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(key);
        try {
            const path = `food_logs/${logDate}/${key}_${Date.now()}`;
            const url = await uploadImage(file, path);
            onUpdate(key, url);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <Camera size={20} />
                Food Logger
            </h3>

            <div className={styles.grid}>
                {MEALS.map((meal) => {
                    const currentUrl = foodData?.[meal.key as keyof typeof foodData];
                    const isUploading = uploading === meal.key;

                    return (
                        <div
                            key={meal.key}
                            className={`${styles.mealCard} ${currentUrl ? styles.hasImage : ''}`}
                            onClick={() => !isUploading && handleClick(meal.key)}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.input}
                                ref={(el: HTMLInputElement | null) => {
                                    if (el) fileInputRefs.current[meal.key] = el;
                                }}
                                onChange={(e) => handleFileChange(meal.key, e)}
                            />

                            {currentUrl && (
                                <>
                                    <img src={currentUrl} alt={meal.label} className={styles.imagePreview} />
                                    <div className={styles.overlay}></div>
                                </>
                            )}

                            {isUploading ? (
                                <Loader2 className="animate-spin text-blue-500" size={24} />
                            ) : (
                                <ImageIcon className={styles.uploadIcon} size={24} />
                            )}

                            <span className={styles.mealName}>{meal.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FoodLogger;
