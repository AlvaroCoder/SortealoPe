import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import TicketCell from "../../../../components/cards/TicketCell";
import { ENDPOINTS_TICKETS } from "../../../../Connections/APIURLS";
import { GetCollectionsByEvent } from "../../../../Connections/collections";
import { CreateReservation } from "../../../../Connections/tickets";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { createTicketClaimURL } from "../../../../lib/deepLinks";
import { useFetch } from "../../../../lib/useFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const SCREEN_W = Dimensions.get("window").width;

// ── Legend item ────────────────────────────────────────────────────────────────
function LegendItem({ color, borderStyle, label, strikethrough }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendBox,
          { backgroundColor: color, borderStyle: borderStyle ?? "solid" },
        ]}
      >
        {strikethrough && <View style={styles.legendStrike} />}
      </View>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

// ── QR Modal ──────────────────────────────────────────────────────────────────
function QRModal({
  visible,
  reservationCode,
  ticketCount,
  onSellMore,
  onClose,
}) {
  const deepLink = reservationCode ? createTicketClaimURL(reservationCode) : "";
  const QR_SIZE = SCREEN_W * 0.55;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Success header */}
          <View style={styles.qrSuccessIcon}>
            <Ionicons name="checkmark-circle" size={36} color={WHITE} />
          </View>
          <Text style={styles.qrTitle}>QR listo</Text>
          <Text style={styles.qrSubtitle}>
            {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} reservado
            {ticketCount !== 1 ? "s" : ""}.{"\n"}
            El comprador escanea el QR con la app Sortealo.
          </Text>

          {/* QR code */}
          {deepLink ? (
            <View style={styles.qrWrapper}>
              <QRCode
                value={deepLink}
                size={QR_SIZE}
                color={GREEN_900}
                backgroundColor={WHITE}
                quietZone={12}
              />
            </View>
          ) : null}

          {/* Buttons */}
          <TouchableOpacity
            style={styles.btnSellMore}
            onPress={onSellMore}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSellMoreText}>Vender más tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCloseText}>Volver al evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function VenderTickets() {
  const router = useRouter();
  const {
    eventId,
    collectionId: paramCollectionId,
    ticketPrice,
    eventTitle,
  } = useLocalSearchParams();

  const { loading: authLoading } = useAuthContext();

  // ── Collection resolution ────────────────────────────────────────────────────
  const [collectionId, setCollectionId] = useState(paramCollectionId ?? null);
  const [loadingCollection, setLoadingCollection] =
    useState(!paramCollectionId);

  useEffect(() => {
    if (paramCollectionId || !eventId || authLoading) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await GetCollectionsByEvent(eventId);
        if (!res.ok) throw new Error();
        const body = await res.json();
        const cols = Array.isArray(body) ? body : (body?.content ?? []);
        if (!cancelled && cols.length > 0) setCollectionId(String(cols[0].id));
      } catch {
        // silently fail — no tickets will load
      } finally {
        if (!cancelled) setLoadingCollection(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId, paramCollectionId, authLoading]);

  // ── Fetch available tickets (status=1) ───────────────────────────────────────
  const availableUrl =
    collectionId && eventId
      ? `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=1&page=0&size=500`
      : null;
  const { data: availableData, loading: loadingAvailable } =
    useFetch(availableUrl);

  // ── Fetch sold tickets (status=3) — for greyed-out display ──────────────────
  const soldUrl =
    collectionId && eventId
      ? `${ENDPOINTS_TICKETS.GET}?eventId=${eventId}&collectionId=${collectionId}&ticketStatus=3&page=0&size=500`
      : null;
  const { data: soldData, loading: loadingSold } = useFetch(soldUrl);

  const availableTickets = useMemo(
    () =>
      Array.isArray(availableData)
        ? availableData
        : (availableData?.content ?? []),
    [availableData],
  );
  const soldTickets = useMemo(
    () => (Array.isArray(soldData) ? soldData : (soldData?.content ?? [])),
    [soldData],
  );

  // Combine + sort by serialNumber
  const allTickets = useMemo(() => {
    const available = availableTickets.map((t) => ({ ...t, _available: true }));
    const sold = soldTickets.map((t) => ({ ...t, _sold: true }));
    return [...available, ...sold].sort(
      (a, b) => (a.serialNumber ?? a.id ?? 0) - (b.serialNumber ?? b.id ?? 0),
    );
  }, [availableTickets, soldTickets]);

  // ── Search ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return allTickets;
    const q = search.trim().toLowerCase();
    return allTickets.filter((t) =>
      String(t.serialNumber ?? t.id ?? "")
        .padStart(3, "0")
        .includes(q),
    );
  }, [allTickets, search]);

  // ── Selection ───────────────────────────────────────────────────────────────
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const toggleTicket = useCallback((ticket) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(ticket.code)) next.delete(ticket.code);
      else next.add(ticket.code);
      return next;
    });
  }, []);

  const selectedTickets = useMemo(
    () => availableTickets.filter((t) => selectedCodes.has(t.code)),
    [availableTickets, selectedCodes],
  );

  // ── Price calculation ────────────────────────────────────────────────────────
  const pricePerTicket = parseFloat(ticketPrice ?? "0") || 0;
  const totalPrice = selectedCodes.size * pricePerTicket;

  const formatMoney = (n) =>
    n.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    });

  // ── Confirm & generate QR ────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [reservationCode, setReservationCode] = useState(null);

  const handleConfirm = useCallback(async () => {
    if (selectedCodes.size === 0) return;
    setSubmitting(true);
    try {
      const ticketCodes = selectedTickets.map((t) => t.code);
      const res = await CreateReservation(eventId, ticketCodes);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo crear la reserva.");
      }
      const data = await res.json();
      setReservationCode(data.id);
      setQrVisible(true);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  }, [eventId, selectedCodes, selectedTickets]);

  const resetSelection = useCallback(() => {
    setSelectedCodes(new Set());
    setReservationCode(null);
    setQrVisible(false);
  }, []);

  // ── Loading state ────────────────────────────────────────────────────────────
  const isLoading =
    authLoading || loadingCollection || loadingAvailable || loadingSold;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Status bar fill */}
      <View style={styles.statusBar} />

      {/* ── Top nav ─────────────────────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={GREEN_900} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Ionicons
            name="ticket-outline"
            size={18}
            color={GREEN_900}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.navTitle} numberOfLines={1}>
            {eventTitle ?? "Vender Tickets"}
          </Text>
        </View>
      </View>

      {/* ── Search bar ───────────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={NEUTRAL_400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar número de ticket..."
            placeholderTextColor={NEUTRAL_400}
            value={search}
            onChangeText={setSearch}
            keyboardType="numeric"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={NEUTRAL_400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Legend ────────────────────────────────────────────────────────────── */}
      <View style={styles.legend}>
        <LegendItem color={WHITE} borderStyle="solid" label="DISPONIBLE" />
        <LegendItem color={GREEN_500} label="SELECCIONADO" />
      </View>

      {/* ── Ticket grid ──────────────────────────────────────────────────────── */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={GREEN_900} />
          <Text style={styles.centeredText}>Cargando tickets…</Text>
        </View>
      ) : filteredTickets.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
          <Text style={styles.centeredText}>
            {search
              ? "Sin resultados para tu búsqueda."
              : "No hay tickets disponibles."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={(t) => String(t.id ?? t.code)}
          numColumns={4}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={[
            styles.gridContent,
            selectedCodes.size > 0 && { paddingBottom: 120 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TicketCell
              ticket={item}
              selected={selectedCodes.has(item.code)}
              sold={!!item._sold}
              onToggle={toggleTicket}
            />
          )}
        />
      )}

      {/* ── Sticky bottom bar ────────────────────────────────────────────────── */}
      {selectedCodes.size > 0 && (
        <SafeAreaView style={styles.bottomBar} edges={["bottom"]}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomCount}>
              {selectedCodes.size} TICKET{selectedCodes.size !== 1 ? "S" : ""}{" "}
              SELECCIONADO{selectedCodes.size !== 1 ? "S" : ""}
            </Text>
            <Text style={styles.bottomPrice}>{formatMoney(totalPrice)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.btnConfirm, submitting && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <Text style={styles.btnConfirmText}>Reservar</Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ── QR Modal ─────────────────────────────────────────────────────────── */}
      <QRModal
        visible={qrVisible}
        reservationCode={reservationCode}
        ticketCount={selectedCodes.size}
        onSellMore={resetSelection}
        onClose={() => {
          setQrVisible(false);
          router.back();
        }}
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: WHITE,
  },

  // ── Nav ─────────────────────────────────────────────────────────────────────
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  navBack: {
    padding: 4,
    marginRight: 8,
  },
  navCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  navTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    flex: 1,
  },
  navAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Search ──────────────────────────────────────────────────────────────────
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF0FB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: GREEN_900,
    padding: 0,
  },

  // ── Legend ──────────────────────────────────────────────────────────────────
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  legendStrike: {
    position: "absolute",
    width: "140%",
    height: 1.5,
    backgroundColor: NEUTRAL_400,
    transform: [{ rotate: "-45deg" }],
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
    letterSpacing: 0.4,
  },

  // ── Grid ────────────────────────────────────────────────────────────────────
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  // ── Bottom bar ──────────────────────────────────────────────────────────────
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomCount: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  bottomPrice: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  btnConfirm: {
    backgroundColor: GREEN_500,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowColor: GREEN_500,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnConfirmText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── QR Modal ────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginTop: 14,
    marginBottom: 24,
  },
  qrSuccessIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: GREEN_500,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  qrTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 6,
  },
  qrSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    backgroundColor: WHITE,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnSellMore: {
    width: "100%",
    borderWidth: 2,
    borderColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  btnSellMoreText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  btnClose: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  btnCloseText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
  },

  // ── States ──────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  centeredText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
    textAlign: "center",
  },
});
