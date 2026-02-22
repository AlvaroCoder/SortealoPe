import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        // Fondo del TabBar
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 8,
        },

        // Texto
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
        },

        // Colores activo/inactivo
        tabBarActiveTintColor: "#0f3d2e", // Verde oscuro
        tabBarInactiveTintColor: "#9ca3af",

        // Iconos dinámicos
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "history") {
            iconName = focused ? "time" : "time-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Mis Eventos",
        }}
      />
    </Tabs>
  );
}
