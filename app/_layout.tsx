import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { AppProvider } from './providers/AppProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
          <Stack.Screen name="CategoriesScreen" options={{ headerShown: false }}/>
          <Stack.Screen name="TransactionsScreen" options={{ headerShown: false }}/>
          <Stack.Screen name="CategoryDetailsScreen" options={{ headerShown: false }}/>
        </Stack>
      </ThemeProvider>
    </AppProvider>
  );
}

export function Root() {
  return <Redirect href="/(auth)/start"/>;
}