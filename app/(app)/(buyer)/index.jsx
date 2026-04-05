import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBarCard from "../../../components/common/Card/HeaderBarCard";
import {
  ENDPOINTS_COLLECTIONS,
  ENDPOINTS_EVENTS,
  ENDPOINTS_TICKETS,
  ENDPOINTS_USERS,
} from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { fetchWithAuth } from "../../../lib/fetchWithAuth";
import { useFetch } from "../../../lib/useFetch";
import { usePaginatedFetch } from "../../../lib/usePaginatedFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Ticket status display config ───────────────────────────────────────────────
const TICKET_STATUS = {
  2: { label: "RESERVADO", bg: "#DBEAFE", text: "#1E40AF" },
  3: { label: "PENDIENTE", bg: "#FEF3C7", text: "#92400E" },
  4: { label: "CONFIRMADO", bg: "#D1FAE5", text: "#065F46" },
};

// ── Days remaining helper ──────────────────────────────────────────────────────
const getDaysLeft = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

// ── Event card (horizontal, 240×160 with image overlay) ───────────────────────
function FeaturedEventCard({ event }) {
  const router = useRouter();
  const daysLeft = getDaysLeft(event.date);

  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/(app)/event/[id]",
          params: { id: event.id },
        })
      }
    >
      {/* Background image */}
      {event.image ? (
        <Image
          source={{ uri: event.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: NEUTRAL_100 }]}
        />
      )}

      {/* Dark scrim overlay */}
      <View style={styles.eventCardScrim} />

      {/* Bottom-aligned content */}
      <View style={styles.eventCardContent}>
        {/* Countdown pill */}
        {daysLeft !== null && (
          <View style={styles.eventCountdown}>
            <Ionicons name="time-outline" size={11} color={WHITE} />
            <Text style={styles.eventCountdownText}>{daysLeft}d restantes</Text>
          </View>
        )}

        <Text style={styles.eventCardTitle} numberOfLines={2}>
          {event.title ?? "Evento"}
        </Text>

        {event.place ? (
          <View style={styles.eventCardMeta}>
            <Ionicons
              name="location-outline"
              size={11}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.eventCardMetaText} numberOfLines={1}>
              {event.place}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ── Ticket card (half-width grid card) ────────────────────────────────────────
function TicketCard({ ticket }) {
  const statusConfig = TICKET_STATUS[ticket.ticketStatus] ?? TICKET_STATUS[2];

  // Format ticket code: prefer serialNumber padded to 4 chars, else last 6 of code
  const displayCode = ticket.serialNumber
    ? `#TK-${String(ticket.serialNumber).padStart(4, "0")}`
    : ticket.code
      ? `#${ticket.code.slice(-6).toUpperCase()}`
      : "—";

  return (
    <View style={styles.ticketCard}>
      {/* Icon */}
      <View style={styles.ticketIconBg}>
        <Ionicons name="ticket-outline" size={20} color={GREEN_900} />
      </View>

      {/* Event title */}
      <Text style={styles.ticketCardTitle} numberOfLines={2}>
        {ticket.eventTitle ?? "Evento"}
      </Text>

      {/* Code */}
      <Text style={styles.ticketCardCode}>{displayCode}</Text>

      {/* Status badge */}
      <View style={[styles.ticketBadge, { backgroundColor: statusConfig.bg }]}>
        <Text style={[styles.ticketBadgeText, { color: statusConfig.text }]}>
          {statusConfig.label}
        </Text>
      </View>
    </View>
  );
}

// ── Main buyer dashboard ───────────────────────────────────────────────────────
export default function BuyerDashboard() {
  const router = useRouter();
  const { userData: userStorage } = useAuthContext();
  const userId = userStorage?.userId;

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // User profile (for avatar + name)
  const { data: profileData } = useFetch(
    userId ? `${ENDPOINTS_USERS.GET_BY_ID}${userId}` : null,
  );

  // Active events where the user is a buyer (role=BUYER, eventStatus=2)
  const {
    items: events,
    loading: loadingEvents,
    fetched,
    refresh,
  } = usePaginatedFetch(
    userId ? `${ENDPOINTS_EVENTS.GET_BY_USER}?role=BUYER&eventStatus=2` : null,
  );

  // ── Fetch tickets for each event → each collection ─────────────────────────
  useEffect(() => {
    if (!fetched) return;

    const evList = events ?? [];
    if (evList.length === 0) {
      setTickets([]);
      return;
    }

    let cancelled = false;
    setLoadingTickets(true);

    async function fetchAllTickets() {
      try {
        const all = [];

        await Promise.all(
          evList.map(async (event) => {
            // Fetch collections for this event
            const colRes = await fetchWithAuth(
              `${ENDPOINTS_COLLECTIONS.GET_BY_EVENT}?eventId=${event.id}&page=0&size=50`,
            );
            if (!colRes.ok) return;
            const colJson = await colRes.json();
            const cols = Array.isArray(colJson)
              ? colJson
              : (colJson?.content ?? []);

            // Fetch tickets (status=2 = reservado/comprado) for each collection
            await Promise.all(
              cols.map(async (col) => {
                const res = await fetchWithAuth(
                  `${ENDPOINTS_TICKETS.GET}?eventId=${event.id}&collectionId=${col.id}&ticketStatus=2&page=0&size=200`,
                );
                if (!res.ok) return;
                const json = await res.json();
                const items = Array.isArray(json)
                  ? json
                  : (json?.content ?? []);
                items.forEach((t) =>
                  all.push({
                    id: t.id,
                    code: t.code,
                    serialNumber: t.serialNumber,
                    ticketStatus: t.ticketStatus?.id ?? 2,
                    eventTitle: event.title,
                    place: event.place,
                    date: event.date,
                    ticketPrice: event.ticketPrice,
                    image: event.image,
                    eventId: event.id,
                  }),
                );
              }),
            );
          }),
        );

        if (!cancelled) setTickets(all);
      } catch (err) {
        console.warn("BuyerDashboard fetchAllTickets error:", err);
      } finally {
        if (!cancelled) setLoadingTickets(false);
      }
    }

    fetchAllTickets();
    return () => {
      cancelled = true;
    };
  }, [fetched, events]);

  // ── Display name derivation ────────────────────────────────────────────────
  const firstName =
    profileData?.firstName ??
    userStorage?.firstName ??
    userStorage?.name ??
    "Comprador";
  const lastName = profileData?.lastName ?? userStorage?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const avatarUri =
    profileData?.photo ??
    userStorage?.photo ??
    profileData?.image ??
    userStorage?.image ??
    null;
  const initials = (firstName[0] ?? "C").toUpperCase();

  // ── Filtered data based on searchQuery ────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.place?.toLowerCase().includes(q),
    );
  }, [events, searchQuery]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(
      (t) =>
        t.eventTitle?.toLowerCase().includes(q) ||
        t.place?.toLowerCase().includes(q),
    );
  }, [tickets, searchQuery]);

  // Group tickets into rows of 2 for the manual 2-col grid
  const ticketRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < filteredTickets.length; i += 2) {
      rows.push({
        id: `row-${i}`,
        items: filteredTickets.slice(i, i + 2),
      });
    }
    return rows;
  }, [filteredTickets]);

  const isLoading = loadingEvents || loadingTickets;

  function handleRefresh() {
    refresh();
  }

  return (
    <View style={styles.root}>
      {/* SafeAreaView only for the top (header background fills safe area) */}
      <SafeAreaView style={styles.safeTop} edges={["top"]} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={loadingEvents && tickets.length === 0}
            onRefresh={handleRefresh}
            tintColor={GREEN_500}
          />
        }
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <HeaderBarCard
          avatarUri={avatarUri}
          initials={initials}
          fullName={fullName}
          role="COMPRADOR"
          onAvatarPress={() => router.push("/(app)/(drawer)/profile")}
        />

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={NEUTRAL_500}
            style={{ marginLeft: 14, marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar rifas, premios o marcas..."
            placeholderTextColor={NEUTRAL_500}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={{ paddingHorizontal: 12 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={NEUTRAL_500} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Destacados section (horizontal scroll of event cards) ─────── */}
        {filteredEvents.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eventos Destacados</Text>
              <Text style={styles.sectionCount}>
                {filteredEvents.length} evento
                {filteredEvents.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsRow}
            >
              {filteredEvents.map((event) => (
                <FeaturedEventCard key={String(event.id)} event={event} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Mis tickets activos section ──────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis tickets activos</Text>
          {filteredTickets.length > 0 && (
            <Text style={styles.sectionCount}>
              {filteredTickets.length} ticket
              {filteredTickets.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={GREEN_500} />
          </View>
        )}

        {/* Empty state */}
        {!isLoading && filteredTickets.length === 0 && (
          <View style={styles.emptyTickets}>
            <Ionicons name="ticket-outline" size={48} color={NEUTRAL_200} />
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? "No se encontraron tickets."
                : "Aun no tienes tickets activos."}
            </Text>
          </View>
        )}

        {/* 2-column ticket grid (rendered manually — no nested FlatList) */}
        {!isLoading &&
          ticketRows.map((row) => (
            <View key={row.id} style={styles.ticketRow}>
              <TicketCard ticket={row.items[0]} />
              {row.items[1] ? (
                <TicketCard ticket={row.items[1]} />
              ) : (
                <View style={styles.ticketCardPlaceholder} />
              )}
            </View>
          ))}

        {/* Bottom clearance for the FAB */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── FAB: Escanear QR ──────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(app)/(buyer)/scan")}
      >
        <Ionicons name="scan-outline" size={20} color={WHITE} />
        <Text style={styles.fabText}>Escanear QR</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  safeTop: {
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // ── Search bar ──────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    marginHorizontal: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    paddingVertical: 12,
  },

  // ── Section headers ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  sectionCount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
  },

  // ── Featured events (horizontal scroll) ────────────────────────────────────
  eventsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventCard: {
    width: 240,
    height: 160,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  eventCardScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  eventCardContent: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    gap: 4,
  },
  eventCountdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventCountdownText: {
    fontSize: 10,
    color: WHITE,
    fontWeight: Typography.weights.semibold,
  },
  eventCardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 20,
  },
  eventCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventCardMetaText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },

  // ── Ticket 2-col grid ───────────────────────────────────────────────────────
  ticketRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  ticketCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketCardPlaceholder: {
    flex: 1,
  },
  ticketIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketCardTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  ticketCardCode: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  ticketBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ticketBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.3,
  },

  // ── States ──────────────────────────────────────────────────────────────────
  centered: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTickets: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: WHITE,
    marginHorizontal: 16,
    borderRadius: 16,
    gap: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  // ── FAB ─────────────────────────────────────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 45,
    right: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: GREEN_900,
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
  },
});
