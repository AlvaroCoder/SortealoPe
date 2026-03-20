import { Stack } from "expo-router";
import HeaderBackNav from "../../../components/common/Navigations/HeaderBackNav";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="complete"
        options={{ header: () => <HeaderBackNav title="Completar Perfil" /> }}
      />
    </Stack>
  );
}
