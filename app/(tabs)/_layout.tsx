import { Tabs } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: IconName | undefined;
          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'profiles') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName} size={size} color={color}/>;
        },
        tabBarActiveTintColor: '#4B00B8',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="statistics" options={{ title: 'Estadísticas' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendario' }} />
      <Tabs.Screen name="profiles" options={{ title: 'Perfiles' }} />
    </Tabs>
  );
}

export default TabNavigator;