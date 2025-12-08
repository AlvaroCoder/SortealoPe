import { Stack } from 'expo-router'
import HeaderBackNav from '../../components/common/Navigations/HeaderBackNav'

export default function RootLayout() {
  return (
      <Stack>
          <Stack.Screen
              name='[id]'
              options={{
                  header : ()=> <HeaderBackNav title='Pagina del vendedor' />
              }}
          />
          <Stack.Screen
              name='index'
              options={{
                  header : () => <HeaderBackNav title='Vendedores' />
              }}
          />
          <Stack.Screen
              name='agregar'
              options={{
                    headerShown : false
              }}
          />
          <Stack.Screen
              name='scan/index'
              options={{
                  header : () => <HeaderBackNav title='Escanear QR' />
              }}
          />
    </Stack>
  )
};
