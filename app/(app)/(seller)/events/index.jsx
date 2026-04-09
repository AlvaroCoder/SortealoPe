import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCardAsigned from "../../../../components/cards/EventCardAsigned";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { usePaginatedFetch } from "../../../../lib/usePaginatedFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50  = Colors.principal.green[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG = "#F0F4F8";

// ── Filter config ─────────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all",      label: "Todos",      status: null },
  { id: "active",   label: "Activos",    status: 2    },
  { id: "finished", label: "Finalizados", status: 3   },
];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SellerEventsIndex() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortAsc, setSortAsc]               = useState(false); // false = newest first

  // ── Two parallel fetches (active + finished) ─────────────────────────────
  // Both run always so switching tabs is instant with no extra network call.
  const BASE = `${ENDPOINTS_EVENTS.GET_BY_USER}?role=SELLER`;

  const {
    items: activeItems,
    loading: loadingActive,
    refresh: refreshActive,
  } = usePaginatedFetch(`${BASE}&eventStatus=2`);

  const {
    items: finishedItems,
    loading: loadingFinished,
    refresh: refreshFinished,
  } = usePaginatedFetch(`${BASE}&eventStatus=3`);

  const isLoading = loadingActive || loadingFinished;

  const refresh = () => {
    refreshActive();
    refreshFinished();
  };

  // ── Merge + filter + sort ────────────────────────────────────────────────
  const displayedEvents = useMemo(() => {
    // 1. Pick source based on filter tab
    let pool;
    if (selectedFilter === "active")   pool = activeItems;
    else if (selectedFilter === "finished") pool = finishedItems;
    else pool = [...activeItems, ...finishedItems];

    // 2. Search filter (title or place, case-insensitive)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      pool = pool.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.place?.toLowerCase().includes(q),
      );
    }

    // 3. Date sort
    return [...pool].sort((a, b) => {
      const da = new Date(a.date ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.date ?? b.createdAt ?? 0).getTime();
      return sortAsc ? da - db : db - da;
    });
  }, [activeItems, finishedItems, selectedFilter, searchQuery, sortAsc]);

  // ── Empty state ──────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={52} color={NEUTRAL_200} />
        <Text style={styles.emptyTitle}>
          {searchQuery ? "Sin resultados" : "Sin eventos"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? `No hay eventos que coincidan con "${searchQuery}".`
            : "Aún no estás asignado a ningún evento en esta categoría."}
        </Text>
      </View>
    );
  };

  // ── Footer spinner (loading next page) ────────────────────────────────────
  const renderFooter = () => {
    if (!isLoading || displayedEvents.length === 0) return null;
    return (
      <View style={styles.footerSpinner}>
        <ActivityIndicator size="small" color={GREEN_900} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mis Eventos</Text>
          <Text style={styles.headerSub}>como Vendedor</Text>
        </View>
        {/* Sort toggle */}
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortAsc((v) => !v)}
          activeOpacity={0.75}
        >
          <Ionicons
            name={sortAsc ? "arrow-up-outline" : "arrow-down-outline"}
            size={16}
            color={GREEN_900}
          />
          <Text style={styles.sortLabel}>Fecha</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Search bar ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={NEUTRAL_500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar evento o lugar..."
            placeholderTextColor={NEUTRAL_500}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color={NEUTRAL_500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filter tabs ── */}
      <View style={styles.tabRow}>
        {FILTERS.map((f) => {
          const active = selectedFilter === f.id;
          // Show count badge on each tab
          const count =
            f.id === "all"
              ? activeItems.length + finishedItems.length
              : f.id === "active"
              ? activeItems.length
              : finishedItems.length;

          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setSelectedFilter(f.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View
                  style={[styles.tabBadge, active && styles.tabBadgeActive]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      active && styles.tabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Results info row ── */}
      {!isLoading && displayedEvents.length > 0 && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {displayedEvents.length} evento
            {displayedEvents.length !== 1 ? "s" : ""}
            {searchQuery ? ` para "${searchQuery}"` : ""}
          </Text>
          <Text style={styles.sortInfo}>
            {sortAsc ? "Más antiguo primero" : "Más reciente primero"}
          </Text>
        </View>
      )}

      {/* ── List ── */}
      <FlatList
        data={displayedEvents}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={({ item }) => <EventCardAsigned item={item} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          displayedEvents.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && displayedEvents.length === 0}
            onRefresh={refresh}
            tintColor={GREEN_900}
            colors={[GREEN_900]}
          />
        }
      />

      {/* ── Full-screen loading (first load) ── */}
      {isLoading && activeItems.length === 0 && finishedItems.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 20,
  },
  headerSub: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
    flexShrink: 0,
  },
  sortLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // Search
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    padding: 0,
  },

  // Filter tabs
  tabRow: {
    flexDirection: "row",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    gap: 6,
    backgroundColor: WHITE,
  },
  tabActive: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
  },
  tabLabelActive: {
    color: WHITE,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: GREEN_500,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_500,
  },
  tabBadgeTextActive: {
    color: GREEN_900,
  },

  // Results info
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  sortInfo: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // List
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flex: 1,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
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
    lineHeight: 20,
  },

  // Footer / loading
  footerSpinner: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },
});