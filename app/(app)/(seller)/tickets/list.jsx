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
import ReservationRow from "../../../../components/cards/ReservationRow";
import TicketRow from "../../../../components/cards/TicketRow";
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { usePaginatedFetch } from "../../../../lib/usePaginatedFetch";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ── Main screen ───────────────────────────────────────────────────────────────
export default function TicketListScreen() {
  const router = useRouter();
  const {
    eventId,
    collectionId,
    ticketStatus,
    statusLabel,
    accentColor,
    reservationStatus,
  } = useLocalSearchParams();

  // Statuses 1 and 2 → reservations endpoint; 3 and 4 → tickets endpoint
  const statusNum = Number(reservationStatus);
  const isReservationMode = statusNum === 1 || statusNum === 2;

  const baseUrl =
    eventId && collectionId && ticketStatus
      ? isReservationMode
        ? `${ENDPOINTS_TICKETS.RESERVATION}?eventId=${eventId}&collectionId=${collectionId}&reservationStatus=${reservationStatus}`
        : `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=${ticketStatus}`
      : null;

  const { items, loading, hasMore, totalElements, fetched, loadMore, refresh } =
    usePaginatedFetch(baseUrl);

  const accent = accentColor ?? "#16CD91";

  // ── Header ────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.totalLabel}>
        {totalElements} {isReservationMode ? "reservación" : "ticket"}
        {totalElements !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading && !fetched) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
        <Text style={styles.emptyTitle}>
          Sin {isReservationMode ? "reservaciones" : "tickets"}
        </Text>
        <Text style={styles.emptySubtitle}>
          No hay {isReservationMode ? "reservaciones" : "tickets"} con estado{" "}
          {statusLabel} en este evento.
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
      <SafeAreaView
        style={[styles.topBar, { borderBottomColor: accent + "40" }]}
        edges={["top"]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <Text style={styles.screenTitle}>
            {isReservationMode ? "Reservaciones" : "Tickets"}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: accent + "20" }]}
          >
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
        data={items}
        keyExtractor={(item, idx) => item?.code ?? item?.id ?? String(idx)}
        renderItem={({ item }) =>
          isReservationMode ? (
            <ReservationRow reservation={item} accentColor={accent} />
          ) : (
            <TicketRow ticket={item} accentColor={accent} />
          )
        }
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
          items.length === 0 && styles.listContentEmpty,
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

  // Status pill
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
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
