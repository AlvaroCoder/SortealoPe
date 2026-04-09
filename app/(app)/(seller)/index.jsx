import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCardAsigned from "../../../components/cards/EventCardAsigned";
import ActiveColectionCard from "../../../components/common/Card/ActiveColectionCard";
import HeaderBarCard from "../../../components/common/Card/HeaderBarCard";
import {
  ENDPOINTS_EVENTS,
  ENDPOINTS_USERS,
} from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import { usePaginatedFetch } from "../../../lib/usePaginatedFetch";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const router = useRouter();
  const { userData: userStorage } = useAuthContext();
  const userId = userStorage?.userId;

  // User profile
  const { data: profileData } = useFetch(
    userId ? `${ENDPOINTS_USERS.GET_BY_ID}${userId}` : null,
  );

  const { items, loading, refresh } = usePaginatedFetch(
    userId ? `${ENDPOINTS_EVENTS.GET_BY_USER}?role=SELLER&eventStatus=2` : null,
  );

  // ── Display name ───────────────────────────────────────────────────────────
  const firstName =
    profileData?.firstName ??
    userStorage?.firstName ??
    userStorage?.name ??
    "Vendedor";
  const lastName = profileData?.lastName ?? userStorage?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const avatarUri = profileData?.photo ?? userStorage?.photo ?? null;
  const initials = (firstName[0] ?? "V").toUpperCase();

  // ── Header component (everything above the event list) ────────────────────
  const renderHeader = () => (
    <View>
      {/* ── User header ─────────────────────────────────────────────────── */}
      <HeaderBarCard
        avatarUri={avatarUri}
        initials={initials}
        fullName={fullName}
        role={"VENDEDOR"}
      />

      <ActiveColectionCard items={items} />

      {/* ── Section header ──────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eventos Asignados</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(seller)/events")}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLink}>Ver todos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading)
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_500} />
        </View>
      );
    return (
      <View style={styles.centered}>
        <Image
          source={{ uri: URL_IMAGEN }}
          style={{ width: 80, height: 120 }}
        />
        <Text style={styles.emptyText}>
          No tienes eventos activos asignados
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} edges={["top"]} />

      <FlatList
        data={items}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={({ item }) => {
          if (item?.host?.id !== userId) {
            // Extra guard to only show events where user is host{
            return <EventCardAsigned item={item} userId={userId} />;
          }
          return null;
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length === 0}
            onRefresh={refresh}
            tintColor={GREEN_500}
          />
        }
      />

      {/* ── FAB: Vender ticket ────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(app)/(seller)/scan")}
      >
        <Ionicons name="qr-code-outline" size={20} color={WHITE} />
        <Text style={styles.fabText}>Unirse a Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  safeTop: {
    backgroundColor: WHITE,
  },
  listContent: {
    paddingBottom: 100,
  },

  // ── Hero card ───────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: GREEN_900,
    margin: 16,
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
  },
  heroDotLarge: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GREEN_700,
    opacity: 0.3,
    right: -30,
    top: -30,
  },
  heroDotSmall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GREEN_700,
    opacity: 0.2,
    right: 60,
    bottom: -20,
  },
  heroTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
    marginBottom: 16,
  },
  heroTickets: {
    marginBottom: 20,
  },
  heroSold: {
    fontSize: 40,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
  },
  heroTotal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: "rgba(255,255,255,0.7)",
  },
  gaugeWrap: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  gaugeCenter: {
    position: "absolute",
    alignItems: "center",
  },
  gaugePercent: {
    fontSize: 26,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 30,
  },
  gaugeLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
  },

  // ── Metrics row ─────────────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
    lineHeight: 16,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Section header ──────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  sectionLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_500,
  },

  // ── FAB ─────────────────────────────────────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 45,
    right: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: GREEN_500,
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
  },

  // ── States ──────────────────────────────────────────────────────────────────
  centered: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
  },
});
