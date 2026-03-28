import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Colors, Typography } from "../../../../../constants/theme";
import {
  ENDPOINTS_EVENTS,
  ENDPOINTS_TICKETS,
} from "../../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../../context/AuthContext";
import { fetchWithAuth } from "../../../../../lib/fetchWithAuth";
import LoadingScreen from "../../../../../screens/LoadingScreen";

// ─── Color tokens ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const YELLOW_500 = Colors.principal.yellow[500];
const YELLOW_100 = Colors.principal.yellow[100];
const YELLOW_700 = Colors.principal.yellow[700];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    key: "SOLD",
    label: "Comprados",
    icon: "checkmark-circle-outline",
    color: GREEN_500,
  },
  {
    key: "RESERVED",
    label: "Reservados",
    icon: "time-outline",
    color: YELLOW_500,
  },
];

// ─── Date helpers ─────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────
function TicketDetailModal({ ticket, visible, onClose }) {
  if (!ticket) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        {/* Prevent tap-through on card content */}
        <Pressable style={styles.modalWrapper} onPress={() => {}}>
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Physical ticket card ── */}
            <View style={styles.ticketCard}>

              {/* TOP SECTION */}
              <View style={styles.ticketTop}>
                {/* Event title banner */}
                <View style={styles.ticketBanner}>
                  <Text style={styles.ticketBannerText} numberOfLines={2}>
                    {ticket.eventTitle ?? "Evento"}
                  </Text>
                </View>

                {/* 2-column info row: Lugar + Precio */}
                <View style={styles.ticketInfoGrid}>
                  <View style={styles.ticketInfoCell}>
                    <Text style={styles.ticketInfoLabel}>Lugar</Text>
                    <Text style={styles.ticketInfoValue} numberOfLines={2}>
                      {ticket.place ?? "—"}
                    </Text>
                  </View>
                  <View style={[styles.ticketInfoCell, styles.ticketInfoCellRight]}>
                    <Text style={styles.ticketInfoLabel}>Precio</Text>
                    <Text style={[styles.ticketInfoValue, styles.ticketPriceValue]}>
                      S/. {ticket.price?.toFixed(2) ?? "—"}
                    </Text>
                  </View>
                </View>

                {/* 2-column info row: Fecha + Hora */}
                <View style={styles.ticketInfoGrid}>
                  <View style={styles.ticketInfoCell}>
                    <Text style={styles.ticketInfoLabel}>Fecha</Text>
                    <Text style={styles.ticketInfoValue}>
                      {formatDate(ticket.date)}
                    </Text>
                  </View>
                  <View style={[styles.ticketInfoCell, styles.ticketInfoCellRight]}>
                    <Text style={styles.ticketInfoLabel}>Hora</Text>
                    <Text style={styles.ticketInfoValue}>
                      {formatTime(ticket.date)}
                    </Text>
                  </View>
                </View>

                {/* Image / icon placeholder */}
                <View style={styles.ticketImageBox}>
                  <Ionicons name="gift-outline" size={52} color={NEUTRAL_500} />
                </View>

                {/* Serial number pill */}
                <View style={styles.serialPill}>
                  <Text style={styles.serialText}>
                    N.° {ticket.serialNumber ?? "—"}
                  </Text>
                </View>
              </View>

              {/* TEAR LINE */}
              <View style={styles.tearLine}>
                {/* Left notch */}
                <View style={styles.notchLeft} />
                {/* Dashed centre */}
                <View style={styles.dashedCenter} />
                {/* Right notch */}
                <View style={styles.notchRight} />
              </View>

              {/* BOTTOM SECTION (stub) */}
              <View style={styles.ticketBottom}>
                <View style={styles.stubRow}>
                  {/* Left column: buyer info */}
                  <View style={styles.stubInfo}>
                    <Text style={styles.stubLabel}>Nombre y Apellido</Text>
                    <Text style={styles.stubValue} numberOfLines={2}>
                      {ticket.buyerName ?? "—"}
                    </Text>

                    <Text style={[styles.stubLabel, { marginTop: 10 }]}>
                      Celular
                    </Text>
                    <Text style={styles.stubValue}>
                      {ticket.buyerPhone ?? "—"}
                    </Text>

                    <Text style={[styles.stubLabel, { marginTop: 10 }]}>
                      Fecha
                    </Text>
                    <Text style={styles.stubValue}>
                      {formatDate(ticket.date)}
                    </Text>

                    <Text style={[styles.stubLabel, { marginTop: 10 }]}>
                      Lugar
                    </Text>
                    <Text style={styles.stubValue} numberOfLines={2}>
                      {ticket.place ?? "—"}
                    </Text>
                  </View>

                  {/* Right column: QR code */}
                  <View style={styles.stubQR}>
                    <QRCode
                      value={ticket.code ?? "sortealo"}
                      size={100}
                      color={GREEN_900}
                      backgroundColor={WHITE}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Close button below card */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Ticket list item ─────────────────────────────────────────────────────────
function TicketItem({ ticket, onPress }) {
  const isSold = ticket.status === "SOLD";

  return (
    <TouchableOpacity
      style={[styles.itemCard, isSold ? styles.itemCardSold : styles.itemCardReserved]}
      onPress={isSold ? onPress : undefined}
      activeOpacity={isSold ? 0.75 : 1}
    >
      {/* Colored left accent bar */}
      <View
        style={[
          styles.itemAccentBar,
          { backgroundColor: isSold ? GREEN_500 : YELLOW_500 },
        ]}
      />

      <View style={styles.itemBody}>
        {/* Event title */}
        <Text
          style={[
            styles.itemTitle,
            isSold ? styles.itemTitleSold : styles.itemTitleReserved,
          ]}
          numberOfLines={1}
        >
          {ticket.eventTitle ?? "Evento"}
        </Text>

        {/* Place & date row */}
        <View style={styles.itemMetaRow}>
          <Ionicons name="location-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.itemMetaText} numberOfLines={1}>
            {ticket.place ?? "—"}
          </Text>
        </View>
        <View style={styles.itemMetaRow}>
          <Ionicons name="calendar-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.itemMetaText}>
            {formatDate(ticket.date)}  {formatTime(ticket.date)}
          </Text>
        </View>

        {/* Bottom row: price chip + action */}
        <View style={styles.itemFooter}>
          {/* Price chip */}
          <View
            style={[
              styles.priceChip,
              isSold ? styles.priceChipSold : styles.priceChipReserved,
            ]}
          >
            <Text
              style={[
                styles.priceChipText,
                isSold ? styles.priceChipTextSold : styles.priceChipTextReserved,
              ]}
            >
              S/. {ticket.price?.toFixed(2) ?? "—"}
            </Text>
          </View>

          {/* Right side action / badge */}
          {isSold ? (
            <Text style={styles.itemDetailLink}>Ver detalle →</Text>
          ) : (
            <View style={styles.pendingBadge}>
              <Ionicons
                name="time-outline"
                size={12}
                color={YELLOW_700}
                style={{ marginRight: 3 }}
              />
              <Text style={styles.pendingBadgeText}>Pendiente de pago</Text>
            </View>
          )}
        </View>

        {/* Reserved warning note */}
        {!isSold && (
          <View style={styles.reservedNote}>
            <Ionicons name="information-circle-outline" size={13} color={YELLOW_700} />
            <Text style={styles.reservedNoteText}>
              Escaneaste el QR, pago no confirmado
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HistoryTickets() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { loading: loadingAuth } = useAuthContext();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip until auth is ready
    if (loadingAuth) return;

    let cancelled = false;

    async function loadTickets() {
      setLoading(true);
      try {
        // Step 1: fetch all events where the user is a BUYER
        const eventsRes = await fetchWithAuth(
          `${ENDPOINTS_EVENTS.GET_BY_USER}?role=BUYER&page=0&size=50`
        );
        if (!eventsRes.ok) return;

        const eventsJson = await eventsRes.json();
        const events = Array.isArray(eventsJson)
          ? eventsJson
          : eventsJson?.content ?? [];

        if (events.length === 0) {
          if (!cancelled) setTickets([]);
          return;
        }

        // Step 2: for every event, fetch SOLD (status=3) and RESERVED (status=2) tickets
        const allTickets = [];

        await Promise.all(
          events.map(async (event) => {
            const [soldRes, reservedRes] = await Promise.all([
              fetchWithAuth(
                `${ENDPOINTS_TICKETS.GET}?eventId=${event.id}&ticketStatus=3&page=0&size=200`
              ),
              fetchWithAuth(
                `${ENDPOINTS_TICKETS.GET}?eventId=${event.id}&ticketStatus=2&page=0&size=200`
              ),
            ]);

            // Helper: extract ticket array from Page<TicketDto> or plain array
            async function extractTickets(res, statusLabel) {
              if (!res.ok) return [];
              const json = await res.json();
              const items = Array.isArray(json) ? json : json?.content ?? [];
              return items.map((t) => ({
                id: t.id,
                code: t.code,
                serialNumber: t.serialNumber,
                status: statusLabel,
                eventTitle: event.title,
                place: event.place,
                date: event.date,
                price: event.ticketPrice,
                buyerName: t.buyer
                  ? `${t.buyer.firstName ?? ""} ${t.buyer.lastName ?? ""}`.trim()
                  : null,
                buyerPhone: t.buyer?.phone ?? null,
              }));
            }

            const [sold, reserved] = await Promise.all([
              extractTickets(soldRes, "SOLD"),
              extractTickets(reservedRes, "RESERVED"),
            ]);

            allTickets.push(...sold, ...reserved);
          })
        );

        if (!cancelled) setTickets(allTickets);
      } catch (err) {
        console.warn("HistoryTickets fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();

    return () => {
      cancelled = true;
    };
  }, [loadingAuth]);

  const filteredTickets = tickets.filter((t) => t.status === activeTab);

  function openDetail(ticket) {
    setSelectedTicket(ticket);
    setModalVisible(true);
  }

  function closeDetail() {
    setModalVisible(false);
    setSelectedTicket(null);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {(loadingAuth || loading) && <LoadingScreen />}

      {/* ── Tabs ── */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && {
                backgroundColor: GREEN_900,
                borderColor: GREEN_900,
              },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={17}
              color={activeTab === tab.key ? WHITE : GREEN_900}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subtitle note for RESERVED tab */}
      {activeTab === "RESERVED" && (
        <View style={styles.reservedHint}>
          <Ionicons name="alert-circle-outline" size={14} color={YELLOW_700} />
          <Text style={styles.reservedHintText}>
            Escaneaste el QR pero aún no pagaste
          </Text>
        </View>
      )}

      {/* ── Ticket list ── */}
      <FlatList
        data={filteredTickets}
        keyExtractor={(item, idx) =>
          item.id?.toString() ?? idx.toString()
        }
        renderItem={({ item }) => (
          <TicketItem ticket={item} onPress={() => openDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
              <Text style={styles.emptyText}>
                No tienes tickets{" "}
                {activeTab === "SOLD" ? "comprados" : "reservados"}.
              </Text>
            </View>
          )
        }
      />

      {/* ── FAB: Escanear QR de compra ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(app)/tickets/scan")}
      >
        <Ionicons name="scan-outline" size={20} color={WHITE} />
        <Text style={styles.fabText}>Escanear QR</Text>
      </TouchableOpacity>

      {/* ── Ticket detail modal (SOLD only) ── */}
      <TicketDetailModal
        ticket={selectedTicket}
        visible={modalVisible}
        onClose={closeDetail}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },

  // ── Tabs ──
  tabContainer: {
    flexDirection: "row",
    backgroundColor: GREEN_50,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    gap: 6,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  tabTextActive: {
    color: WHITE,
  },

  // ── Reserved hint banner ──
  reservedHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: YELLOW_100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: YELLOW_500,
  },
  reservedHintText: {
    fontSize: Typography.sizes.xs,
    color: YELLOW_700,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },

  // ── List ──
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GREEN_900,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: GREEN_900,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: WHITE,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },

  // ── Ticket item card ──
  itemCard: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemCardSold: {
    borderColor: Colors.principal.green[200],
  },
  itemCardReserved: {
    borderColor: Colors.principal.yellow[200],
  },
  itemAccentBar: {
    width: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  itemBody: {
    flex: 1,
    padding: 14,
    gap: 5,
  },
  itemTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  itemTitleSold: {
    color: GREEN_900,
  },
  itemTitleReserved: {
    color: NEUTRAL_700,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemMetaText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    flex: 1,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priceChipSold: {
    backgroundColor: Colors.principal.green[100],
  },
  priceChipReserved: {
    backgroundColor: YELLOW_100,
  },
  priceChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  priceChipTextSold: {
    color: GREEN_900,
  },
  priceChipTextReserved: {
    color: YELLOW_700,
  },
  itemDetailLink: {
    fontSize: Typography.sizes.xs,
    color: GREEN_500,
    fontWeight: Typography.weights.semibold,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: YELLOW_100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pendingBadgeText: {
    fontSize: Typography.sizes.xs,
    color: YELLOW_700,
    fontWeight: Typography.weights.semibold,
  },
  reservedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  reservedNoteText: {
    fontSize: Typography.sizes.xs,
    color: YELLOW_700,
    flex: 1,
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: GREEN_50,
    borderRadius: 12,
    marginTop: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 12,
    textAlign: "center",
  },

  // ── Modal backdrop + wrapper ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: "90%",
    maxHeight: "90%",
  },
  modalScrollContent: {
    paddingVertical: 12,
    alignItems: "center",
  },

  // ── Physical ticket card ──
  ticketCard: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 20,
    // Shadow
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  // Top section
  ticketTop: {
    paddingBottom: 16,
  },
  ticketBanner: {
    backgroundColor: GREEN_500,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  ticketBannerText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
  ticketInfoGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ticketInfoCell: {
    flex: 1,
  },
  ticketInfoCellRight: {
    borderLeftWidth: 1,
    borderLeftColor: NEUTRAL_200,
    paddingLeft: 16,
  },
  ticketInfoLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ticketInfoValue: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.normal,
  },
  ticketPriceValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_500,
  },
  ticketImageBox: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 180,
    borderRadius: 12,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
  },
  serialPill: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: NEUTRAL_100,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  serialText: {
    fontFamily: Platform.OS === "ios" ? "ui-monospace" : "monospace",
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    letterSpacing: 2,
  },

  // Tear line
  tearLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  notchLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)", // matches backdrop color
    marginLeft: -10,
  },
  dashedCenter: {
    flex: 1,
    height: 0,
    borderTopWidth: 1.5,
    borderColor: NEUTRAL_200,
    borderStyle: "dashed",
    marginHorizontal: 4,
  },
  notchRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)", // matches backdrop color
    marginRight: -10,
  },

  // Bottom stub section
  ticketBottom: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  stubRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stubInfo: {
    flex: 1,
    paddingRight: 12,
  },
  stubLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  stubValue: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  stubQR: {
    padding: 8,
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    alignSelf: "flex-start",
  },

  // Close button
  closeButton: {
    marginTop: 16,
    backgroundColor: GREEN_900,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});