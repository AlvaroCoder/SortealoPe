import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MetricsCard from "../../../../components/common/Card/MetricsCard";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useDateFormatter } from "../../../../lib/dateFormatter";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const BLUE_50 = Colors.principal.blue[50];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const ORANGE = "#F59E0B";
const MASCOT_URL =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

const STATUS_GUIDE = [
  {
    color: GREEN_500,
    bg: GREEN_50,
    label: "Vendido",
    desc: "Ticket comprado y confirmado correctamente.",
  },
  {
    color: ORANGE,
    bg: "#FFFBEB",
    label: "En espera",
    desc: "El vendedor ha generado el QR pero aún no se escanea.",
  },
  {
    color: BLUE_500,
    bg: BLUE_50,
    label: "Reservado",
    desc: "El cliente escaneo el QR y se reservó el ticket, pero no se ha confirmado la venta.",
  },
];

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SellerEventDetail() {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();

  const { data: event, loading } = useFetch(
    eventId
      ? `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?role=SELLER&eventStatus=2`
      : null,
  );

  // ── Aggregate ticket stats from all collections ──────────────────────────────
  const collections = event?.collections ?? [];

  const soldTickets = collections.reduce((a, c) => a + (c.soldTickets ?? 0), 0);
  const reservedTickets = collections.reduce(
    (a, c) => a + (c.reservedTickets ?? 0),
    0,
  );
  const availableTickets = collections.reduce(
    (a, c) => a + (c.availableTickets ?? 0),
    0,
  );

  const ticketPrice = event?.ticketPrice ?? 0;

  const totalTickets = soldTickets + reservedTickets + availableTickets;
  const collected = soldTickets * ticketPrice;
  const progressPct = totalTickets > 0 ? soldTickets / totalTickets : 0;
  const formatMoney = (n) =>
    n >= 1000 ? `S/.${(n / 1000).toFixed(1)}k` : `S/.${n.toFixed(0)}`;

  const onHoldTickets =
    collections?.reduce((a, c) => a + (c.onHoldTickets ?? 0), 0) ?? 0;

  // Seller's own collection (first one when fetched with role=SELLER)
  // The collection object uses .collectionId when coming from event+role=SELLER response
  const myCollection = collections[0] ?? null;
  const myCollectionId = myCollection?.collectionId ?? myCollection?.id ?? null;

  // ── Loading / error states ───────────────────────────────────────────────────
  if (loading) return <LoadingScreen />;

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={RED_500} />
        <Text style={styles.errorText}>Evento no encontrado.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.errorBack}
        >
          <Text style={styles.errorBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero image ──────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={{ uri: event?.imageUrl ?? event?.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.heroScrim} />

          {/* Back button */}
          <SafeAreaView style={styles.heroTopBar} edges={["top"]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={WHITE} />
            </TouchableOpacity>

            {/* VENDEDOR badge */}
            <View style={styles.vendedorBadge}>
              <Ionicons name="storefront-outline" size={12} color={GREEN_900} />
              <Text style={styles.vendedorBadgeText}>VENDEDOR</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* ── Content card ────────────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {event?.title}
          </Text>

          {/* Key info chips */}
          <View style={styles.infoGrid}>
            <View style={styles.infoChip}>
              <Ionicons
                name="pricetag-outline"
                size={14}
                color={GREEN_500}
                style={styles.infoChipIcon}
              />
              <Text style={styles.infoChipLabel}>Precio</Text>
              <Text style={styles.infoChipValue}>
                S/ {ticketPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={GREEN_500}
                style={styles.infoChipIcon}
              />
              <Text style={styles.infoChipLabel}>Fecha</Text>
              <Text style={styles.infoChipValue} numberOfLines={1}>
                {formatDateToSpanish(event?.date)}
              </Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons
                name="location-outline"
                size={14}
                color={GREEN_500}
                style={styles.infoChipIcon}
              />
              <Text style={styles.infoChipLabel}>Lugar</Text>
              <Text style={styles.infoChipValue} numberOfLines={1}>
                {event?.place || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>Descripción</Text>
          <Text style={styles.description}>
            {event?.description || "Sin descripción."}
          </Text>
          <View style={styles.divider} />

          {/* ── Ventas totales card ──────────────────────────────────────── */}
          <View style={styles.salesCard}>
            <Text style={styles.cardLabel}>VENTAS TOTALES</Text>
            <View style={styles.salesTopRow}>
              <Text style={styles.largeNumber}>{formatMoney(collected)}</Text>
            </View>
            <View style={styles.miniBarBg}>
              <View
                style={[
                  styles.miniBarFill,
                  { width: `${Math.round(progressPct * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.salesSubtext}>
              {soldTickets} de {totalTickets} tickets vendidos
            </Text>
          </View>

          <View style={styles.divider} />

          {/* ── Métricas ──────────────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Métricas</Text>
          <MetricsCard
            soldTickets={soldTickets}
            reservedTickets={reservedTickets}
            onHold={onHoldTickets}
            availableTickets={availableTickets}
          />

          {/* ── Mi Talonario ──────────────────────────────────────────────── */}
          {/* ── Guía de estados ──────────────────────────────────────────── */}
          <View style={styles.divider} />
          <View style={styles.statusGuide}>
            {/* Header con mascota */}
            <View style={styles.statusGuideHeader}>
              <Image
                source={{ uri: MASCOT_URL }}
                style={styles.statusGuideIcon}
                contentFit="contain"
              />
              <View style={styles.statusGuideHeaderText}>
                <Text style={styles.statusGuideTitle}>Guía de estados</Text>
                <Text style={styles.statusGuideSubtitle}>
                  ¿Qué significa cada color?
                </Text>
              </View>
            </View>

            {/* Items */}
            {STATUS_GUIDE.map((item) => (
              <View key={item.label} style={styles.statusGuideItem}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.bg, borderColor: item.color },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDotInner,
                      { backgroundColor: item.color },
                    ]}
                  />
                </View>
                <View style={styles.statusGuideItemText}>
                  <Text
                    style={[styles.statusGuideItemLabel, { color: item.color }]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.statusGuideItemDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.sellButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(app)/(seller)/tickets/vender",
              params: {
                eventId,
                collectionId: myCollectionId,
                ticketPrice: String(ticketPrice),
                eventTitle: event?.title ?? "",
              },
            })
          }
        >
          <Text style={styles.sellButtonText}>Reservar Tickets</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(app)/tickets/confirmar/[id]",
              params: { id: eventId },
            })
          }
        >
          <Ionicons name="checkmark-done-outline" size={22} color={GREEN_900} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // ── Error ────────────────────────────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    padding: 32,
  },
  errorText: {
    marginTop: 12,
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    textAlign: "center",
  },
  errorBack: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: GREEN_50,
    borderRadius: 10,
  },
  errorBackText: {
    fontSize: Typography.sizes.base,
    color: GREEN_900,
    fontWeight: Typography.weights.semibold,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  hero: {
    height: 260,
    backgroundColor: NEUTRAL_100,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  heroTopBar: {
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
  vendedorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_500,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vendedorBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 0.5,
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 30,
    marginBottom: 16,
  },

  // ── Info chips ───────────────────────────────────────────────────────────────
  infoGrid: {
    gap: 8,
    marginBottom: 4,
  },
  infoChip: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoChipIcon: {
    flexShrink: 0,
  },
  infoChipLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    width: 52,
  },
  infoChipValue: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // ── Section ──────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    lineHeight: 24,
  },

  // ── Sales card ───────────────────────────────────────────────────────────────
  salesCard: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  salesTopRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  largeNumber: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  miniBarBg: {
    height: 8,
    backgroundColor: NEUTRAL_200,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  miniBarFill: {
    height: 8,
    backgroundColor: GREEN_500,
    borderRadius: 4,
  },
  salesSubtext: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Metrics grid ─────────────────────────────────────────────────────────────
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    width: "48%",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  metricNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_700,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Mi Talonario ─────────────────────────────────────────────────────────────
  collectionCard: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 16,
  },
  colBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  colBarLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_500,
  },
  colBarBg: {
    height: 8,
    backgroundColor: NEUTRAL_200,
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  colBarFill: {
    height: 8,
    backgroundColor: GREEN_500,
    borderRadius: 4,
  },
  colStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colStat: {
    alignItems: "center",
  },
  colStatNum: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_700,
    marginBottom: 2,
  },
  colStatLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Status guide banner ──────────────────────────────────────────────────────
  statusGuide: {
    backgroundColor: GREEN_50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.principal.green[100],
    padding: 16,
    gap: 14,
  },
  statusGuideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  statusGuideIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  statusGuideHeaderText: {
    flex: 1,
  },
  statusGuideTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 2,
  },
  statusGuideSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  statusGuideItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  statusDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusGuideItemText: {
    flex: 1,
    gap: 2,
  },
  statusGuideItemLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  statusGuideItemDesc: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    lineHeight: 17,
  },

  // ── Bottom bar ───────────────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
  },
  sellButton: {
    flex: 1,
    backgroundColor: GREEN_900,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sellButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
  confirmButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GREEN_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GREEN_900,
  },
});
