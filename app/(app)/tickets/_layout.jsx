import { Stack } from "expo-router";
import HeaderBackNav from "../../../components/common/Navigations/HeaderBackNav";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header : () => <HeaderBackNav title="Principal" />
        }}
      />
      <Stack.Screen
        name="sell/[id]"
        options={{
          header: () => <HeaderBackNav title="Vender Tickets" />,
        }}
      />
      <Stack.Screen
        name="vendedor/sell/[id]"
        options={{
          header: () => <HeaderBackNav title="Vender Tickets" />,
        }}
      />
      <Stack.Screen
        name="claim"
        options={{
          header: () => <HeaderBackNav title="Mis Tickets" />,
        }}
      />
      <Stack.Screen
        name="scan/index"
        options={{
          header: () => <HeaderBackNav title="Escanear QR" />,
        }}
      />
    </Stack>
  );
}
