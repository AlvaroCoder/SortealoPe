// app/(app)/(admin)/_layout.jsx
import { useRaffleContext } from "@/context/RaffleContext";
import { Redirect, Stack, useRouter } from "expo-router";

export default function AdminLayout() {
  const { isAdmin, roleLoading } = useRaffleContext();
  const router = useRouter();

  // Espera a que el rol se restaure desde AsyncStorage
  if (roleLoading) return null;

  // Guard: si alguien intenta entrar a /admin sin ser admin, lo redirige
  if (!isAdmin) return <Redirect href="/(auth)/welcome" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tab)" />
      <Stack.Screen name="events" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="vendedores" />
    </Stack>
  );
}
