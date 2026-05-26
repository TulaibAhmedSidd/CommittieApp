"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
    isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState("midnight");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            if (data.activeTheme) {
                setThemeState(data.activeTheme);
                applyTheme(data.activeTheme);
            }
        } catch (err) {
            console.error("Failed to fetch theme:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const applyTheme = (themeName: string) => {
        const html = document.documentElement;
        const body = document.body;

        // Remove existing theme classes from both
        [html, body].forEach(el => {
            const themeClasses = Array.from(el.classList).filter(c => c.startsWith('theme-'));
            themeClasses.forEach(c => el.classList.remove(c));

            if (themeName !== 'midnight') {
                el.classList.add(`theme-${themeName}`);
            }
        });
    };

    const setTheme = async (newTheme: string) => {
        setThemeState(newTheme);
        applyTheme(newTheme);

        // Admin will typically call this from the ThemeManager, 
        // but we keep it here for consistency.
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
