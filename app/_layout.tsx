import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function StatusBarWithTheme() {
  const { theme } = useTheme();

  return <StatusBar style={theme === 'light' ? 'dark' : 'light'} translucent />;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="note/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBarWithTheme />
    </ThemeProvider>
  );
}
