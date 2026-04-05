import { Stack } from "expo-router";

export default function LayoutBuyer() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
