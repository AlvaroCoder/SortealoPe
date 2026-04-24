import { Redirect, Stack } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../../context/AuthContext";
export default function RootLayout() {
  const { accessToken, loading } = useAuthContext();

  // Esperar a que AuthContext termine de leer el token antes de decidir
  if (loading) return null;

  // Sin token → login
  if (!accessToken) {
    return <Redirect href={"/(auth)/login"} />;
  }

  const decodeToken = jwtDecode(accessToken);
  const timeExpire = decodeToken?.exp ? decodeToken.exp * 1000 : null;
  const currentTime = Date.now();

  // Token expirado → login
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
      <Stack.Screen name="profile" />
    </Stack>
  );
}
