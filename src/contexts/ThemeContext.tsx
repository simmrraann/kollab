import { createContext, useContext, useEffect, useState } from "react";

type Theme = "royal-muse" | "steel-valor" | "sage-studio";
type Mode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
  cycleTheme: () => void; // <--- NEW FUNCTION
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("kollab-theme") as Theme) || "royal-muse");
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("kollab-mode") as Mode) || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 1. Reset Classes
    root.classList.remove("light", "dark", "royal-muse", "steel-valor", "sage-studio");
    
    // 2. Add Active Classes
    root.classList.add(mode); 
    root.classList.add(theme);
    
    // 3. Force style update
    root.style.colorScheme = mode;

    // 4. Save
    localStorage.setItem("kollab-theme", theme);
    localStorage.setItem("kollab-mode", mode);
  }, [theme, mode]);

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  // --- NEW: LOGIC TO CYCLE THEMES ---
  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === "royal-muse") return "sage-studio"; // Pink -> Green
      if (prev === "sage-studio") return "steel-valor"; // Green -> Blue
      return "royal-muse"; // Blue -> Pink
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};