import { Stack } from "expo-router";

export default function LayoutBuyer() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scan/index" />
      <Stack.Screen name="events/[id]" />
    </Stack>
  );
}