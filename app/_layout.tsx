import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { TransactionProvider } from './contexts/TransactionContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <ProfileProvider>
        <TransactionProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </TransactionProvider>
      </ProfileProvider>
    </UserProvider>
  );
}
export function Root() {
  return <Redirect href="/(auth)/start"/>;
}