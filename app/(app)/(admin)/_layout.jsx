// app/(app)/(admin)/_layout.jsx
import HeaderBackNav from "@/components/common/Navigations/HeaderBackNav";
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
      <Stack.Screen
        name="events/[id]"
        options={({ route }) => ({
          header: () => (
            <HeaderBackNav
              title="Detalle del Evento"
              rightIcon="settings-outline"
              onPressRight={() =>
                router.push({
                  pathname: "/(app)/(admin)/events/edit",
                  params: {
                    id: route.params?.id,
                    eventStatus: route.params?.eventStatus,
                  },
                })
              }
            />
          ),
          headerShown: true,
        })}
      />
      <Stack.Screen name="events/create" />
      <Stack.Screen name="events/edit" />
      <Stack.Screen name="vendedores/index" />
      <Stack.Screen name="vendedores/[id]" />
      <Stack.Screen name="vendedores/agregar" />
      <Stack.Screen name="tickets/index" />
    </Stack>
  );
}
