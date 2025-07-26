import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';

type ScreenWrapperProps = {
  children: ReactNode;
  style?: any;
};

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 47 : StatusBar.currentHeight,
  },
  content: {
    flex: 1,
  },
});
