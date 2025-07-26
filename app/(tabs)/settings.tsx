import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: {
      fontSize: 25,
      fontWeight: '700',
      color: colors.text,
    },
    section: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    settingItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    aboutSection: {
      marginTop: 32,
      paddingHorizontal: 16,
    },
    aboutText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <View style={styles.settingContent}>
            {theme === 'light' ? (
              <Sun
                size={24}
                color={colors.textSecondary}
                style={styles.settingIcon}
              />
            ) : (
              <Moon
                size={24}
                color={colors.textSecondary}
                style={styles.settingIcon}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                {theme === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.background}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>
          NotesApp v1.0.0{'\n'}A simple, distraction-free note taking app{'\n'}
          Built with React Native and Expo
        </Text>
      </View>
    </ScreenWrapper>
  );
}
