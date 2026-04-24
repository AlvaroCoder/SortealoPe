import { Redirect, Stack } from "expo-router";
import { useAuthContext } from "../../../context/AuthContext";

export default function AdminLayout() {
  const { isLogged } = useAuthContext();

  if (!isLogged) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tab)" />
      <Stack.Screen name="events" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="vendedores" />
    </Stack>
  );
}
