import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import QRCode from "react-native-qrcode-svg";
import { runOnJS } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ENDPOINTS_EVENTS,
  ENDPOINTS_TICKETS,
} from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { fetchWithAuth } from "../../../../lib/fetchWithAuth";
import { useFetch } from "../../../../lib/useFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const AMBER_BG = "#FEF3C7";
const AMBER_TEXT = "#92400E";
const AMBER_BORDER = "#FDE68A";

const MASCOT_STATUS_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775314294/mascotas_zlqjn5.png";

// Ticket status config
const STATUS_CONFIG = {
  3: {
    label: "EN ESPERA",
    bg: AMBER_BG,
    text: AMBER_TEXT,
    border: AMBER_BORDER,
  },
  4: { label: "COMPRADO", bg: GREEN_50, text: GREEN_900, border: GREEN_100 },
};

// ── Date helper ───────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Returns the number of calendar days remaining until the event date.
// Returns 0 if the date is in the past or missing.
function getDaysLeft(dateStr) {
  if (!dateStr) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// Formats a numeric amount as "S/ X.XX" (Peruvian sol).
function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `S/ ${value.toFixed(2)}`;
}

// ── QR Modal ──────────────────────────────────────────────────────────────────
function QRModal({ ticket, visible, onClose }) {
  if (!ticket) return null;
  const status = STATUS_CONFIG[ticket.status?.id] ?? STATUS_CONFIG[4];
  const serialLabel =
    ticket.serialNumber != null
      ? `N.° ${String(ticket.serialNumber).padStart(4, "0")}`
      : (ticket.code?.substring(0, 8) ?? "—");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          {/* Status badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.bg, borderColor: status.border },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>

          {/* Serial */}
          <Text style={styles.serialLabel}>{serialLabel}</Text>

          {/* QR */}
          <View style={styles.qrBox}>
            <QRCode
              value={ticket.code ?? "sortealo"}
              size={200}
              color={GREEN_900}
              backgroundColor={WHITE}
            />
          </View>

          <Text style={styles.qrCaption}>
            Muestra este QR para validar tu ticket
          </Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Ticket list item ──────────────────────────────────────────────────────────
function TicketItem({ ticket, onPress }) {
  const status = STATUS_CONFIG[ticket.status?.id] ?? STATUS_CONFIG[4];
  const serialLabel =
    ticket.serialNumber != null
      ? `N.° ${String(ticket.serialNumber).padStart(4, "0")}`
      : "—";

  return (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={onPress}
      activeOpacity={0.78}
    >
      {/* Left accent */}
      <View style={[styles.accentBar, { backgroundColor: status.text }]} />

      {/* Serial badge */}
      <View style={styles.ticketBadge}>
        <Ionicons name="ticket-outline" size={16} color={GREEN_900} />
        <Text style={styles.ticketBadgeSerial}>{serialLabel}</Text>
      </View>

      {/* Code */}
      <View style={styles.ticketCodeWrap}>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: status.bg, borderColor: status.border },
          ]}
        >
          <Text style={[styles.statusPillText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* QR icon */}
      <View style={styles.qrIconBtn}>
        <Ionicons name="qr-code-outline" size={20} color={GREEN_500} />
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function BuyerEventDetail() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();

  // Active tab: 3 = En espera, 4 = Comprados
  const [activeTab, setActiveTab] = useState(4);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);

  // Fetch event info (returns Page<EventDto> — extract matching event)
  const { data: eventsPage, loading: loadingEvent } = useFetch(
    eventId ? `${ENDPOINTS_EVENTS.GET_BY_USER}?role=BUYER&eventStatus=2` : null,
  );

  const event =
    eventsPage?.content?.find((e) => String(e.id) === String(eventId)) ?? null;

  // Fetch tickets for the active tab
  const fetchTickets = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await fetchWithAuth(
        `${ENDPOINTS_TICKETS.GET_BUYER}?eventId=${eventId}&ticketStatus=${activeTab}&page=0&size=50`,
      );

      if (!res.ok) throw new Error("No se pudieron cargar los tickets.");
      const body = await res.json();

      const items = Array.isArray(body) ? body : (body?.content ?? []);
      setTickets(
        items.sort((a, b) => (a.serialNumber ?? 0) - (b.serialNumber ?? 0)),
      );
    } catch (err) {
      console.warn("BuyerEventDetail fetch error:", err);
      setTickets([]);
    }
  }, [eventId, activeTab]);

  useEffect(() => {
    setLoadingTickets(true);
    fetchTickets().finally(() => setLoadingTickets(false));
  }, [fetchTickets]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  const openQR = (ticket) => {
    setSelectedTicket(ticket);
    setQrVisible(true);
  };

  const closeQR = () => {
    setQrVisible(false);
    setSelectedTicket(null);
  };

  const isLoading = loadingEvent || loadingTickets;

  // Swipe right → Comprados (4), swipe left → En espera (3)
  const changeTab = (value) => setActiveTab(value);
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      if (Math.abs(e.translationX) < 40) return;
      runOnJS(changeTab)(e.translationX > 0 ? 4 : 3);
    });

  return (
    <View style={styles.root}>
      <QRModal ticket={selectedTicket} visible={qrVisible} onClose={closeQR} />

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        {(event?.imageUrl ?? event?.image) ? (
          <Image
            source={{ uri: event.imageUrl ?? event.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: NEUTRAL_100 }]}
          />
        )}
        <View style={styles.heroScrim} />

        <SafeAreaView style={styles.heroTop} edges={["top"]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={WHITE} />
          </TouchableOpacity>
          <View style={styles.compradorBadge}>
            <Ionicons name="person-outline" size={12} color={GREEN_900} />
            <Text style={styles.compradorBadgeText}>COMPRADOR</Text>
          </View>
        </SafeAreaView>

        {/* Event title inside hero */}
        <View style={styles.heroBottom}>
          <Text style={styles.heroTitle} numberOfLines={2}>
            {event?.title ?? " "}
          </Text>
          {event?.date ? (
            <View style={styles.heroMeta}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.heroMetaText}>{fmtDate(event.date)}</Text>
              {event.place ? (
                <>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color="rgba(255,255,255,0.85)"
                    style={{ marginLeft: 10 }}
                  />
                  <Text style={styles.heroMetaText} numberOfLines={1}>
                    {event.place}
                  </Text>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <View style={styles.tabRow}>
        {[
          { value: 4, label: "Comprados", icon: "checkmark-circle-outline" },
          { value: 3, label: "En espera", icon: "time-outline" },
        ].map((tab) => {
          const active = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.value)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={active ? GREEN_900 : NEUTRAL_500}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {active && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <View style={styles.statsRow}>
        {/* Días restantes */}
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{getDaysLeft(event?.date)}</Text>
          <Text style={styles.statLabel}>días restantes</Text>
        </View>

        <View style={styles.statDivider} />

        {/* Precio por ticket */}
        <View style={styles.statCell}>
          <Text style={styles.statValue}>
            {formatCurrency(event?.ticketPrice)}
          </Text>
          <Text style={styles.statLabel}>por ticket</Text>
        </View>

        <View style={styles.statDivider} />

        {/* Total pagado */}
        <View style={styles.statCell}>
          <Text style={styles.statValue}>
            {formatCurrency((event?.ticketPrice ?? 0) * tickets.length)}
          </Text>
          <Text style={styles.statLabel}>
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* ── Status banner ─────────────────────────────────────────────────── */}
      {(activeTab === 3 || activeTab === 4) && (
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: activeTab === 3 ? AMBER_BG : GREEN_50,
              borderColor: activeTab === 3 ? AMBER_BORDER : GREEN_100,
            },
          ]}
        >
          <Image
            source={{ uri: MASCOT_STATUS_URI }}
            style={styles.bannerMascot}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.bannerTextWrap}>
            <Text
              style={[
                styles.bannerTitle,
                { color: activeTab === 3 ? AMBER_TEXT : GREEN_900 },
              ]}
            >
              {activeTab === 3 ? "Compra en espera" : "¡Compra confirmada!"}
            </Text>
            <Text style={styles.bannerSubtitle}>
              {activeTab === 3
                ? "Tus tickets están reservados. El vendedor validará tu pago para confirmarlos."
                : "El vendedor ya validó tu pago. Tus tickets están activos y listos para el sorteo."}
            </Text>
          </View>
        </View>
      )}

      {/* ── Ticket list ──────────────────────────────────────────────────── */}
      <GestureDetector gesture={swipeGesture}>
        <View style={{ flex: 1 }}>
          {isLoading && tickets.length === 0 ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={GREEN_500} />
            </View>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item, i) =>
                item.code ?? item.id?.toString() ?? String(i)
              }
              renderItem={({ item }) => (
                <TicketItem ticket={item} onPress={() => openQR(item)} />
              )}
              contentContainerStyle={[
                styles.listContent,
                tickets.length === 0 && { flex: 1 },
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={GREEN_500}
                  colors={[GREEN_900]}
                />
              }
              ListHeaderComponent={
                tickets.length > 0 ? (
                  <View style={styles.listHeader}>
                    <Ionicons
                      name="ticket-outline"
                      size={14}
                      color={GREEN_500}
                    />
                    <Text style={styles.listHeaderText}>
                      {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !isLoading ? (
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconBox}>
                      <Image
                        source={
                          "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png"
                        }
                        style={{ width: 80, height: 100 }}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>
                      {activeTab === 4
                        ? "Sin tickets comprados"
                        : "Sin tickets en espera"}
                    </Text>
                    <Text style={styles.emptyText}>
                      {activeTab === 4
                        ? "Aquí aparecerán tus tickets confirmados."
                        : "Aquí aparecerán los tickets pendientes de confirmación."}
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NEUTRAL_50 },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  hero: {
    height: 240,
    backgroundColor: NEUTRAL_100,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.40)",
  },
  heroTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  compradorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_500,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  compradorBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 0.5,
  },
  heroBottom: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 6,
  },
  heroTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 30,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  heroMetaText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.85)",
    fontWeight: Typography.weights.medium,
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    position: "relative",
  },
  tabActive: {},
  tabLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
  },
  tabLabelActive: {
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2.5,
    backgroundColor: GREEN_500,
    borderRadius: 2,
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  listContent: { padding: 14, paddingBottom: 40 },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  listHeaderText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },

  // ── Ticket card ───────────────────────────────────────────────────────────────
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    marginBottom: 10,
    overflow: "hidden",
    gap: 12,
    paddingRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  accentBar: {
    width: 5,
    alignSelf: "stretch",
    flexShrink: 0,
  },
  ticketBadge: {
    width: 100,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    flexShrink: 0,
    marginRight: 5,
  },
  ticketBadgeSerial: {
    fontSize: 15,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  ticketCodeWrap: {
    flex: 1,
    gap: 5,
  },
  ticketCode: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontFamily: Platform.OS === "ios" ? "ui-monospace" : "monospace",
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  qrIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyIconBox: {
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 4,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // ── QR Modal ──────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    alignItems: "center",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginBottom: 20,
  },
  statusBadge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  serialLabel: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 20,
  },
  qrBox: {
    padding: 16,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  qrCaption: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    textAlign: "center",
    marginBottom: 14,
  },
  codeBox: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 20,
  },
  codeText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    fontFamily: Platform.OS === "ios" ? "ui-monospace" : "monospace",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  closeBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  closeBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },

  // ── Stats row ─────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 4,
  },

  // ── Status banner ─────────────────────────────────────────────────────────────
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 2,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bannerMascot: {
    width: 52,
    height: 52,
    flexShrink: 0,
  },
  bannerTextWrap: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  bannerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
    lineHeight: 17,
  },
});
