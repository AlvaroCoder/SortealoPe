import { Redirect, Stack } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../../context/AuthContext";
export default function RootLayout() {
  const { accessToken } = useAuthContext();
  const decodeToken = accessToken ? jwtDecode(accessToken) : null;

  const timeExpire = decodeToken ? decodeToken.exp * 1000 : null;
  const currentTime = Date.now();

  if (timeExpire && currentTime > timeExpire) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(seller)" />
      <Stack.Screen name="(buyer)" />
      <Stack.Screen name="event/subirImagen" />
      <Stack.Screen name="tickets/claim" />
    </Stack>
  );
}
