import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../context/AuthContext";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const YELLOW_600 = Colors.principal.yellow[600];

const URL_EVENTS = ENDPOINTS_EVENTS.GET_BY_USER;

// Single event row — tappable, navigates to event detail
const EventRow = ({ event }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "event/[id]",
      params: { id: event.id, eventStatus: event.status },
    });
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("es-PE")
    : "Sin fecha";

  return (
    <TouchableOpacity style={styles.eventRow} onPress={handlePress}>
      <View style={styles.eventRowContent}>
        <Text style={styles.eventRowTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.eventRowDate}>{formattedDate}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={NEUTRAL_500} />
    </TouchableOpacity>
  );
};

export default function PageMetricEventos() {
  const { userData, loading: loadingAuth } = useAuthContext();

  // Only start fetching once auth is resolved and userId is available
  const shouldFetch = !!userData?.userId && !loadingAuth;
  const userId = userData?.userId;

  const {
    data: eventsEspera,
    loading: loadingEspera,
    refetch: refetchEspera,
  } = useFetch(shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=1` : null);

  const {
    data: eventsActivos,
    loading: loadingActivos,
    refetch: refetchActivos,
  } = useFetch(shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=2` : null);

  const {
    data: eventsFinalizados,
    loading: loadingFinalizados,
    refetch: refetchFinalizados,
  } = useFetch(shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=3` : null);

  // Pull-to-refresh state — cleared once all fetches resolve
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing && !loadingEspera && !loadingActivos && !loadingFinalizados) {
      setRefreshing(false);
    }
  }, [refreshing, loadingEspera, loadingActivos, loadingFinalizados]);

  const handleRefresh = () => {
    setRefreshing(true);
    refetchEspera();
    refetchActivos();
    refetchFinalizados();
  };

  // Derived metrics from real API data
  const allEvents = [
    ...(eventsEspera ?? []),
    ...(eventsActivos ?? []),
    ...(eventsFinalizados ?? []),
  ];

  const totalCreados = allEvents.length;
  const totalActivos = (eventsActivos ?? []).length;
  const totalFinalizados = (eventsFinalizados ?? []).length;

  // Revenue approximation: soldTickets * ticketPrice per event
  // Falls back to checking nested collections array if backend embeds it
  const totalRevenue = allEvents.reduce((sum, e) => {
    const sold =
      e.soldTickets ??
      e.collections?.reduce((s, c) => s + (c.soldTickets ?? 0), 0) ??
      0;
    return sum + sold * (e.ticketPrice ?? 0);
  }, 0);

  // Format revenue: show "S/ 1.5K" for thousands, plain for smaller amounts
  const revenueLabel =
    totalRevenue >= 1000
      ? `S/ ${(totalRevenue / 1000).toFixed(1)}K`
      : `S/ ${totalRevenue.toFixed(0)}`;

  // Show loading overlay during initial load (not during pull-to-refresh)
  const isInitialLoading =
    !refreshing && (loadingAuth || loadingEspera || loadingActivos || loadingFinalizados);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        {/* Overlay spinner on first load */}
        {isInitialLoading && <LoadingScreen text="Cargando métricas..." />}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={GREEN_500}
              colors={[GREEN_500]}
            />
          }
        >
          {/* Page header */}
          <Text style={styles.pageTitle}>Métricas de Eventos</Text>
          <Text style={styles.pageSubtitle}>
            Análisis de rendimiento de tus rifas.
          </Text>

          {/* KPI summary grid — 2 × 2 */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: GREEN_900 }]}>
                {totalCreados}
              </Text>
              <Text style={styles.kpiLabel}>Creados</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: GREEN_500 }]}>
                {totalActivos}
              </Text>
              <Text style={styles.kpiLabel}>Activos</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: BLUE_500 }]}>
                {totalFinalizados}
              </Text>
              <Text style={styles.kpiLabel}>Finalizados</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: YELLOW_600 }]}>
                {revenueLabel}
              </Text>
              <Text style={styles.kpiLabel}>Recaudación</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Eventos Activos section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ellipse" size={8} color={GREEN_500} />
              <Text style={styles.sectionTitle}>Eventos Activos</Text>
              <Text style={styles.sectionCount}>{totalActivos}</Text>
            </View>

            {(eventsActivos ?? []).length === 0 ? (
              <Text style={styles.emptyText}>No hay eventos activos.</Text>
            ) : (
              // Show up to 5 events
              (eventsActivos ?? []).slice(0, 5).map((event) => (
                <EventRow key={event.id} event={event} />
              ))
            )}
          </View>

          <View style={styles.divider} />

          {/* Eventos Finalizados section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ellipse" size={8} color={BLUE_500} />
              <Text style={styles.sectionTitle}>Eventos Finalizados</Text>
              <Text style={styles.sectionCount}>{totalFinalizados}</Text>
            </View>

            {(eventsFinalizados ?? []).length === 0 ? (
              <Text style={styles.emptyText}>No hay eventos finalizados.</Text>
            ) : (
              // Show up to 5 events
              (eventsFinalizados ?? []).slice(0, 5).map((event) => (
                <EventRow key={event.id} event={event} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Page header
  pageTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginBottom: 20,
  },

  // KPI grid
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    width: "47%",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  kpiValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Section layout
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  sectionCount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
    backgroundColor: NEUTRAL_100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  // Event list rows
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
  },
  eventRowContent: {
    flex: 1,
  },
  eventRowTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: "#111111",
    marginBottom: 2,
  },
  eventRowDate: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },

  // Empty state
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    paddingVertical: 16,
    textAlign: "center",
  },

  // Divider between sections
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 24,
  },
});
