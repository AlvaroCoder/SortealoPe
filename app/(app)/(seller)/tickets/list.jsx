import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { usePaginatedFetch } from "../../../../lib/usePaginatedFetch";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  1: { label: "Disponible",  bg: "#F0FDF4", text: "#16A34A" },
  2: { label: "Reservado",   bg: "#EFF6FF", text: "#1D4ED8" },
  3: { label: "En espera",   bg: "#FFFBEB", text: "#B45309" },
  4: { label: "Vendido",     bg: "#F0FDF4", text: "#15803D" },
};

// ── Ticket row ────────────────────────────────────────────────────────────────
function TicketRow({ ticket, accentColor }) {
  const statusId = ticket?.ticketStatus?.id ?? ticket?.status ?? 0;
  const cfg = STATUS_CONFIG[statusId] ?? { label: "—", bg: NEUTRAL_50, text: NEUTRAL_500 };

  // Format code for readability: show last 8 chars grouped as XXXX-XXXX
  const rawCode = ticket?.code ?? "—";
  const shortCode =
    rawCode.length >= 8
      ? `${rawCode.slice(-8, -4)}-${rawCode.slice(-4)}`
      : rawCode;

  const serial = ticket?.serialNumber ?? ticket?.serial ?? "—";

  return (
    <View style={styles.row}>
      {/* Left accent bar */}
      <View style={[styles.rowAccent, { backgroundColor: accentColor }]} />

      <View style={styles.rowBody}>
        {/* Serial + code */}
        <View style={styles.rowMain}>
          <View>
            <Text style={styles.rowSerial}>#{serial}</Text>
            <Text style={styles.rowCode}>{shortCode.toUpperCase()}</Text>
          </View>
          {/* Status pill */}
          <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusText, { color: cfg.text }]}>
              {cfg.label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function TicketListScreen() {
  const router = useRouter();
  const { eventId, collectionId, ticketStatus, statusLabel, accentColor } =
    useLocalSearchParams();

  const baseUrl =
    eventId && collectionId && ticketStatus
      ? `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=${ticketStatus}`
      : null;

  const { items: tickets, loading, hasMore, totalElements, fetched, loadMore, refresh } =
    usePaginatedFetch(baseUrl);

  const accent = accentColor ?? "#16CD91";

  // ── Header ────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.totalLabel}>
        {totalElements} ticket{totalElements !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading && !fetched) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
        <Text style={styles.emptyTitle}>Sin tickets</Text>
        <Text style={styles.emptySubtitle}>
          No hay tickets con estado "{statusLabel}" en este evento.
        </Text>
      </View>
    );
  };

  // ── Footer (load more spinner) ─────────────────────────────────────────────
  const renderFooter = () => {
    if (!hasMore || !loading) return null;
    return (
      <View style={styles.footerSpinner}>
        <ActivityIndicator size="small" color={GREEN_900} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* ── Top bar ── */}
      <SafeAreaView style={[styles.topBar, { borderBottomColor: accent + "40" }]} edges={["top"]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <Text style={styles.screenTitle}>Tickets</Text>
          {/* Colored status badge */}
          <View style={[styles.statusBadge, { backgroundColor: accent + "20" }]}>
            <View style={[styles.statusDot, { backgroundColor: accent }]} />
            <Text style={[styles.statusBadgeText, { color: accent }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.backBtnSpacer} />
      </SafeAreaView>

      {/* ── List ── */}
      <FlatList
        data={tickets}
        keyExtractor={(item, idx) => item?.code ?? String(idx)}
        renderItem={({ item }) => (
          <TicketRow ticket={item} accentColor={accent} />
        )}
        ListHeaderComponent={fetched ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={loading && fetched}
            onRefresh={refresh}
            colors={[GREEN_900]}
            tintColor={GREEN_900}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          tickets.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* ── Initial loading overlay ── */}
      {loading && !fetched && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={GREEN_900} />
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnSpacer: {
    width: 40,
  },
  titleArea: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  screenTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listContentEmpty: {
    flex: 1,
  },
  listHeader: {
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  separator: {
    height: 8,
  },

  // Ticket row
  row: {
    flexDirection: "row",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
  },
  rowAccent: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  rowBody: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowSerial: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  rowCode: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
    letterSpacing: 1,
  },

  // Status pill
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },

  // Footer / loading
  footerSpinner: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
});