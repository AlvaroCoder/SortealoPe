import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RaffleProvider } from '../context/RaffleContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <RaffleProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name='(auth)' options={{ headerShown : false }} />
          <Stack.Screen name='(drawer)' options={{ headerShown : false }}  />
          <Stack.Screen name='event' options={{ headerShown: false }} />
          <Stack.Screen name='tickets' options={{ headerShown: false }} />
          <Stack.Screen name='metricas' options={{ headerShown : false}} />
          <Stack.Screen name='vendedores' options={{ headerShown : false }}/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RaffleProvider>
  );
}