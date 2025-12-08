import { Stack } from 'expo-router'
import HeaderBackNav from '../../../components/common/Navigations/HeaderBackNav'

export default function RootLayout() {
  return (
      <Stack>
          <Stack.Screen
              name='index'
              options={{
                header : () => <HeaderBackNav title='Agregar Vendedor' />
              }}
          />
    </Stack>
  )
};