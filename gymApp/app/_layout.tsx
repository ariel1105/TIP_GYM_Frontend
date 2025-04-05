import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="machines" options={{ headerShown: false }} />
        <Stack.Screen name="activities" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
      <Toast />
    </>
  );
}
