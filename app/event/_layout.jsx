import { Stack } from "expo-router";
import HeaderBackNav from "../../components/common/Navigations/HeaderBackNav";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{
          header : () => <HeaderBackNav title="Registrar Evento" />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          header : ()=><HeaderBackNav title="Evento" />
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          header : ()=><HeaderBackNav title="Editar evento"/>
        }}
      />

      <Stack.Screen
        name="mis-eventos/vendedor"
        options={{
          header : ()=><HeaderBackNav title="Mis Eventos" />
        }}
      />
    </Stack>
  );
}
