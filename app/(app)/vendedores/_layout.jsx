import { Stack } from "expo-router";
import HeaderBackNav from "../../../components/common/Navigations/HeaderBackNav";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HeaderBackNav title="Vendedores" />,
        }}
      />
      <Stack.Screen
        name="metrics/[id]"
        options={{
          header: () => <HeaderBackNav title="Metricas de Vendedor" />,
        }}
      />
      <Stack.Screen
        name="agregar"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="scan/index"
        options={{
          header: () => <HeaderBackNav title="Escanear QR" />,
        }}
      />
      <Stack.Screen
        name="event/[id]"
        options={{
          header: () => <HeaderBackNav title="Vendedores del evento" />,
        }}
      />
    </Stack>
  );
}
