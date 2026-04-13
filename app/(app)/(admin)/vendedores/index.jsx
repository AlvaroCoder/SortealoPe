import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

// ── Color tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

// ── Rank badge labels ─────────────────────────────────────────────────────────
const RANK_LABELS = ["PREMIUM SELLER", "RISING STAR", "VERIFIED", "ACTIVO"];
const RANK_BADGE_BG = {
  1: GREEN_900,
  2: "#6B7280",
  3: "#92400E",
};

// ── Money formatter ───────────────────────────────────────────────────────────
function formatMoney(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `S/.${n.toFixed(0)}`;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AdminVendedoresPage() {
  const router = useRouter();
  const { eventId, eventStatus } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");

  const { data: event, loading } = useFetch(
    `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=${eventStatus}`,
  );

  const ticketPrice = event?.ticketPrice ?? 0;

  // Sort collections by soldTickets desc → ranking
  const collections = (event?.collections ?? [])
    .slice()
    .sort((a, b) => (b.soldTickets ?? 0) - (a.soldTickets ?? 0));

  // Aggregate metrics
  const totalSold = collections.reduce((s, c) => s + (c.soldTickets ?? 0), 0);
  const totalCollected = totalSold * ticketPrice;
  const totalSellers = collections.length;

  // Client-side search
  const filtered = searchText.trim()
    ? collections.filter((c) => {
        const name =
          `${c.seller?.firstName ?? ""} ${c.seller?.lastName ?? ""} ${c.seller?.username ?? ""}`.toLowerCase();
        return name.includes(searchText.toLowerCase());
      })
    : collections;

  // ── Sub-renders ──────────────────────────────────────────────────────────

  function renderListHeader() {
    return (
      <View style={styles.headerBlock}>
        {/* ── Top nav bar ─────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={GREEN_900} />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>Vendedores del Evento</Text>
            <Text style={styles.topBarSubtitle} numberOfLines={1}>
              {event?.title ?? "—"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.navBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={22} color={GREEN_900} />
          </TouchableOpacity>
        </View>

        {/* ── Total recaudado dark card ────────────────────────────── */}
        <View style={styles.totalCard}>
          {/* Decorative circle */}
          <View style={styles.totalCardCircle} />
          <Text style={styles.totalLabel}>TOTAL RECAUDADO</Text>
          <Text style={styles.totalAmount}>{formatMoney(totalCollected)}</Text>
          {/* Decorative icon */}
          <Ionicons
            name="wallet-outline"
            size={90}
            color="rgba(255,255,255,0.07)"
            style={styles.totalDecorIcon}
          />
        </View>

        {/* ── Mini metric cards ────────────────────────────────────── */}
        <View style={styles.miniRow}>
          <View style={styles.miniCard}>
            <Ionicons
              name="ticket-outline"
              size={22}
              color={GREEN_500}
              style={styles.miniIcon}
            />
            <Text style={styles.miniLabel}>Boletos Vendidos</Text>
            <Text style={[styles.miniValue, { color: GREEN_900 }]}>
              {totalSold.toLocaleString()}
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Ionicons
              name="people-outline"
              size={22}
              color={BLUE_500}
              style={styles.miniIcon}
            />
            <Text style={styles.miniLabel}>Vendedores</Text>
            <Text style={[styles.miniValue, { color: GREEN_900 }]}>
              {totalSellers} Activos
            </Text>
          </View>
        </View>

        {/* ── Search bar ───────────────────────────────────────────── */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={NEUTRAL_500}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vendedor por nombre..."
            placeholderTextColor={NEUTRAL_400}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={NEUTRAL_400} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Section header ────────────────────────────────────────── */}
        <View style={styles.rankingHeader}>
          <Text style={styles.rankingTitle}>Ranking de Ventas</Text>
          <TouchableOpacity style={styles.verTodosBtn}>
            <Text style={styles.verTodosText}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={14} color={GREEN_500} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderSellerCard({ item: col, index }) {
    const rank = index + 1;
    const seller = col.seller;
    const sold = col.soldTickets ?? 0;
    const available = col.availableTickets ?? 0;
    const reserved = col.reservedTickets ?? 0;
    const totalTickets = sold + available + reserved;
    const progress = totalTickets > 0 ? sold / totalTickets : 0;
    const revenue = sold * ticketPrice;
    const isOnline = sold > 0;

    const name =
      seller?.firstName && seller?.lastName
        ? `${seller.firstName} ${seller.lastName}`
        : (seller?.username ?? seller?.email ?? "Vendedor");

    const initial = name[0]?.toUpperCase() ?? "?";
    const badgeLabel = RANK_LABELS[Math.min(rank - 1, RANK_LABELS.length - 1)];
    const rankBg = RANK_BADGE_BG[rank] ?? NEUTRAL_400;

    return (
      <TouchableOpacity
        style={styles.sellerCard}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/(app)/(admin)/vendedores/[id]",
            params: {
              id: seller?.id,
              eventId,
              collectionId: col.id,
              eventStatus,
            },
          })
        }
      >
        {/* Avatar + rank badge + online dot */}
        <View style={styles.avatarWrap}>
          {seller?.photo ? (
            <Image
              source={{ uri: seller.photo }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={[styles.rankBadge, { backgroundColor: rankBg }]}>
            <Text style={styles.rankBadgeText}>#{rank}</Text>
          </View>
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: isOnline ? GREEN_500 : NEUTRAL_400 },
            ]}
          />
        </View>

        {/* Info section */}
        <View style={styles.sellerInfo}>
          {/* Top row: name + revenue */}
          <View style={styles.sellerTopRow}>
            <View style={styles.sellerNameBlock}>
              <Text style={styles.sellerName} numberOfLines={1}>
                {name}
              </Text>
              <View style={styles.sellerMeta}>
                <View style={styles.sellerBadge}>
                  <Text style={styles.sellerBadgeText}>{badgeLabel}</Text>
                </View>
                <Text
                  style={[
                    styles.onlineText,
                    { color: isOnline ? GREEN_500 : NEUTRAL_400 },
                  ]}
                >
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </View>
            <View style={styles.revenueBlock}>
              <Text style={styles.revenueAmount}>{formatMoney(revenue)}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Progress row */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progreso de meta</Text>
            <Text style={styles.progressCount}>
              {sold} / {totalTickets} boletos
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.round(progress * 100))}%` },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={renderSellerCard}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="ticket-outline" size={52} color={NEUTRAL_200} />
            <Text style={styles.emptyText}>
              {searchText ? "Sin coincidencias" : "Sin vendedores asignados"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  listContent: {
    paddingBottom: 32,
  },

  // ── Header block ───────────────────────────────────────────────────────────
  headerBlock: {
    paddingBottom: 8,
  },

  // ── Top nav bar ────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  topBarSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 1,
  },

  // ── Total recaudado card ────────────────────────────────────────────────────
  totalCard: {
    backgroundColor: GREEN_900,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  totalCardCircle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: GREEN_700,
    opacity: 0.25,
    top: -80,
    right: -60,
  },
  totalDecorIcon: {
    position: "absolute",
    bottom: -10,
    right: 12,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 10,
  },
  totalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(22,205,145,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN_500,
  },
  totalBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_500,
  },

  // ── Mini metric cards ───────────────────────────────────────────────────────
  miniRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  miniCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  miniIcon: {
    marginBottom: 8,
  },
  miniLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  miniValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },

  // ── Search bar ─────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    padding: 0,
  },

  // ── Ranking header ─────────────────────────────────────────────────────────
  rankingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rankingTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  verTodosBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  verTodosText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_500,
  },

  // ── Seller card ────────────────────────────────────────────────────────────
  sellerCard: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Avatar block ───────────────────────────────────────────────────────────
  avatarWrap: {
    position: "relative",
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  avatarFallback: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  rankBadge: {
    position: "absolute",
    top: -6,
    left: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: WHITE,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: WHITE,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: WHITE,
  },

  // ── Seller info block ──────────────────────────────────────────────────────
  sellerInfo: {
    flex: 1,
  },
  sellerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  sellerNameBlock: {
    flex: 1,
    gap: 4,
  },
  sellerName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  sellerBadge: {
    backgroundColor: NEUTRAL_100,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sellerBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: NEUTRAL_500,
    letterSpacing: 0.4,
  },
  onlineText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  revenueBlock: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  revenueAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  commissionText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 1,
  },

  // ── Progress ────────────────────────────────────────────────────────────────
  cardDivider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  progressCount: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: NEUTRAL_100,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: GREEN_500,
    borderRadius: 3,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyBox: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
    textAlign: "center",
  },
});
