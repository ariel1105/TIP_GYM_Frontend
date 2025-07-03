import { Tabs } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { darkColors, lightColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeContext';
import { TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;

  const renderIcon = (name: string) => ({ focused }: { focused: boolean }) => {
    let iconName: keyof typeof FontAwesome.glyphMap = 'home';
    if (name === 'home') iconName = 'home';
    if (name === 'profile') iconName = 'user';

    return <FontAwesome name={iconName} size={24} color={colors.text} />;
  };

  return (
    <>
      <View
        style={{
          height: 50,
          backgroundColor: colors.background,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingRight: 15,
          paddingBottom: 5,
        }}
      >
        <TouchableOpacity onPress={toggleTheme}>
          <Feather
            name={theme === 'dark' ? 'sun' : 'moon'}
            size={24}
            color={theme === 'dark' ? darkColors.primary : lightColors.grayDark}
          />
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.surface,
          },
        }}
      >
        <Tabs.Screen name="home" options={{ tabBarIcon: renderIcon('home') }} />
        <Tabs.Screen name="profile" options={{ tabBarIcon: renderIcon('profile') }} />
        <Tabs.Screen name="enrollments" options={{ href: null }} />
        <Tabs.Screen name="bodyBuilding" options={{ href: null }} />
        <Tabs.Screen name="activities" options={{ href: null }} />
        <Tabs.Screen name="vouchers" options={{ href: null }} />
        <Tabs.Screen name="myVouchers" options={{ href: null }} />
        <Tabs.Screen name="myBodyBuildingPlan" options={{ href: null }} />
        <Tabs.Screen name="myBodyBuildingEntry" options={{ href: null }} />
      </Tabs>
    </>
  );
}
