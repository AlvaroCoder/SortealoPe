import { Ionicons } from "@expo/vector-icons";
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
import CardEvents from "../../../../components/cards/CardEvents";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { usePaginatedFetch } from "../../../../lib/usePaginatedFetch";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

export default function AdminDashboard() {
  const { userData } = useAuthContext();
  const userId = userData?.userId;
  const router = useRouter();
  const {
    items: recentEvents,
    loading: loadingEvents,
    hasMore,
    loadMore,
    refresh: refreshEvents,
  } = usePaginatedFetch(
    `${ENDPOINTS_EVENTS.GET_BY_USER}?role=HOST&eventStatus=2`,
  );

  const renderHeader = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ultimos eventos activos</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(admin)/(tab)/events")}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLink}>Ver todos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    if (loadingEvents) {
      return (
        <ActivityIndicator
          color={GREEN_500}
          size="small"
          style={{ marginVertical: 16 }}
        />
      );
    }
    return (
      <TouchableOpacity
        style={styles.loadMoreBtn}
        onPress={loadMore}
        activeOpacity={0.8}
      >
        <Text style={styles.loadMoreText}>Cargar más</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loadingEvents) {
      return (
        <ActivityIndicator
          color={GREEN_500}
          size="large"
          style={{ marginTop: 32 }}
        />
      );
    }
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="calendar-outline" size={40} color={NEUTRAL_400} />
        <Text style={styles.emptyText}>No hay eventos activos</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={recentEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CardEvents item={item} userId={userId} selectedStatus={2} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={loadingEvents && recentEvents.length === 0}
            onRefresh={refreshEvents}
            tintColor={GREEN_500}
          />
        }
      />

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(app)/(admin)/events/create")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={WHITE} />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },

  // Metrics
  metricsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  metricCardFull: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.principal.green[100],
    alignItems: "center",
    justifyContent: "center",
  },
  metricGrowthBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metricGrowthText: {
    color: "#065F46",
    fontSize: 11,
    fontWeight: "700",
  },
  metricLabel: {
    fontSize: 13,
    color: NEUTRAL_500,
    fontWeight: "500",
    marginBottom: 2,
  },
  metricValueLarge: {
    fontSize: 32,
    fontWeight: "800",
    color: GREEN_900,
    marginTop: 2,
  },
  metricRow: {
    flexDirection: "row",
    gap: 0, // using marginRight on first child instead
  },
  metricCardHalf: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: GREEN_900,
    marginTop: 4,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN_900,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: "600",
    color: GREEN_500,
  },

  // Event cards
  eventCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImageWrapper: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 160,
  },
  eventImagePlaceholder: {
    backgroundColor: NEUTRAL_200,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eventInfo: {
    padding: 14,
  },
  eventInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN_900,
    flex: 1,
    marginRight: 8,
  },
  ticketsBox: {
    alignItems: "flex-end",
  },
  ticketsLabel: {
    fontSize: 10,
    color: NEUTRAL_500,
    fontWeight: "500",
  },
  ticketsValue: {
    fontSize: 13,
    fontWeight: "700",
    color: NEUTRAL_700,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: GREEN_500,
  },

  // Footer / load more
  loadMoreBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: "center",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: GREEN_900,
  },

  // Empty state
  emptyBox: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: NEUTRAL_400,
    fontWeight: "500",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
