import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ENDPOINTS_USERS } from "../../Connections/APIURLS";
import { Colors, Typography } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import { useFetch } from "../../lib/useFetch";

const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

const NAV_ITEMS = [
  {
    route: "/(app)/(drawer)/home",
    icon: "home-outline",
    label: "Inicio",
  },
  {
    route: "/(app)/event/asignados",
    icon: "calendar-outline",
    label: "Eventos Asignados",
  },
  {
    route: "/(app)/metricas/eventos",
    icon: "analytics-outline",
    label: "Métricas",
  },
  {
    route: "/(app)/vendedores/scan",
    icon: "qr-code-outline",
    label: "Escanear QR",
  },
];

export default function DrawerContent({ navigation }) {
  const router = useRouter();
  const { userData: authData } = useAuthContext();
  const { top: topInset } = useSafeAreaInsets();

  const { data: userData } = useFetch(
    authData?.userId ? `${ENDPOINTS_USERS.GET_BY_ID}${authData.userId}` : null,
  );

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.username || userData?.email || "Usuario";

  const initials = (() => {
    if (userData?.firstName && userData?.lastName)
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "?";
  })();

  // El campo de foto en UserDto es "photo" (URL Cloudinary)
  const profileImage = userData?.photo ?? null;

  const navigate = (route) => {
    router.push(route);
    navigation.closeDrawer();
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      {/* ── Header: user profile ──────────────────────────── */}
      <TouchableOpacity
        style={[styles.header, { paddingTop: topInset + 20 }]}
        onPress={() => {
          navigation.navigate("profile");
          navigation.closeDrawer();
        }}
        activeOpacity={0.85}
      >
        {/* Decorative circle */}
        <View style={styles.headerCircle} />

        <View style={styles.avatarRing}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {userData?.email || ""}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={GREEN_500} />
      </TouchableOpacity>

      {/* ── Navigation items ──────────────────────────────── */}
      <View style={styles.nav}>
        <Text style={styles.navSectionLabel}>MENÚ PRINCIPAL</Text>
        {NAV_ITEMS.map(({ route, icon, label }) => (
          <TouchableOpacity
            key={route}
            style={styles.navItem}
            onPress={() => navigate(route)}
            activeOpacity={0.75}
          >
            <View style={styles.navIconBox}>
              <Ionicons name={icon} size={20} color={GREEN_900} />
            </View>
            <Text style={styles.navLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Footer ───────────────────────────────────────── */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerBrand}>SORTEALOPE</Text>
        <Text style={styles.footerTagline}>por COSAI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_900,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
    overflow: "hidden",
  },
  headerCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GREEN_700,
    opacity: 0.2,
    top: -80,
    right: -40,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: GREEN_500,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 52,
    height: 52,
  },
  avatarInitials: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: Typography.sizes.xs,
    color: GREEN_100,
    opacity: 0.85,
  },

  // ── Navigation ──────────────────────────────────────────
  nav: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  navSectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
    gap: 14,
  },
  navIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 16,
  },
  footerBrand: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 1.5,
  },
  footerTagline: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 2,
  },
});
