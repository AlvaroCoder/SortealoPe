import { Stack } from "expo-router";

export default function LayoutVendedoresAdmin() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="agregar" />
      <Stack.Screen name="list" />
    </Stack>
  );
}
