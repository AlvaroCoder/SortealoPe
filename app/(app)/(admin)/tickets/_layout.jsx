import { Stack } from "expo-router";

export default function LayoutTickets() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="vender" />
      <Stack.Screen name="sortear" />
      <Stack.Screen name="sorteo/index" />
    </Stack>
  );
}
