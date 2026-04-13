import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
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
  ENDPOINTS_EVENTS,
  ENDPOINTS_USERS,
} from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import { usePaginatedFetch } from "../../../lib/usePaginatedFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const SAD_MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png";

// ── Helpers ────────────────────────────────────────────────────────────────────
const getDaysLeft = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Full-width event card ──────────────────────────────────────────────────────
function EventCard({ event }) {
  const router = useRouter();
  const daysLeft = getDaysLeft(event.date);
  const dateLabel = formatDate(event.date);

  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.88}
      onPress={() =>
        router.push({
          pathname: "/(app)/(buyer)/events/[id]",
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
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.eventCardPlaceholder]} />
      )}

      {/* Gradient scrim */}
      <View style={styles.eventCardScrim} />

      {/* Top-right: days remaining */}
      {daysLeft !== null && (
        <View style={styles.countdownPill}>
          <Ionicons name="time-outline" size={12} color={WHITE} />
          <Text style={styles.countdownText}>{daysLeft}d restantes</Text>
        </View>
      )}

      {/* Bottom content */}
      <View style={styles.eventCardContent}>
        <Text style={styles.eventCardTitle} numberOfLines={2}>
          {event.title ?? "Evento"}
        </Text>

        <View style={styles.eventCardMeta}>
          {event.place ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-outline"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.place}
              </Text>
            </View>
          ) : null}

          {dateLabel ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.metaText}>{dateLabel}</Text>
            </View>
          ) : null}
        </View>

        {/* Ticket badge */}
        <View style={styles.ticketBadge}>
          <Ionicons name="ticket-outline" size={12} color={GREEN_500} />
          <Text style={styles.ticketBadgeText}>Tienes tickets</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Image
        source={{ uri: SAD_MASCOT_URI }}
        style={styles.emptyMascot}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
      <Text style={styles.emptyTitle}>Aún no tienes tickets</Text>
      <Text style={styles.emptySubtitle}>
        Escanea el QR de un vendedor para reservar tus tickets y aparecer aquí.
      </Text>
    </View>
  );
}

// ── Main buyer dashboard ───────────────────────────────────────────────────────
export default function BuyerDashboard() {
  const router = useRouter();
  const { userData: userStorage } = useAuthContext();
  const userId = userStorage?.userId;

  const [searchQuery, setSearchQuery] = useState("");

  // User profile (for avatar + name)
  const { data: profileData } = useFetch(
    userId ? `${ENDPOINTS_USERS.GET_BY_ID}${userId}` : null,
  );

  // Events where the user is a buyer (role=BUYER, eventStatus=2)
  const {
    items: events,
    loading: loadingEvents,
    refresh,
  } = usePaginatedFetch(
    userId ? `${ENDPOINTS_EVENTS.GET_BY_USER}?role=BUYER&eventStatus=2` : null,
  );

  // ── Display name ──────────────────────────────────────────────────────────
  const firstName = profileData?.firstName
    ? profileData.firstName
    : (profileData?.email?.split("@")?.[0] ?? "Comprador");
  const lastName = profileData?.lastName ?? userStorage?.lastName ?? "";
  const fullName = [firstName, lastName?.substring(0, 3)]
    .filter(Boolean)
    .join(" ");
  const avatarUri =
    profileData?.photo ??
    userStorage?.photo ??
    profileData?.image ??
    userStorage?.image ??
    null;
  const initials = (firstName[0] ?? "C").toUpperCase();

  // ── Search filter ─────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.place?.toLowerCase().includes(q),
    );
  }, [events, searchQuery]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} edges={["top"]} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={loadingEvents && events.length === 0}
            onRefresh={refresh}
            tintColor={GREEN_500}
            colors={[GREEN_500]}
          />
        }
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <HeaderBarCard
          avatarUri={avatarUri}
          initials={initials}
          fullName={fullName}
          role="COMPRADOR"
          onAvatarPress={() => router.push("/(app)/(buyer)/profile")}
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
            placeholder="Buscar rifas o eventos..."
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

        {/* ── Section title ────────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Eventos</Text>
          {filteredEvents.length > 0 && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>
                {filteredEvents.length}
              </Text>
            </View>
          )}
        </View>

        {/* ── Event list or empty state ─────────────────────────────────────── */}
        {filteredEvents.length === 0 && !loadingEvents ? (
          <EmptyState />
        ) : (
          <View style={styles.eventList}>
            {filteredEvents.map((event) => (
              <EventCard key={String(event.id)} event={event} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
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

  // ── Section header ──────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  sectionBadge: {
    backgroundColor: GREEN_50,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
  },
  sectionBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Event list (vertical) ───────────────────────────────────────────────────
  eventList: {
    paddingHorizontal: 16,
    gap: 14,
  },

  // ── Event card (full-width) ─────────────────────────────────────────────────
  eventCard: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  eventCardPlaceholder: {
    backgroundColor: NEUTRAL_400,
  },
  eventCardScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  countdownPill: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.50)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: Typography.sizes.xs,
    color: WHITE,
    fontWeight: Typography.weights.semibold,
  },
  eventCardContent: {
    padding: 16,
    gap: 6,
  },
  eventCardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 24,
  },
  eventCardMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.80)",
    fontWeight: Typography.weights.medium,
    flexShrink: 1,
  },
  ticketBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,71,57,0.75)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  ticketBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_500,
  },

  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 12,
  },
  emptyMascot: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 21,
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
