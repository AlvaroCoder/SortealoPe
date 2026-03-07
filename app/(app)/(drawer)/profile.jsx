import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileRow from "../../../components/cards/ProfileRow";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useRaffleContext } from "../../../context/RaffleContext";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

export default function Perfil() {
  const { userRole } = useRaffleContext();
  const { signout, loading, userData } = useAuthContext();
  const router = useRouter();

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.username || userData?.email || "Usuario";

  const handleLogout = async () => {
    await signout();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {loading && <LoadingScreen />}

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color={WHITE} />
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userRole}>Modo Actual: {userRole}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de Contacto</Text>
        {userData?.email && (
          <ProfileRow
            icon="mail-outline"
            label="Correo Electrónico"
            value={userData.email}
          />
        )}
        {userData?.phone && (
          <ProfileRow
            icon="call-outline"
            label="Teléfono"
            value={userData.phone}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajustes y Preferencias</Text>
        <ProfileRow
          icon="notifications-outline"
          label="Notificaciones"
          value="Activadas"
        />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={WHITE} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 30,
    backgroundColor: Colors.principal.green[50],
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: GREEN_500,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  userRole: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.principal.green[200],
    paddingBottom: 5,
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: RED_500,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: WHITE,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
});
