import { ThemeProvider } from "@/theme/ThemeContext";
import { Stack } from "expo-router";

const Layout = () => {
    return(
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name ="(tabs)" />
            </Stack>
        </ThemeProvider>
    )
}
export default Layout
