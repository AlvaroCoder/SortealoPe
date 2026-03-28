import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { usePaginatedFetch } from "../../../lib/usePaginatedFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// Eventos activos (status=2) donde el usuario es vendedor
const EVENTS_URL = `${ENDPOINTS_EVENTS.GET_BY_USER}?role=SELLER&eventStatus=2`;

// ── Tarjeta de evento ────────────────────────────────────────────────────────

function EventItem({ item }) {
  const router = useRouter();

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Sin fecha";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/(app)/event/vendedores/[id]",
          params: { id: item.id },
        })
      }
    >
      {/* Ícono */}
      <View style={styles.cardIcon}>
        <Ionicons name="gift-outline" size={22} color={GREEN_900} />
      </View>

      {/* Contenido */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title || "Evento sin título"}
        </Text>

        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.cardRowText}>{formattedDate}</Text>
        </View>

        {item.place ? (
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={13} color={NEUTRAL_500} />
            <Text style={styles.cardRowText} numberOfLines={1}>
              {item.place}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardRow}>
          <Ionicons name="pricetag-outline" size={13} color={GREEN_500} />
          <Text style={[styles.cardRowText, { color: GREEN_500, fontWeight: Typography.weights.bold }]}>
            S/ {(item.ticketPrice ?? 0).toFixed(2)} por ticket
          </Text>
        </View>
      </View>

      {/* CTA vender */}
      <View style={styles.sellBadge}>
        <Text style={styles.sellBadgeText}>Vender</Text>
        <Ionicons name="arrow-forward" size={12} color={WHITE} />
      </View>
    </TouchableOpacity>
  );
}

// ── Pantalla principal ───────────────────────────────────────────────────────

export default function Asignados() {
  const { userData, loading: loadingAuth } = useAuthContext();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const shouldFetch = !!userData?.userId && !loadingAuth;

  const { items, loading, hasMore, totalElements, fetched, loadMore, refresh } =
    usePaginatedFetch(shouldFetch ? EVENTS_URL : null);

  // Búsqueda cliente sobre los ítems ya cargados
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.place?.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    // El flag refreshing se apaga cuando loading vuelve a false
  };

  // Apagar refreshing cuando el fetch termina
  if (refreshing && !loading) {
    setRefreshing(false);
  }

  const isInitialLoading = loadingAuth || !fetched;

  // ── Header de la lista (título + buscador + contador) ──────────────────────
  const ListHeader = (
    <View style={styles.listHeader}>
      {/* Buscador */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={NEUTRAL_500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar evento o lugar..."
          placeholderTextColor={NEUTRAL_500}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={16} color={NEUTRAL_500} />
          </TouchableOpacity>
        )}
      </View>

      {/* Contador */}
      <Text style={styles.counter}>
        {query.trim()
          ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`
          : `${totalElements} evento${totalElements !== 1 ? "s" : ""} asignado${totalElements !== 1 ? "s" : ""}`}
      </Text>
    </View>
  );

  if (isInitialLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) =>
          item.id != null ? String(item.id) : String(index)
        }
        renderItem={({ item }) => <EventItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        onEndReached={() => !query.trim() && loadMore()}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          loading && items.length > 0 ? (
            <ActivityIndicator
              size="small"
              color={GREEN_500}
              style={styles.footerSpinner}
            />
          ) : hasMore && !query.trim() ? (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Cargar más</Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="calendar-outline"
                  size={52}
                  color={NEUTRAL_200}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {query.trim()
                  ? "Sin resultados"
                  : "Sin eventos asignados"}
              </Text>
              <Text style={styles.emptyText}>
                {query.trim()
                  ? "Ningún evento coincide con tu búsqueda."
                  : "No tienes eventos activos asignados en este momento."}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // ── Lista ─────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // ── Header de lista ───────────────────────────────────────────
  listHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: GREEN_900,
  },
  counter: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginLeft: 2,
    marginBottom: 4,
  },

  // ── Tarjeta ───────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardRowText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    flex: 1,
  },
  sellBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GREEN_900,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 0,
  },
  sellBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Footer ────────────────────────────────────────────────────
  footerSpinner: {
    paddingVertical: 16,
  },
  loadMoreBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN_500,
    marginVertical: 8,
  },
  loadMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Estado vacío ──────────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});