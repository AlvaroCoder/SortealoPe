// app/(app)/(admin)/_layout.jsx
import HeaderBackNav from "@/components/common/Navigations/HeaderBackNav";
import { useRaffleContext } from "@/context/RaffleContext";
import { Redirect, Stack } from "expo-router";

export default function AdminLayout() {
  const { isAdmin, roleLoading } = useRaffleContext();

  // Espera a que el rol se restaure desde AsyncStorage
  if (roleLoading) return null;

  // Guard: si alguien intenta entrar a /admin sin ser admin, lo redirige
  if (!isAdmin) return <Redirect href="/(auth)/welcome" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tab)" />
      <Stack.Screen name="events" />
      <Stack.Screen
        name="events/[id]"
        options={{
          header: () => <HeaderBackNav title="Detalle del Evento" />,
          headerShown: true,
        }}
      />
      <Stack.Screen name="vendedores/index" />
      <Stack.Screen name="vendedores/[id]" />
    </Stack>
  );
}