import { Redirect, Stack } from 'expo-router';
import { useAuthContext } from "../../context/AuthContext";
export default function RootLayout() {
    const { isLogged } = useAuthContext();
    if (!isLogged) {
        return <Redirect href={"/(auth)/login"} />
    }
  return (
      <Stack>
          <Stack.Screen name='(drawer)' options={{headerShown : false}}/>
          <Stack.Screen name='event' options={{headerShown : false}}/> 
          <Stack.Screen name='metricas' options={{headerShown : false}} />
          <Stack.Screen name='tickets' options={{headerShown : false}} />
          <Stack.Screen name='vendedores' options={{headerShown : false}} />
    </Stack>
  )
};
