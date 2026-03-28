import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
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
const BLUE_500 = Colors.principal.blue[500];
const BLUE_100 = Colors.principal.blue[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const BASE_URL = ENDPOINTS_EVENTS.GET_BY_USER;

const TABS = [
  { key: "1", label: "En Espera", icon: "time-outline" },
  { key: "2", label: "Activos", icon: "play-circle-outline" },
  { key: "3", label: "Finalizados", icon: "flag-outline" },
];

const STATUS_BADGE = {
  1: { label: "En espera", color: NEUTRAL_500, bg: NEUTRAL_100 },
  2: { label: "Activo", color: GREEN_900, bg: GREEN_50 },
  3: { label: "Finalizado", color: BLUE_500, bg: BLUE_100 },
};

// ── Item de evento ───────────────────────────────────────────────────────────

function EventItem({ item }) {
  const router = useRouter();
  const badge = STATUS_BADGE[item.status] ?? {
    label: "—",
    color: NEUTRAL_500,
    bg: NEUTRAL_100,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/(app)/event/[id]",
          params: { id: item.id, eventStatus: item.status },
        })
      }
    >
      {/* Ícono izquierdo */}
      <View style={styles.cardIcon}>
        <Ionicons name="gift-outline" size={22} color={GREEN_900} />
      </View>

      {/* Contenido */}
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.cardMetaText}>
            {item.date
              ? new Date(item.date).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Sin fecha"}
          </Text>
        </View>

        {item.place ? (
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={13} color={NEUTRAL_500} />
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {item.place}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardPriceRow}>
          <Text style={styles.cardPrice}>
            S/ {(item.ticketPrice ?? 0).toFixed(2)}
          </Text>
          <Text style={styles.cardPriceLabel}> por ticket</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={NEUTRAL_200} />
    </TouchableOpacity>
  );
}

// ── Pantalla principal ───────────────────────────────────────────────────────

export default function MisEventos() {
  const [activeTab, setActiveTab] = useState("1");
  const [refreshing, setRefreshing] = useState(false);
  const { userData, loading: loadingAuth } = useAuthContext();

  const shouldFetch = !!userData?.userId && !loadingAuth;

  // Un fetch paginado por estado — role=SELLER porque son eventos donde el
  // usuario fue asignado como vendedor (no eventos que él creó)
  const espera = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=SELLER&eventStatus=1` : null,
  );
  const activos = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=SELLER&eventStatus=2` : null,
  );
  const finalizados = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=SELLER&eventStatus=3` : null,
  );

  const tabFetch = { "1": espera, "2": activos, "3": finalizados };
  const current = tabFetch[activeTab];

  // Apagar el indicador de refresh cuando los tres terminan
  useEffect(() => {
    if (refreshing && !espera.loading && !activos.loading && !finalizados.loading) {
      setRefreshing(false);
    }
  }, [refreshing, espera.loading, activos.loading, finalizados.loading]);

  const handleRefresh = () => {
    setRefreshing(true);
    espera.refresh();
    activos.refresh();
    finalizados.refresh();
  };

  // LoadingScreen solo en la carga inicial del tab activo
  const isInitialLoading = loadingAuth || !current.fetched;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* ── Tab bar ─────────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const fetch = tabFetch[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={tab.icon}
                size={15}
                color={isActive ? WHITE : GREEN_900}
              />
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
              {fetch.totalElements > 0 && (
                <View
                  style={[
                    styles.tabCount,
                    isActive && styles.tabCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      isActive && styles.tabCountTextActive,
                    ]}
                  >
                    {fetch.totalElements}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Contenido ───────────────────────────────────────── */}
      {isInitialLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={current.items}
          keyExtractor={(item, index) =>
            item.id != null ? String(item.id) : String(index)
          }
          renderItem={({ item }) => <EventItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={current.loadMore}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            current.loading && current.items.length > 0 ? (
              <ActivityIndicator
                size="small"
                color={GREEN_500}
                style={styles.footerSpinner}
              />
            ) : null
          }
          ListEmptyComponent={
            !current.loading ? (
              <View style={styles.empty}>
                <Ionicons
                  name="calendar-outline"
                  size={52}
                  color={NEUTRAL_200}
                />
                <Text style={styles.emptyTitle}>Sin eventos</Text>
                <Text style={styles.emptyText}>
                  No tienes eventos asignados en este estado.
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // ── Tab bar ─────────────────────────────────────────────
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    backgroundColor: WHITE,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: NEUTRAL_50,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    gap: 4,
  },
  tabActive: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  tabLabelActive: {
    color: WHITE,
  },
  tabCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabCountActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  tabCountTextActive: {
    color: WHITE,
  },

  // ── Lista ───────────────────────────────────────────────
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  footerSpinner: {
    paddingVertical: 16,
  },

  // ── Card de evento ──────────────────────────────────────
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
    width: 44,
    height: 44,
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
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardMetaText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    flex: 1,
  },
  cardPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  cardPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
  },
  cardPriceLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },

  // ── Estado vacío ────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginTop: 8,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});