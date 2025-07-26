import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeColors } from '@/types';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isLoading: boolean;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f8f9fa',
  surfaceVariant: '#f1f3f4',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  accent: '#374151',
  destructive: '#dc2626',
};

const darkColors: ThemeColors = {
  background: '#1e1e1e',
  surface: '#1f1f1f',
  surfaceVariant: '#374151',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  border: '#6f7379ff',
  accent: '#9ca3af',
  destructive: '#ef4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  const colors = theme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
