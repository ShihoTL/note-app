import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { FileText, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

export default function CustomTabBar() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const active = segments[1] ?? 'index';

  const handleTabPress = (route: string, targetRoute: string) => {
    // Trigger haptic feedback on every tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    if (active !== route) {
      router.navigate(targetRoute as any);
    }
  };

  return (
    <View
      style={[
        styles.tabBar,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      <TabButton
        label="Notes"
        icon={FileText}
        route="index"
        active={active === 'index'}
        onPress={() => handleTabPress('index', '/')}
        colors={colors}
        theme={theme}
      />
      <TabButton
        label="Settings"
        icon={Settings}
        route="settings"
        active={active === 'settings'}
        onPress={() => handleTabPress('settings', '/settings')}
        colors={colors}
        theme={theme}
      />
    </View>
  );
}

function TabButton({ label, icon: Icon, active, onPress, colors, theme }: any) {
  const iconColor = active
    ? theme === 'light'
      ? '#333333'
      : '#FFFFFF'
    : '#888888';

  const textColor = active
    ? theme === 'light'
      ? '#333333'
      : '#FFFFFF'
    : '#888888';

  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Icon size={22} color={iconColor} />
      <Text
        style={{
          fontSize: 12,
          color: textColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 6,
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});
