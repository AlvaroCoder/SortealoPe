import { Stack } from "expo-router";

export default function RootLayoutEvents() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
