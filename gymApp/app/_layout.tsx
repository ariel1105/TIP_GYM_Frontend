import { PaymentRedirectHandler } from "../components/PaymentRedirectHandler";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../theme/ThemeContext";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
         <PaymentRedirectHandler />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
