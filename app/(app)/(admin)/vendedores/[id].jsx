import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ENDPOINTS_EVENTS,
    ENDPOINTS_TICKETS,
    ENDPOINTS_USERS,
} from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

// ── Color tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png";

// ── Money formatter ───────────────────────────────────────────────────────────
function formatMoney(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `S/.${n.toFixed(0)}`;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AdminVendedorDetailPage() {
  const router = useRouter();
  const {
    id: vendorId,
    eventId,
    collectionId,
    eventStatus,
  } = useLocalSearchParams();

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: vendor, loading: loadingVendor } = useFetch(
    `${ENDPOINTS_USERS.GET_BY_ID}${vendorId}`,
  );

  const { data: event, loading: loadingEvent } = useFetch(
    `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=${eventStatus ?? 2}`,
  );

  const { data: ticketsPage, loading: loadingTickets } = useFetch(
    collectionId
      ? `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=3&page=0&size=200`
      : null,
  );

  const tickets = useMemo(
    () =>
      Array.isArray(ticketsPage) ? ticketsPage : (ticketsPage?.content ?? []),
    [ticketsPage],
  );

  // ── Vendor display info ────────────────────────────────────────────────────
  const displayName = useMemo(() => {
    if (vendor?.firstName && vendor?.lastName) {
      return `${vendor.firstName} ${vendor.lastName}`;
    }
    return vendor?.username ?? vendor?.email ?? "Vendedor";
  }, [vendor]);

  const initials = useMemo(() => {
    if (vendor?.firstName && vendor?.lastName) {
      return `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();
    }
    if (vendor?.username) return vendor.username[0].toUpperCase();
    if (vendor?.email) return vendor.email[0].toUpperCase();
    return "?";
  }, [vendor]);

  // ── Collection metrics ─────────────────────────────────────────────────────
  const {
    soldTickets,
    reservedTickets,
    availableTickets,
    totalTickets,
    ticketPrice,
  } = useMemo(() => {
    const ticketPrice = event?.ticketPrice ?? 0;
    const col = event?.collections?.find(
      (c) =>
        String(c.id) === String(collectionId) ||
        String(c.seller?.id) === String(vendorId),
    );
    const sold = col?.soldTickets ?? 0;
    const reserved = col?.reservedTickets ?? 0;
    const available = col?.availableTickets ?? 0;
    return {
      soldTickets: sold,
      reservedTickets: reserved,
      availableTickets: available,
      totalTickets: sold + reserved + available,
      ticketPrice,
    };
  }, [event, collectionId, vendorId]);

  const revenue = soldTickets * ticketPrice;
  const progress = totalTickets > 0 ? soldTickets / totalTickets : 0;

  const loading = loadingVendor || loadingEvent || loadingTickets;

  if (loading) return <LoadingScreen />;

  // ── Sub-renders ────────────────────────────────────────────────────────────

  function renderListHeader() {
    return (
      <View>
        {/* ── Top nav bar ──────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={GREEN_900} />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>Detalle del Vendedor</Text>
            <Text style={styles.topBarSubtitle} numberOfLines={1}>
              {event?.title ?? "—"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.navBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={22} color={GREEN_900} />
          </TouchableOpacity>
        </View>

        {/* ── Vendor hero banner ────────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={styles.bannerCircle} />

          {/* Avatar */}
          <View style={styles.avatarRing}>
            {vendor?.photo ? (
              <Image
                source={{ uri: vendor.photo }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>

          <Text style={styles.vendorName}>{displayName}</Text>

          {vendor?.username && vendor.username !== displayName && (
            <Text style={styles.vendorUsername}>@{vendor.username}</Text>
          )}
          {vendor?.email && (
            <Text style={styles.vendorEmail}>{vendor.email}</Text>
          )}

          <View style={styles.roleBadge}>
            <Ionicons name="storefront-outline" size={13} color={WHITE} />
            <Text style={styles.roleBadgeText}>Vendedor</Text>
          </View>
        </View>

        {/* ── Revenue card ─────────────────────────────────────────── */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueCardCircle} />
          <Text style={styles.revenueLabel}>TOTAL RECAUDADO</Text>
          <Text style={styles.revenueAmount}>{formatMoney(revenue)}</Text>
          <Ionicons
            name="wallet-outline"
            size={80}
            color="rgba(255,255,255,0.07)"
            style={styles.revenueDecorIcon}
          />
          {/* Progress mini bar */}
          <View style={styles.revenueMiniBarBg}>
            <View
              style={[
                styles.revenueMiniBarFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.revenueSubtext}>
            {soldTickets} de {totalTickets} tickets vendidos
          </Text>
        </View>

        {/* ── Metric cards ─────────────────────────────────────────── */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View
              style={[styles.metricIcon, { backgroundColor: GREEN_500 + "22" }]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={GREEN_500}
              />
            </View>
            <Text style={[styles.metricValue, { color: GREEN_500 }]}>
              {soldTickets}
            </Text>
            <Text style={styles.metricLabel}>Vendidos</Text>
          </View>
          <View style={styles.metricCard}>
            <View
              style={[styles.metricIcon, { backgroundColor: BLUE_500 + "22" }]}
            >
              <Ionicons name="time-outline" size={20} color={BLUE_500} />
            </View>
            <Text style={[styles.metricValue, { color: BLUE_500 }]}>
              {reservedTickets}
            </Text>
            <Text style={styles.metricLabel}>En espera</Text>
          </View>
          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIcon,
                { backgroundColor: NEUTRAL_400 + "22" },
              ]}
            >
              <Ionicons name="ticket-outline" size={20} color={NEUTRAL_700} />
            </View>
            <Text style={[styles.metricValue, { color: NEUTRAL_700 }]}>
              {availableTickets}
            </Text>
            <Text style={styles.metricLabel}>Disponibles</Text>
          </View>
        </View>

        {/* ── Tickets vendidos section header ───────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tickets Vendidos</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{tickets.length}</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderTicket({ item: ticket, index }) {
    const shortCode = ticket.code?.slice(-8).toUpperCase() ?? "——";
    return (
      <View style={styles.ticketRow}>
        <View style={styles.ticketNumBadge}>
          <Text style={styles.ticketNum}>{index + 1}</Text>
        </View>
        <View style={styles.ticketIcon}>
          <Ionicons name="ticket-outline" size={18} color={GREEN_900} />
        </View>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketCode}>#{shortCode}</Text>
          <Text style={styles.ticketCodeFull} numberOfLines={1}>
            {ticket.code}
          </Text>
        </View>
        <View style={styles.ticketStatusChip}>
          <Text style={styles.ticketStatusText}>VENDIDO</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <FlatList
        data={tickets}
        keyExtractor={(item, i) => String(item.id ?? item.code ?? i)}
        renderItem={renderTicket}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image source={{ uri: URL_IMAGEN }} style={{ width: 80, height: 120 }} cachePolicy="memory-disk" />
            <Text style={styles.emptyTitle}>Sin tickets vendidos</Text>
            <Text style={styles.emptySubtitle}>
              Aún no se han registrado ventas para este vendedor.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  listContent: {
    paddingBottom: 32,
  },

  // ── Top nav bar ────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  topBarSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 1,
  },

  // ── Vendor hero banner ─────────────────────────────────────────────────────
  banner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    overflow: "hidden",
  },
  bannerCircle: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: GREEN_700,
    opacity: 0.22,
    top: -80,
    right: -50,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  avatarFallback: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },
  vendorName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 2,
  },
  vendorUsername: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 2,
  },
  vendorEmail: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    opacity: 0.8,
    marginBottom: 10,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: BLUE_500,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Revenue card ────────────────────────────────────────────────────────────
  revenueCard: {
    backgroundColor: GREEN_900,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  revenueCardCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GREEN_700,
    opacity: 0.22,
    top: -60,
    right: -40,
  },
  revenueDecorIcon: {
    position: "absolute",
    bottom: -10,
    right: 12,
  },
  revenueLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.60)",
    marginBottom: 6,
  },
  revenueAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 14,
  },
  revenueMiniBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  revenueMiniBarFill: {
    height: 6,
    backgroundColor: GREEN_500,
    borderRadius: 3,
  },
  revenueSubtext: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.65)",
    fontWeight: Typography.weights.medium,
  },

  // ── Metrics row ────────────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 4,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  // ── Section header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  sectionBadge: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Ticket row ─────────────────────────────────────────────────────────────
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  ticketNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ticketNum: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
  },
  ticketIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: GREEN_500 + "40",
  },
  ticketInfo: {
    flex: 1,
  },
  ticketCode: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  ticketCodeFull: {
    fontSize: 10,
    color: NEUTRAL_400,
    marginTop: 1,
    fontFamily: "monospace",
  },
  ticketStatusChip: {
    backgroundColor: GREEN_500 + "22",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GREEN_500 + "55",
    flexShrink: 0,
  },
  ticketStatusText: {
    fontSize: 9,
    fontWeight: "800",
    color: GREEN_700,
    letterSpacing: 0.4,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyBox: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
    textAlign: "center",
    lineHeight: 20,
  },
});
