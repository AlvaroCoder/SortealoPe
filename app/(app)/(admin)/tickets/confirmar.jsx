import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_RESERVATIONS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { fetchWithAuth } from "../../../../lib/fetchWithAuth";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Main screen ────────────────────────────────────────────────────────────────
export default function AdminConfirmarTickets() {
  const router = useRouter();
  const {
    id: eventId,
    ticketPrice: ticketPriceStr,
    collectionId,
  } = useLocalSearchParams();
  const ticketPrice = parseFloat(ticketPriceStr ?? "0");

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ── Fetch reservations with reservationStatus=2 ───────────────────────────
  const fetchPendingReservations = useCallback(async () => {
    if (!eventId || !collectionId) return;
    try {
      const res = await fetchWithAuth(
        `${ENDPOINTS_RESERVATIONS.GET}?eventId=${eventId}&collectionId=${collectionId}&reservationStatus=2&page=0&size=100`,
      );
      if (!res.ok) throw new Error("No se pudieron cargar las reservaciones.");
      const body = await res.json();
      const items = Array.isArray(body) ? body : (body?.content ?? []);

      console.log("Items : ", items);

      setReservations(items);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }, [eventId, collectionId]);

  useEffect(() => {
    setLoading(true);
    fetchPendingReservations().finally(() => setLoading(false));
  }, [fetchPendingReservations]);

  // Refresh when returning from exitoConfirmar
  useFocusEffect(
    useCallback(() => {
      if (!loading) fetchPendingReservations();
    }, [fetchPendingReservations, loading]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingReservations();
    setRefreshing(false);
  };

  // ── Selection logic (single selection) ──────────────────────────────────────
  const reservationKey = (r) => r.id;

  const toggleSelect = (key) => {
    setSelectedId((prev) => (prev === key ? null : key));
  };

  // ── Navigate to payment confirmation screen ──────────────────────────────────
  const navigateToConfirm = () => {
    if (!selectedId) return;
    router.push({
      pathname: "/(app)/(admin)/tickets/ingresarDatosVenta",
      params: {
        eventId,
        collectionId,
        reservationCodes: JSON.stringify([selectedId]),
        totalAmount: String(total),
        totalTickets: String(totalTickets),
        ticketPrice: ticketPriceStr ?? "0",
      },
    });
  };

  // ── Derived values ───────────────────────────────────────────────────────────
  const selectedReservation =
    reservations.find((r) => r.id === selectedId) ?? null;
  const totalTickets = selectedReservation?.ticketQuantity ?? 0;
  console.log(totalTickets);

  const total = totalTickets * ticketPrice;
  const fmt = (n) => `S/. ${n.toFixed(2)}`;

  // ── Reservation list item ────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const key = reservationKey(item);
    const isSelected = selectedId === key;

    const buyer = item.buyer;
    const displayName = buyer?.firstName
      ? `${buyer.firstName}${buyer.lastName ? " " + buyer.lastName : ""}`.trim()
      : (buyer?.username ?? "Comprador");
    const initial = (
      buyer?.firstName?.[0] ??
      buyer?.username?.[0] ??
      "?"
    ).toUpperCase();

    const dateLabel = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("es-PE", {
          day: "numeric",
          month: "short",
        })
      : null;

    const qty = item.ticketQuantity ?? 0;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelect(key)}
        activeOpacity={0.75}
      >
        {/* Checkbox */}
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected ? (
            <Ionicons name="checkmark" size={14} color={WHITE} />
          ) : null}
        </View>

        {/* Buyer avatar circle with initials */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>

        {/* Center info */}
        <View style={styles.cardInfo}>
          <Text style={styles.buyerName} numberOfLines={1}>
            {displayName}
          </Text>
          {dateLabel && <Text style={styles.reservationMeta}>{dateLabel}</Text>}
        </View>

        {/* Ticket count badge */}
        <View style={styles.ticketCountBadge}>
          <Text style={styles.ticketCountText}>
            {qty} ticket{qty !== 1 ? "s" : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={GREEN_900} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Confirmar Tickets</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando reservaciones…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Confirmar Tickets</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Count bar ────────────────────────────────────────────────────── */}
      <View style={styles.countBar}>
        <View style={styles.countLeft}>
          <Text style={styles.countNumber}>{reservations.length}</Text>
          <Text style={styles.countLabel}>
            reservación{reservations.length !== 1 ? "es" : ""} por confirmar
          </Text>
        </View>
      </View>

      {/* ── Reservation list ─────────────────────────────────────────────── */}
      <FlatList
        style={{ flex: 1 }}
        data={reservations}
        keyExtractor={reservationKey}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          reservations.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[GREEN_900]}
            tintColor={GREEN_900}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="checkmark-circle" size={48} color={GREEN_500} />
            </View>
            <Text style={styles.emptyTitle}>¡Todo al día!</Text>
            <Text style={styles.emptyText}>
              No hay reservaciones pendientes de confirmación.
            </Text>
          </View>
        }
      />

      {/* ── Bottom bar (visible when a reservation is selected) ──────────── */}
      {selectedId !== null && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomCount}>1 reservación seleccionada</Text>
            <Text style={styles.bottomTotal}>{fmt(total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={navigateToConfirm}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done" size={18} color={WHITE} />
            <Text style={styles.confirmBtnText}>Confirmar pago</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEUTRAL_50 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  centeredText: {
    marginTop: 10,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
  },

  countBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  countLeft: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  countNumber: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  countLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },

  listContent: { padding: 14, paddingBottom: 120 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSelected: {
    borderColor: GREEN_500,
    backgroundColor: Colors.principal.green[50],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: WHITE,
  },
  checkboxSelected: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },

  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  cardInfo: { flex: 1, gap: 3 },
  buyerName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  reservationMeta: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },

  ticketCountBadge: {
    backgroundColor: GREEN_50,
    borderColor: GREEN_100,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ticketCountText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIconBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
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

  bottomBar: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomCount: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  bottomTotal: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  confirmBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
