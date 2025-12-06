import { Stack } from 'expo-router'
import HeaderBackNav from '../../../components/common/Navigations/HeaderBackNav'

export default function RootLayout() {
  return (
      <Stack>
          <Stack.Screen
              name='index'
              options={{
                  header : ()=>< HeaderBackNav title='Metricas vendedor'/>
              }}
          />
                    <Stack.Screen
              name='tickets-faltantes'
              options={{
                  header : ()=>< HeaderBackNav title='Tickets Faltantes'/>
              }}
          />
                    <Stack.Screen
              name='tickets-vendidos'
              options={{
                  header : ()=>< HeaderBackNav title='Tickets Vendidos'/>
              }}
          />
    </Stack>
  )
};