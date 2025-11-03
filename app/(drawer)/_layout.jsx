import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/theme";
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: Colors.light.primary,
          headerStyle: {
            backgroundColor: Colors.light.primary,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: "transparent",
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowRadius: 0
          },
          headerTintColor: Colors.light.background,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible : false
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Inicio",
            title: "Bienvenido",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
