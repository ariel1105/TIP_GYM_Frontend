import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import colors from '@/theme/colors';

const ICON_COLOR = colors.primary;

const renderIcon = (name: string) => ({ focused }: { focused: boolean }) => {
  const color = ICON_COLOR;
  let iconName: keyof typeof FontAwesome.glyphMap = 'home';

  if (name === 'home') iconName = 'home';
  if (name === 'profile') iconName = 'user';

  return <FontAwesome name={iconName} size={24} color={color} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.black,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ tabBarIcon: renderIcon('home') }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: renderIcon('profile') }} />
      <Tabs.Screen name="enrollments" options={{ href: null }} />
      <Tabs.Screen name="machines" options={{ href: null }} />
      <Tabs.Screen name="activities" options={{ href: null }} />
    </Tabs>
  );
}
