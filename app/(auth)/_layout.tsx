import React from 'react';
import { Stack } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

export default function AuthLayout() {
  return (
    <NavigationContainer independent={true}>
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="start" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        </Stack>
    </NavigationContainer>
  );
}