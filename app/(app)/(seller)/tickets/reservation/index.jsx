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
import { ENDPOINTS_TICKETS } from "../../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../../constants/theme";
import { usePaginatedFetch } from "../../../../../lib/usePaginatedFetch";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ── Helpers ───────────────────────────────────────────────────────────────────
function displayName(user) {
  if (!user) return "—";
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.username ?? "—";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(user) {
  if (!user) return "?";
  if (user.firstName && user.lastName)
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.username) return user.username.slice(0, 2).toUpperCase();
  return "?";
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ReservationListScreen() {
  const router = useRouter();
  const { eventId, collectionId, reservationStatus, statusLabel, accentColor } =
    useLocalSearchParams();

  const accent = accentColor ?? "#16CD91";

  const baseUrl =
    eventId && collectionId && reservationStatus
      ? `${ENDPOINTS_TICKETS.RESERVATION}?eventId=${eventId}&collectionId=${collectionId}&reservationStatus=${reservationStatus}`
      : null;

  const { items, loading, hasMore, totalElements, fetched, loadMore, refresh } =
    usePaginatedFetch(baseUrl);

  const handlePress = (item) => {
    router.push({
      pathname: "/(app)/(seller)/tickets/reservation/[id]",
      params: {
        id: item.id,
        data: JSON.stringify(item),
        accentColor: accent,
      },
    });
  };

  // ── Card renderer ──────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const name = displayName(item.buyer);
    const initials = getInitials(item.buyer);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => handlePress(item)}
      >
        <View style={[styles.avatar, { backgroundColor: accent + "25" }]}>
          <Text style={[styles.avatarText, { color: accent }]}>{initials}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>

        <View style={[styles.quantityBadge, { backgroundColor: accent + "18" }]}>
          <Text style={[styles.quantityText, { color: accent }]}>
            {item.ticketQuantity} ticket{item.ticketQuantity !== 1 ? "s" : ""}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={NEUTRAL_500}
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  // ── List header ───────────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.totalLabel}>
        {totalElements} reservación{totalElements !== 1 ? "es" : ""}
      </Text>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading && !fetched) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
        <Text style={styles.emptyTitle}>Sin reservaciones</Text>
        <Text style={styles.emptySubtitle}>
          No hay reservaciones con estado {statusLabel} en esta colección.
        </Text>
      </View>
    );
  };

  // ── Footer spinner ────────────────────────────────────────────────────────
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
          <Text style={styles.screenTitle}>Reservaciones</Text>
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
        data={items}
        keyExtractor={(item, idx) => item?.id ?? String(idx)}
        renderItem={renderItem}
        ListHeaderComponent={fetched && items.length > 0 ? renderHeader : null}
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
  backBtnSpacer: { width: 40 },
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
  statusDot: { width: 6, height: 6, borderRadius: 3 },
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
    paddingBottom: 32,
  },
  listContentEmpty: { flex: 1 },
  listHeader: { paddingVertical: 12 },
  totalLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  separator: { height: 8 },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  cardInfo: { flex: 1, gap: 3 },
  cardName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  cardDate: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },
  quantityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
  },
  quantityText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  chevron: { flexShrink: 0 },

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
  footerSpinner: { paddingVertical: 20, alignItems: "center" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
});
