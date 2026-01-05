import { Redirect, Stack } from 'expo-router';
import { useAuthContext } from "../../context/AuthContext";
export default function RootLayout() {
    const { isLogged } = useAuthContext();
    if (!isLogged) {
        return <Redirect href={"/(auth)/login"} />
    }
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(drawer)' />
        <Stack.Screen name='event' /> 
        <Stack.Screen name='metricas'  />
        <Stack.Screen name='tickets'  />
        <Stack.Screen name='vendedores'  />
    </Stack>
  )
};
