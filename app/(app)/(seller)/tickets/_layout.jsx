import { Stack } from "expo-router";

export default function RootLayoutTicket() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="vender" />
      <Stack.Screen name="confirmar" />
    </Stack>
  );
}
