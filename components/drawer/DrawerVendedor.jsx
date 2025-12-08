import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useRaffleContext } from "../../context/RaffleContext";
import ButtonProfileDrawer from "../common/Buttons/ButtonProfileDrawer";

const GREEN_500 = Colors.principal.green[500];
const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_100 = Colors.principal.neutral[100];
const URL_IMAGEN_MASCOTA =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

export default function DrawerVendedorContent(props) {
  const { navigation } = props;
  const { userRole } =
    useRaffleContext();

  const router = useRouter();

  const userName = "Vendedor Estrella";

  const handleProfilePress = () => {
    navigation.navigate("profile");
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={{ uri: URL_IMAGEN_MASCOTA }}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.appName}>SORTEALOPE</Text>
        <Text style={styles.appTagline}>Panel Vendedor</Text>
      </View>

      <View style={styles.navigationSection}>

        <Text style={styles.sectionTitle}>GESTION DE EVENTOS</Text>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("event/")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="pricetags-outline" size={22} color={GREEN_900} />
          </View>
          <Text style={styles.navLabel}>Eventos asignados</Text>
        </TouchableOpacity>

        
      </View>

      <View style={styles.profileSection}>
        <ButtonProfileDrawer
          userName={userName}
          userRole={userRole}
          onPress={handleProfilePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: GREEN_50,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: NEUTRAL_100,
    overflow: "hidden",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: GREEN_900,
    textAlign: "center",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: GREEN_500,
    textAlign: "center",
    fontWeight: "500",
  },
  navigationSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    // 🟢 Título de Sección en Verde Oscuro
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
    // 🟢 Fondo de Icono en Verde Muy Claro
    backgroundColor: Colors.principal.green[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: "600",
    // 🟢 Texto de Navegación en Verde Oscuro
    color: GREEN_900,
  },
  profileSection: {
    marginTop: "auto",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
    backgroundColor: WHITE,
  },
  roleSwitchTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: NEUTRAL_700,
    marginTop: 10,
    marginBottom: 5,
  },
  roleSwitchPlaceholder: {
    padding: 10,
    backgroundColor: Colors.principal.red[100],
    borderRadius: 8,
    marginTop: 5,
  },
  roleSwitchPlaceholderText: {
    color: Colors.principal.red[900],
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 16,
    marginHorizontal: 16,
  },
});
