import { Stack } from "expo-router";

export default function LayoutSeller() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="scan/index" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="reservas/index" />
    </Stack>
  );
}
