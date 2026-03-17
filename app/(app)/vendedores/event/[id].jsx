import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VendorRankingRow from "../../../../components/cards/VendorRankingRow";
import { ENDPOINTS_COLLECTIONS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const YELLOW_400 = Colors.principal.yellow[400];
const WHITE = "#FFFFFF";

function getSellerName(col) {
  const s = col.seller ?? col.user ?? {};
  return s.username || "Sin nombre";
}

function getSellerId(col) {
  return col.seller?.id ?? col.user?.id ?? col.userId ?? col.id;
}

export default function EventSellersScreen() {
  const { id: eventId, titleEvent } = useLocalSearchParams();

  const [query, setQuery] = useState("");

  const { data: collections, loading } = useFetch(
    eventId ? `${ENDPOINTS_COLLECTIONS.GET_BY_EVENT}?eventId=${eventId}` : null,
  );

  const sorted = [...(collections ?? [])].sort(
    (a, b) => (b.soldTickets ?? 0) - (a.soldTickets ?? 0),
  );

  const totalSold = sorted.reduce((acc, c) => acc + (c.soldTickets ?? 0), 0);
  const avgSold =
    sorted.length > 0 ? (totalSold / sorted.length).toFixed(1) : "0";
  const topSellerName = sorted.length > 0 ? getSellerName(sorted[0]) : "—";

  // Filter by search query (case-insensitive name match)
  const filtered = query.trim()
    ? sorted.filter((c) =>
        getSellerName(c).toLowerCase().includes(query.trim().toLowerCase()),
      )
    : sorted;

  const listHeader = (
    <View style={styles.listHeader}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.listTitle}>Evento : {titleEvent}</Text>
      </View>
      <Text style={styles.subtitle}>
        {sorted.length} vendedor(es) en este evento
      </Text>

      {/* Metrics row — 3 cards */}
      <View style={styles.metricsRow}>
        {/* Card 1: Tickets Vendidos */}
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: GREEN_900 }]}>
            {totalSold}
          </Text>
          <Text style={styles.metricLabel}>Tickets{"\n"}Vendidos</Text>
        </View>

        {/* Card 2: Promedio por vendedor */}
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: BLUE_500 }]}>
            {avgSold}
          </Text>
          <Text style={styles.metricLabel}>Promedio</Text>
        </View>

        {/* Card 3: Top vendedor name */}
        <View style={styles.metricCard}>
          <Text
            style={[
              styles.metricValue,
              { color: GREEN_500, fontSize: Typography.sizes.sm },
            ]}
            numberOfLines={2}
          >
            {topSellerName}
          </Text>
          <Text style={styles.metricLabel}>Top{"\n"}Vendedor</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color={NEUTRAL_500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vendedor..."
          placeholderTextColor={NEUTRAL_500}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={16} color={NEUTRAL_500} />
          </TouchableOpacity>
        )}
      </View>

      {/* Result count shown only when a query is active */}
      {query.trim().length > 0 && (
        <Text style={styles.resultCount}>{filtered.length} resultado(s)</Text>
      )}

      <View style={styles.listHeaderDivider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          renderItem={({ item, index }) => (
            // Top 3 rows get a yellow left border accent
            <View
              style={[styles.rowWrapper, index < 3 && styles.rowWrapperTop]}
            >
              <VendorRankingRow
                rank={index + 1}
                name={getSellerName(item)}
                ticketsSold={item.soldTickets ?? 0}
                sales={(item.soldTickets ?? 0) * (item.ticketPrice ?? 0)}
                id={getSellerId(item)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={52} color={NEUTRAL_200} />
              <Text style={styles.emptyText}>
                {query.trim().length > 0
                  ? "No se encontraron vendedores."
                  : "No hay vendedores asignados."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingBottom: 32,
  },

  // ── List header ────────────────────────────────────────────
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  listTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    marginTop: 2,
    marginBottom: 16,
  },

  // ── Metrics row ────────────────────────────────────────────
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    alignItems: "center",
  },
  metricValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    marginBottom: 2,
    textAlign: "center",
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // ── Search bar ─────────────────────────────────────────────
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: NEUTRAL_50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: "#111111",
  },
  resultCount: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginBottom: 8,
    marginLeft: 2,
  },

  listHeaderDivider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 4,
  },

  // ── Row wrappers ───────────────────────────────────────────
  rowWrapper: {
    paddingHorizontal: 20,
  },
  rowWrapperTop: {
    // Left accent border for podium positions (rank 1, 2, 3)
    borderLeftWidth: 3,
    borderLeftColor: YELLOW_400,
    paddingLeft: 17, // compensates for the 3px border so content stays aligned
  },

  // ── Item separator ─────────────────────────────────────────
  separator: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginHorizontal: 20,
  },

  // ── Empty state ────────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
  },
});
