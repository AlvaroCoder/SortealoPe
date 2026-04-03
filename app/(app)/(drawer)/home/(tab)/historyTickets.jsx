import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ENDPOINTS_COLLECTIONS,
  ENDPOINTS_EVENTS,
  ENDPOINTS_TICKETS,
} from "../../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../../constants/theme";
import { fetchWithAuth } from "../../../../../lib/fetchWithAuth";
import { usePaginatedFetch } from "../../../../../lib/usePaginatedFetch";
import LoadingScreen from "../../../../../screens/LoadingScreen";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ─── Date helpers ──────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Ticket Detail Modal ───────────────────────────────────────────────────────
function TicketDetailModal({ ticket, visible, onClose }) {
  if (!ticket) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
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
                    {ticket.title ?? "Evento"}
                  </Text>
                </View>

                {/* 2-column: Lugar + Precio */}
                <View style={styles.ticketInfoGrid}>
                  <View style={styles.ticketInfoCell}>
                    <Text style={styles.ticketInfoLabel}>Lugar</Text>
                    <Text style={styles.ticketInfoValue} numberOfLines={2}>
                      {ticket.place ?? "—"}
                    </Text>
                  </View>
                  <View
                    style={[styles.ticketInfoCell, styles.ticketInfoCellRight]}
                  >
                    <Text style={styles.ticketInfoLabel}>Precio</Text>
                    <Text
                      style={[styles.ticketInfoValue, styles.ticketPriceValue]}
                    >
                      S/. {ticket.ticketPrice?.toFixed(2) ?? "—"}
                    </Text>
                  </View>
                </View>

                {/* 2-column: Fecha + Hora */}
                <View style={styles.ticketInfoGrid}>
                  <View style={styles.ticketInfoCell}>
                    <Text style={styles.ticketInfoLabel}>Fecha</Text>
                    <Text style={styles.ticketInfoValue}>
                      {formatDate(ticket.date)}
                    </Text>
                  </View>
                  <View
                    style={[styles.ticketInfoCell, styles.ticketInfoCellRight]}
                  >
                    <Text style={styles.ticketInfoLabel}>Hora</Text>
                    <Text style={styles.ticketInfoValue}>
                      {formatTime(ticket.date)}
                    </Text>
                  </View>
                </View>

                {/* Icon placeholder */}
                <View style={styles.ticketImageBox}>
                  <Image
                    source={ticket?.image}
                    style={{ width: 384, height: 216 }}
                  />
                </View>
              </View>

              {/* TEAR LINE */}
              <View style={styles.tearLine}>
                <View style={styles.notchLeft} />
                <View style={styles.dashedCenter} />
                <View style={styles.notchRight} />
              </View>

              {/* BOTTOM STUB */}
              <View style={styles.ticketBottom}>
                <View style={styles.stubRow}>
                  <View style={styles.stubInfo}>
                    <Text style={styles.stubValue}>{ticket.phone ?? "—"}</Text>

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

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Ticket list item ──────────────────────────────────────────────────────────
function TicketItem({ ticket, onPress }) {
  return (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Green accent bar */}
      <View style={styles.itemAccentBar} />

      <View style={styles.itemBody}>
        {/* Event title */}
        <Text style={styles.itemTitle} numberOfLines={1}>
          {ticket.eventTitle ?? "Evento"}
        </Text>

        {/* Place */}
        <View style={styles.itemMetaRow}>
          <Ionicons name="location-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.itemMetaText} numberOfLines={1}>
            {ticket.place ?? "—"}
          </Text>
        </View>

        {/* Date */}
        <View style={styles.itemMetaRow}>
          <Ionicons name="calendar-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.itemMetaText}>
            {formatDate(ticket.date)} {formatTime(ticket.date)}
          </Text>
        </View>

        {/* Footer: price + link */}
        <View style={styles.itemFooter}>
          <View style={styles.priceChip}>
            <Text style={styles.priceChipText}>
              S/. {ticket.ticketPrice?.toFixed(2) ?? "—"}
            </Text>
          </View>
          <Text style={styles.itemDetailLink}>Ver detalle →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────
export default function HistoryTickets() {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const {
    items: events,
    loading: loadingEvents,
    fetched,
    refresh,
  } = usePaginatedFetch(
    `${ENDPOINTS_EVENTS.GET_BY_USER}?role=BUYER&eventStatus=2`,
  );

  console.log(events);

  useEffect(() => {
    if (!fetched) return;

    const evList = events ?? [];
    if (evList.length === 0) {
      setTickets([]);
      return;
    }

    let cancelled = false;
    setLoadingTickets(true);

    async function fetchTickets() {
      try {
        const all = [];

        await Promise.all(
          evList.map(async (event) => {
            // Obtener colecciones del evento
            const colRes = await fetchWithAuth(
              `${ENDPOINTS_COLLECTIONS.GET_BY_EVENT}?eventId=${event.id}&page=0&size=50`,
            );
            if (!colRes.ok) return;
            const colJson = await colRes.json();
            const cols = Array.isArray(colJson)
              ? colJson
              : (colJson?.content ?? []);

            // Tickets comprados (ticketStatus=2) por colección
            await Promise.all(
              cols.map(async (col) => {
                const res = await fetchWithAuth(
                  `${ENDPOINTS_TICKETS.GET}?eventId=${event.id}&collectionId=${col.id}&ticketStatus=2&page=0&size=200`,
                );

                if (!res.ok) return;
                const json = await res.json();
                console.log("Respuesta : ", json);

                const items = Array.isArray(json)
                  ? json
                  : (json?.content ?? []);
                items.forEach((t) =>
                  all.push({
                    id: t.id,
                    code: t.code,
                    serialNumber: t.serialNumber,
                    eventTitle: event.title,
                    place: event.place,
                    date: event.date,
                    price: event.ticketPrice,
                    image: event.image,
                    buyerName: t.buyer
                      ? `${t.buyer.firstName ?? ""} ${t.buyer.lastName ?? ""}`.trim()
                      : null,
                    buyerPhone: t.buyer?.phone ?? null,
                  }),
                );
              }),
            );
          }),
        );

        if (!cancelled) setTickets(all);
      } catch (err) {
        console.warn("HistoryTickets fetch error:", err);
      } finally {
        if (!cancelled) setLoadingTickets(false);
      }
    }

    fetchTickets();
    return () => {
      cancelled = true;
    };
  }, [fetched, events]);

  function openDetail(ticket) {
    setSelectedTicket(ticket);
    setModalVisible(true);
  }

  function closeDetail() {
    setModalVisible(false);
    setSelectedTicket(null);
  }

  const isLoading = loadingEvents || loadingTickets;
  console.log("Ticket seleccionado : ", selectedTicket);

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {isLoading && <LoadingScreen />}

      {/* ── Ticket list ── */}
      <FlatList
        data={events}
        keyExtractor={(item, idx) => item.id?.toString() ?? idx.toString()}
        renderItem={({ item }) => (
          <TicketItem ticket={item} onPress={() => openDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={refresh}
        refreshing={loadingEvents}
        ListHeaderComponent={
          !isLoading && tickets.length > 0 ? (
            <View style={styles.listHeader}>
              <Ionicons name="ticket-outline" size={15} color={GREEN_500} />
              <Text style={styles.listHeaderText}>
                {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}{" "}
                comprado{tickets.length !== 1 ? "s" : ""}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
              <Text style={styles.emptyText}>
                Aún no tienes tickets comprados.
              </Text>
            </View>
          )
        }
      />

      {/* ── FAB: Escanear QR ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(app)/tickets/scan")}
      >
        <Ionicons name="scan-outline" size={20} color={WHITE} />
        <Text style={styles.fabText}>Escanear QR</Text>
      </TouchableOpacity>

      {/* ── Detail modal ── */}
      <TicketDetailModal
        ticket={selectedTicket}
        visible={modalVisible}
        onClose={closeDetail}
      />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },

  // ── List header ──
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  listHeaderText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },

  // ── FAB ──
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
    borderColor: Colors.principal.green[200],
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemAccentBar: {
    width: 5,
    backgroundColor: GREEN_500,
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
    color: GREEN_900,
    marginBottom: 2,
  },
  serialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  serialBadge: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    fontFamily: Platform.OS === "ios" ? "ui-monospace" : "monospace",
    letterSpacing: 0.5,
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
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priceChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  itemDetailLink: {
    fontSize: Typography.sizes.xs,
    color: GREEN_500,
    fontWeight: Typography.weights.semibold,
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: GREEN_50,
    borderRadius: 16,
    marginTop: 24,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 14,
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
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
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
    marginTop: 30,
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
    backgroundColor: "rgba(0,0,0,0.55)",
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
    backgroundColor: "rgba(0,0,0,0.55)",
    marginRight: -10,
  },

  // Bottom stub
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
