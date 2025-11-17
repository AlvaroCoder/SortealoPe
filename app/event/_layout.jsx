import { Stack } from "expo-router";
import HeaderBackNav from "../../components/common/Navigations/HeaderBackNav";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{
          header : () => <HeaderBackNav title="Registrar Evento" />,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          header : () => <HeaderBackNav title="Pago" />
        }}
      />
    </Stack>
  );
}
