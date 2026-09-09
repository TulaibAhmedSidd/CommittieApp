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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Clean off any stale theme-* classes (e.g. theme-royal) from document and body
        if (typeof document !== "undefined") {
            const targets = [document.documentElement, document.body];
            targets.forEach(el => {
                if (!el) return;
                const themeClasses = Array.from(el.classList).filter(c => c.startsWith("theme-"));
                themeClasses.forEach(c => el.classList.remove(c));
            });
        }
    }, []);

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
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
