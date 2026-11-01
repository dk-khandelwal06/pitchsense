"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "stadium" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "stadium",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("stadium");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage
    const savedTheme = localStorage.getItem("pitchsense_theme") as Theme | null;
    if (savedTheme && ["stadium", "light", "dark"].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("stadium");
    }
    setMounted(true);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove("theme-stadium", "theme-light", "theme-dark");
    root.classList.add(`theme-${t}`);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("pitchsense_theme", newTheme);
    applyTheme(newTheme);
  };

  // Prevent flash by applying initial class inline
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

