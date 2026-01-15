import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'royal-muse' | 'steel-valor' | 'sage-studio';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('collab-os-theme');
    return (saved as Theme) || 'royal-muse';
  });

  useEffect(() => {
    localStorage.setItem('collab-os-theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('theme-royal-muse', 'theme-steel-valor', 'theme-sage-studio');
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
