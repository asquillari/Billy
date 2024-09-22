import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [userEmail, setUserEmail] = useState('');

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} initialParams={{ userEmail, setUserEmail }}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} initialParams={{ setUserEmail }}/>
      </Stack>
    </ThemeProvider>
  );
}

export function Root() {
  return <Redirect href="/(auth)/start"/>;
}