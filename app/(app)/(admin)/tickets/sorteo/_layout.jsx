import { Stack } from "expo-router";

export default function RootLayoutSorteo() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="simular" />
      <Stack.Screen name="ejecutar" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
