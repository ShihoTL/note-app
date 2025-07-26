// app/_layout.tsx
import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';

export default function Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
