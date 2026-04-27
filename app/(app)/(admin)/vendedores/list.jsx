import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import HeaderComponenteListSeller from "../../../../components/cards/HeaderComponenteListSeller";
import SellerCard from "../../../../components/cards/SellerCard";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";

const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";
const BG = "#F8FAFC";

export default function ListVendedores() {
  const router = useRouter();
  const { eventId, eventStatus } = useLocalSearchParams();

  const {
    data: event,
    loading,
    refetch,
  } = useFetch(
    `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=${eventStatus}`,
  );

  const ticketPrice = event?.ticketPrice ?? 0;
  const [searchText, setSearchText] = useState("");

  // ── Corregido: sort aplicado sobre el array real, no sobre []
  const collections = useMemo(
    () =>
      (event?.collections ?? [])
        .slice()
        .sort((a, b) => (b?.soldTickets ?? 0) - (a?.soldTickets ?? 0)),
    [event?.collections],
  );

  const filtered = useMemo(() => {
    const query = searchText
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (!query) return collections;
    return collections.filter((c) => {
      const name =
        `${c.seller?.firstName ?? ""} ${c.seller?.lastName ?? ""} ${c.seller?.username ?? ""}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      return name.includes(query);
    });
  }, [searchText, collections]);

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={52} color={NEUTRAL_200} />
        <Text style={styles.emptyTitle}>
          {searchText.length > 0 ? "Sin resultados" : "Sin vendedores"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchText.length > 0
            ? `No hay vendedores que coincidan con "${searchText}"`
            : "Este evento aún no tiene vendedores asignados."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      {/* ── Top bar ── */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={styles.screenTitle}>Vendedores</Text>
          {event?.title ? (
            <Text style={styles.screenSubtitle} numberOfLines={1}>
              {event.title}
            </Text>
          ) : null}
        </View>
        <View style={styles.backBtnSpacer} />
      </SafeAreaView>

      {/* ── Loading overlay inicial ── */}
      {loading && collections.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={GREEN_900} />
        </View>
      )}

      {/* ── Lista ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => String(item?.id ?? i)}
        renderItem={({ item, index }) => (
          <SellerCard
            item={item}
            index={index}
            eventId={eventId}
            ticketPrice={ticketPrice}
            eventStatus={eventStatus}
          />
        )}
        ListHeaderComponent={
          <HeaderComponenteListSeller
            searchText={searchText}
            setSearchText={setSearchText}
            filtered={filtered}
          />
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={loading && collections.length > 0}
            onRefresh={refetch}
            tintColor={GREEN_900}
            colors={[GREEN_900]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    gap: 12,
    marginTop: Constants.statusBarHeight,
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
    gap: 2,
  },
  screenTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  screenSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    maxWidth: 200,
  },

  // ── List header
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    padding: 0,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    paddingHorizontal: 2,
  },

  // ── List
  listContent: {
    paddingBottom: 32,
  },
  listContentEmpty: {
    flex: 1,
  },

  // ── Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
