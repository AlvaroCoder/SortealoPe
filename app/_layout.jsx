import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { AuthProvider } from "@/context/AuthContext";
import { RaffleProvider } from "@/context/RaffleContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <RaffleProvider>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </RaffleProvider>
  );
}
