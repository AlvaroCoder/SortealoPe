import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_USERS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useRaffleContext } from "../../../context/RaffleContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const RED_100 = Colors.principal.red[100];
const BLUE_500 = Colors.principal.blue[500];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const ROLE_CONFIG = {
  Administrador: {
    bg: GREEN_500,
    text: GREEN_900,
    icon: "shield-checkmark-outline",
  },
  Vendedor: { bg: BLUE_500, text: WHITE, icon: "storefront-outline" },
  Comprador: { bg: NEUTRAL_700, text: WHITE, icon: "bag-handle-outline" },
};

function ProfileSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ProfileRow({ icon, label, value, last = false }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIconContainer}>
        <Ionicons name={icon} size={18} color={GREEN_900} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function Perfil() {
  const USER_URL = ENDPOINTS_USERS.GET_BY_ID;

  const { userRole } = useRaffleContext();
  const { signout, loading, userData: userStorage } = useAuthContext();
  const router = useRouter();

  const { data: userData, loading: loadingFetch } = useFetch(
    `${USER_URL}${userStorage?.userId}`,
  );

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.username || userData?.email || "Usuario";

  console.log(displayName);

  const initials = (() => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    if (userData?.username) return userData.username[0].toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "?";
  })();

  const roleConfig = ROLE_CONFIG[userRole] ?? ROLE_CONFIG.Comprador;

  const handleLogout = async () => {
    await signout();
    router.replace("/(auth)/login");
  };

  if (loading || loadingFetch) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header banner ───────────────────────────────── */}
        <View style={styles.banner}>
          {/* Decorative circle */}
          <View style={styles.bannerCircle} />

          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.displayName}>{displayName}</Text>

          {userData?.username && userData?.username !== displayName && (
            <Text style={styles.username}>@{userData.username}</Text>
          )}

          <View style={[styles.roleBadge, { backgroundColor: roleConfig.bg }]}>
            <Ionicons
              name={roleConfig.icon}
              size={13}
              color={roleConfig.text}
            />
            <Text style={[styles.roleBadgeText, { color: roleConfig.text }]}>
              {userRole}
            </Text>
          </View>
        </View>

        {/* ── Content cards ────────────────────────────────── */}
        <View style={styles.content}>
          {/* Contact info */}
          <ProfileSection title="Contacto">
            {userData?.email && (
              <ProfileRow
                icon="mail-outline"
                label="Correo electrónico"
                value={userData.email}
              />
            )}
            {userData?.phone ? (
              <ProfileRow
                icon="call-outline"
                label="Teléfono"
                value={userData.phone}
                last
              />
            ) : (
              userData?.email && <View style={styles.rowLast} />
            )}
          </ProfileSection>

          {/* Account info */}
          <ProfileSection title="Cuenta">
            <ProfileRow
              icon="notifications-outline"
              label="Notificaciones"
              value="Activadas"
              last
            />
          </ProfileSection>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={20} color={RED_500} />
            </View>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={RED_500}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Banner ──────────────────────────────────────────────
  banner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 36,
    overflow: "hidden",
  },
  bannerCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: GREEN_700,
    opacity: 0.25,
    top: -80,
    right: -60,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },
  displayName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 4,
  },
  username: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },

  // ── Content area ────────────────────────────────────────
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },

  // ── Section ─────────────────────────────────────────────
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Row ─────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 14,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Logout ──────────────────────────────────────────────
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: RED_100,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: RED_100,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: RED_500,
  },
});
