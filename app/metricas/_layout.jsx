import { Stack } from "expo-router";
import HeaderBackNav from "../../components/common/Navigations/HeaderBackNav";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="comprador/index"
        options={{
          header: () => <HeaderBackNav title="Metrica de comprador" />,
        }}
      />
      <Stack.Screen
        name="eventos/index"
        options={{
          header: () => <HeaderBackNav title="Metrica de eventos" />,
        }}
      />
      <Stack.Screen
        name="vendedor/index"
        options={{
          header: () => <HeaderBackNav title="Metrica de vendedores" />,
        }}
      />
    </Stack>
  );
}
