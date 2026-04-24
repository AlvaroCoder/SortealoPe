import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Colors, Typography } from "../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_700 = Colors.principal.green[700];
const NEUTRAL_700 = Colors.principal.neutral[700];

const WHITE = "#FFFFFF";

export default function ListHeaderComponente({
  event,
  searchText,
  setSearchText,
}) {
  const router = useRouter();

  function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `S/.${n.toFixed(0)}`;
  }

  const collections = (event?.collections ?? [])
    .slice()
    .sort((a, b) => (b.soldTickets ?? 0) - (a.soldTickets ?? 0));

  // Aggregate metrics

  const ticketPrice = event?.ticketPrice ?? 0;

  const totalSold = collections.reduce((s, c) => s + (c.soldTickets ?? 0), 0);
  const totalCollected = totalSold * ticketPrice;
  const totalSellers = collections.length;
  return (
    <View style={styles.headerBlock}>
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
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalCardCircle} />
        <Text style={styles.totalLabel}>TOTAL RECAUDADO</Text>
        <Text style={styles.totalAmount}>{formatMoney(totalCollected)}</Text>
        <Ionicons
          name="wallet-outline"
          size={90}
          color="rgba(255,255,255,0.07)"
          style={styles.totalDecorIcon}
        />
      </View>

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
        <Text style={styles.rankingTitle}>Ranking</Text>
        <TouchableOpacity style={styles.verTodosBtn}>
          <Text style={styles.verTodosText}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={14} color={GREEN_500} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
