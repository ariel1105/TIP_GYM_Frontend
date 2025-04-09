import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


const renderIcon = (name: string) => () => {
  if (name === 'home') {
    return <FontAwesome name="home" size={24} color={'black'} />
  }
  if (name === 'profile'){
    return <FontAwesome name="user" size={24} color={'black'} />
  }  
  
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
      <Tabs.Screen name="home" options={{ tabBarIcon: renderIcon('home') }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: renderIcon('profile') }} />
      <Tabs.Screen name="machines" options={{href: null}} />
      <Tabs.Screen name="activities" options={{href: null}}/>
    </Tabs>
  );
}
