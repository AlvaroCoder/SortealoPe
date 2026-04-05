import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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
import Svg, { Circle } from "react-native-svg";
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
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Event status config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  1: { label: "EN ESPERA", bg: "#FEF3C7", text: "#92400E" },
  2: { label: "ACTIVO", bg: "#D1FAE5", text: "#065F46" },
  3: { label: "FINALIZADO", bg: "#E2E8F0", text: "#475569" },
  4: { label: "PAUSADO", bg: "#FEF3C7", text: "#92400E" },
};
const getStatus = (s) => STATUS_CONFIG[s] ?? STATUS_CONFIG[1];

// ── Circular progress (SVG) ────────────────────────────────────────────────────
const RADIUS = 54;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = 140;
const CENTER = SVG_SIZE / 2;

function CircularProgress({ percent }) {
  const clampedPct = Math.min(Math.max(percent, 0), 100);
  const offset = CIRCUMFERENCE - (clampedPct / 100) * CIRCUMFERENCE;
  return (
    <Svg width={SVG_SIZE} height={SVG_SIZE}>
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={STROKE}
      />
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={GREEN_500}
        strokeWidth={STROKE}
        strokeDasharray={String(CIRCUMFERENCE)}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90, ${CENTER}, ${CENTER})`}
      />
    </Svg>
  );
}

// ── Event card ────────────────────────────────────────────────────────────────
function EventCard({ item }) {
  const router = useRouter();
  const status = getStatus(item.eventStatus ?? item.status ?? 2);
  const sold = item.soldTickets ?? item.ticketsSold ?? 0;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.82}
      onPress={() =>
        router.push({
          pathname: "/(app)/(seller)/events/[id]",
          params: { id: item.id },
        })
      }
    >
      {/* Thumbnail */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.eventThumb}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.eventThumb, styles.eventThumbPlaceholder]}>
          <Ionicons name="ticket-outline" size={22} color={NEUTRAL_200} />
        </View>
      )}

      {/* Info */}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title ?? "Evento"}
        </Text>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar-outline" size={12} color={NEUTRAL_500} />
          <Text style={styles.eventMetaText}>{formattedDate}</Text>
          {item.place ? (
            <>
              <Ionicons
                name="location-outline"
                size={12}
                color={NEUTRAL_500}
                style={{ marginLeft: 8 }}
              />
              <Text style={styles.eventMetaText} numberOfLines={1}>
                {item.place}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Right side */}
      <View style={styles.eventRight}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusBadgeText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
        <Text style={styles.soldCount}>{sold} vendidos</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const router = useRouter();
  const { userData: userStorage } = useAuthContext();
  const userId = userStorage?.userId;

  // User profile
  const { data: profileData } = useFetch(
    userId ? `${ENDPOINTS_USERS.GET_BY_ID}${userId}` : null,
  );

  // Assigned active events (role=SELLER, eventStatus=2)
  const { items, loading, refresh } = usePaginatedFetch(
    userId ? `${ENDPOINTS_EVENTS.GET_BY_USER}?role=SELLER&eventStatus=2` : null,
  );

  // ── Aggregated metrics ─────────────────────────────────────────────────────
  const totalSold = useMemo(
    () =>
      items.reduce((sum, e) => sum + (e.soldTickets ?? e.ticketsSold ?? 0), 0),
    [items],
  );
  const totalTickets = useMemo(
    () =>
      items.reduce(
        (sum, e) => sum + (e.ticketsPerCollection ?? e.totalTickets ?? 0),
        0,
      ),
    [items],
  );
  const percent =
    totalTickets > 0 ? Math.round((totalSold / totalTickets) * 100) : 0;

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
      <View style={styles.userHeader}>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(seller)/profile")}
          activeOpacity={0.8}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userHeaderInfo}>
          <Text style={styles.welcomeLabel}>Bienvenido,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.fullName} numberOfLines={1}>
              {fullName}
            </Text>
            <View style={styles.vendedorBadge}>
              <Text style={styles.vendedorBadgeText}>VENDEDOR</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={22} color={GREEN_900} />
        </TouchableOpacity>
      </View>

      {/* ── Hero card ───────────────────────────────────────────────────── */}
      <View style={styles.heroCard}>
        {/* Decorative dots */}
        <View style={styles.heroDotLarge} />
        <View style={styles.heroDotSmall} />

        <Text style={styles.heroTitle}>Mi colección activa</Text>

        <Text style={styles.heroTickets}>
          <Text style={styles.heroSold}>{totalSold}</Text>
          <Text style={styles.heroTotal}> / {totalTickets} tickets</Text>
        </Text>

        {/* Circular gauge */}
        <View style={styles.gaugeWrap}>
          <CircularProgress percent={percent} />
          <View style={styles.gaugeCenter}>
            <Text style={styles.gaugePercent}>{percent}%</Text>
            <Text style={styles.gaugeLabel}>VENDIDO</Text>
          </View>
        </View>
      </View>

      {/* ── Mini metric cards ────────────────────────────────────────────── */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: GREEN_50 }]}>
            <Ionicons name="ticket-outline" size={18} color={GREEN_900} />
          </View>
          <Text style={styles.metricLabel}>Tickets Vendidos{"\n"}Hoy</Text>
          <Text style={styles.metricValue}>—</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="trending-up-outline" size={18} color="#1E82D9" />
          </View>
          <Text style={styles.metricLabel}>Meta{"\n"}Diaria</Text>
          <Text style={styles.metricValue}>
            {percent > 0 ? `${percent}%` : "—"}
          </Text>
        </View>
      </View>

      {/* ── Section header ──────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eventos Asignados</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/event/asignados")}
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
        renderItem={({ item }) => <EventCard item={item} />}
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
        <Text style={styles.fabText}>Vender ticket</Text>
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

  // ── User header ─────────────────────────────────────────────────────────────
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: WHITE,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  userHeaderInfo: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.normal,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  fullName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  vendedorBadge: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  vendedorBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
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

  // ── Event card ──────────────────────────────────────────────────────────────
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  eventThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    flexShrink: 0,
  },
  eventThumbPlaceholder: {
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    lineHeight: 18,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  eventMetaText: {
    fontSize: 11,
    color: NEUTRAL_500,
  },
  eventRight: {
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  soldCount: {
    fontSize: 11,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── FAB ─────────────────────────────────────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 24,
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
