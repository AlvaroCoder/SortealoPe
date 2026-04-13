import { Stack } from "expo-router";

export default function LayoutTickets() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="vender" />
      <Stack.Screen name="confirmar" />
      <Stack.Screen name="ingresarDatosVenta" />
      <Stack.Screen name="exitoConfirmar" />
      <Stack.Screen name="sortear" />
    </Stack>
  );
}
