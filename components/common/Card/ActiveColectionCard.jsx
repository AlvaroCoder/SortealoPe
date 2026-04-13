import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useFetch } from "../../../lib/useFetch";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const ORANGE = "#F59E0B";
const WHITE = "#FFFFFF";

const URL_MASCOTA =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png";

// ── Circular gauge ─────────────────────────────────────────────────────────────
const RADIUS = 52;
const STROKE = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = 134;
const CENTER = SVG_SIZE / 2;

function CircularGauge({ percent }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  return (
    <View style={styles.gaugeWrap}>
      <Svg width={SVG_SIZE} height={SVG_SIZE}>
        {/* Track */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={GREEN_500}
          strokeWidth={STROKE}
          strokeDasharray={String(CIRCUMFERENCE)}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90, ${CENTER}, ${CENTER})`}
        />
      </Svg>
      <View style={styles.gaugeCenter}>
        <Text style={styles.gaugePercent}>{clamped}%</Text>
        <Text style={styles.gaugeLabel}>VENDIDO</Text>
      </View>
    </View>
  );
}

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label, color }) {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={[styles.heroCard, styles.emptyCard]}>
      <View style={styles.heroDotLarge} />
      <View style={styles.heroDotSmall} />
      <View style={styles.emptyRow}>
        <Image
          source={{ uri: URL_MASCOTA }}
          style={styles.mascota}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <View style={styles.emptyTexts}>
          <Text style={styles.emptyTitle}>Sin eventos activos</Text>
          <Text style={styles.emptySubtitle}>
            Únete a un evento escaneando el QR de tu administrador.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ActiveColectionCard({ items = [] }) {
  // Pick the most recently created event from the list
  const latestEvent = useMemo(() => {
    if (!items.length) return null;
    return [...items].sort(
      (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
    )[0];
  }, [items]);

  const { data: detail, loading: detailLoading } = useFetch(
    latestEvent?.id
      ? `${ENDPOINTS_EVENTS.GET_BY_ID}${latestEvent.id}?role=SELLER&eventStatus=2`
      : null,
  );

  const collections = detail?.collections ?? [];
  const soldTickets = collections.reduce((a, c) => a + (c.soldTickets ?? 0), 0);
  const reservedTickets = collections.reduce(
    (a, c) => a + (c.reservedTickets ?? 0),
    0,
  );
  const availableTickets = collections.reduce(
    (a, c) => a + (c.availableTickets ?? 0),
    0,
  );
  const onHoldTickets = collections?.reduce(
    (a, c) => a + (c.onHoldTickets ?? 0),
    0,
  );
  const totalTickets = soldTickets + reservedTickets + availableTickets;
  const percent =
    totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0;

  // ── Empty — no events assigned yet ──────────────────────────────────────────
  if (!items.length) return <EmptyState />;

  const eventTitle = latestEvent?.title ?? "Evento activo";

  // ── Card ─────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.heroCard}>
      {/* Decorative blobs */}
      <View style={styles.heroDotLarge} />
      <View style={styles.heroDotSmall} />

      {/* Top label */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.activeDot} />
          <Text style={styles.badgeText}>MI COLECCIÓN ACTIVA</Text>
        </View>
      </View>

      {/* Event title */}
      <Text style={styles.eventTitle} numberOfLines={2}>
        {eventTitle}
      </Text>

      {/* Main content: sold count + gauge */}
      <View style={styles.mainRow}>
        {/* Left: ticket numbers + stat pills */}
        <View style={styles.leftCol}>
          {detailLoading ? (
            <ActivityIndicator color={WHITE} style={{ marginVertical: 12 }} />
          ) : (
            <>
              <Text style={styles.heroTickets}>
                <Text style={styles.heroSold}>{soldTickets}</Text>
                <Text style={styles.heroTotal}>
                  {"  "}de {totalTickets}
                </Text>
              </Text>
              <Text style={styles.heroCaption}>tickets vendidos</Text>

              <View style={styles.statsRow}>
                <StatPill
                  icon="time-outline"
                  value={reservedTickets}
                  label="reserv."
                  color={BLUE_500}
                />
                <StatPill
                  icon="checkmark-circle-outline"
                  value={availableTickets}
                  label="disp."
                  color={GREEN_500}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <StatPill
                  icon="checkmark-circle-outline"
                  value={onHoldTickets}
                  label="en espera"
                  color={ORANGE}
                />
              </View>
            </>
          )}
        </View>

        {/* Right: circular gauge */}
        <View style={styles.rightCol}>
          {detailLoading ? (
            <View style={[styles.gaugeWrap, styles.gaugePlaceholder]}>
              <ActivityIndicator color={GREEN_500} size="large" />
            </View>
          ) : (
            <CircularGauge percent={percent} />
          )}
        </View>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: GREEN_900,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    overflow: "hidden",
  },
  emptyCard: {
    minHeight: 120,
    justifyContent: "center",
  },

  // Decorative blobs
  heroDotLarge: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: GREEN_700,
    opacity: 0.25,
    right: -35,
    top: -35,
  },
  heroDotSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GREEN_700,
    opacity: 0.15,
    right: 50,
    bottom: -25,
  },

  // Top badge
  topRow: {
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN_500,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.extrabold,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.8,
  },

  // Event title
  eventTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 14,
    lineHeight: 24,
  },

  // Main row: left + right
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Ticket counters
  heroTickets: {
    marginBottom: 2,
  },
  heroSold: {
    fontSize: 42,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
    lineHeight: 48,
  },
  heroTotal: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: "rgba(255,255,255,0.55)",
  },
  heroCaption: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.45)",
    fontWeight: Typography.weights.medium,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Stat pills row
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.5)",
    fontWeight: Typography.weights.medium,
  },

  // Circular gauge
  gaugeWrap: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugePlaceholder: {
    borderRadius: SVG_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  gaugeCenter: {
    position: "absolute",
    alignItems: "center",
  },
  gaugePercent: {
    fontSize: 26,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 30,
  },
  gaugeLabel: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1,
  },

  // Empty state
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  mascota: {
    width: 60,
    height: 90,
  },
  emptyTexts: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 18,
  },
});
