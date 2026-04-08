import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="validateCode" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
