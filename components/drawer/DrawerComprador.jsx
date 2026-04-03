import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import { useRaffleContext } from "../../context/RaffleContext";
import ButtonProfileDrawer from "../common/Buttons/ButtonProfileDrawer";
import DrawerHeader from "./_DrawerHeader";

const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];

const NAV_ITEMS = [
  { route: "/(app)/tickets", icon: "receipt-outline", label: "Mis Tickets" },
];

export default function DrawerCompradorContent({ navigation }) {
  const router = useRouter();
  const { userData, signout } = useAuthContext();
  const { userRole } = useRaffleContext();
  const userName = userData?.username || userData?.email || "Comprador";

  const handleSignout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          navigation.closeDrawer();
          await signout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const navigate = (route) => {
    router.push(route);
    navigation.closeDrawer();
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerHeader tagline="Panel Comprador" />

      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>INFORMACIÓN</Text>
        {NAV_ITEMS.map(({ route, icon, label }) => (
          <TouchableOpacity
            key={route}
            style={styles.navItem}
            onPress={() => navigate(route)}
          >
            <View style={styles.navIconContainer}>
              <Ionicons name={icon} size={22} color={GREEN_900} />
            </View>
            <Text style={styles.navLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.profileSection}>
        <ButtonProfileDrawer
          userName={userName}
          userRole={userRole}
          onPress={() => navigation.navigate("profile")}
        />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignout}>
          <Ionicons name="log-out-outline" size={20} color="#D52941" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: WHITE },
  navigationSection: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN_900,
    marginBottom: 16,
    marginLeft: 16,
    letterSpacing: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.principal.green[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  navLabel: { fontSize: 16, fontWeight: "600", color: GREEN_900 },
  profileSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
    backgroundColor: WHITE,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FFF0F2",
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#D52941" },
});
