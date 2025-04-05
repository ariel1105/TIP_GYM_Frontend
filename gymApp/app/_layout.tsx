import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <>
      <Stack />
      <StatusBar style="dark" />
      <Toast />
    </>
  );
}
