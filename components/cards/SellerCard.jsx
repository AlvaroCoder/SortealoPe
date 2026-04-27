import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

const RANK_LABELS = ["PREMIUM SELLER", "RISING STAR", "VERIFIED", "ACTIVO"];
const RANK_BADGE_BG = {
  1: GREEN_900,
  2: "#6B7280",
  3: "#92400E",
};

function formatMoney(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `S/.${n.toFixed(0)}`;
}

export default function SellerCard({
  item: col,
  index,
  ticketPrice,
  eventId,
  eventStatus,
}) {
  const router = useRouter();
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

const styles = StyleSheet.create({
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
});
