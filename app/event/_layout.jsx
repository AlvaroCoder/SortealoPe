import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{
          title: "Nuevo Evento",
        }}
      />
    </Stack>
  );
}
