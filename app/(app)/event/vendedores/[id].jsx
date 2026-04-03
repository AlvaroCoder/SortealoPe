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
import ProgressBar from "../../../../components/cards/ProgressBar";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { useDateFormatter } from "../../../../lib/dateFormatter";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function VendedorEventoDetalle() {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();

  const { userData } = useAuthContext();
  const userId = userData?.userId;

  const { data, loading } = useFetch(
    eventId
      ? `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=2&role=SELLER`
      : null,
  );

  const event = data;

  // Colección del vendedor actual
  const allCollections = data?.collections ?? [];
  const myCollection =
    allCollections.find(
      (c) =>
        c.seller?.id === userId ||
        c.seller?.userId === userId ||
        c.userId === userId,
    ) ??
    allCollections[0] ??
    null;
  const colSold = myCollection?.soldTickets ?? 0;
  const colReserved = myCollection?.reservedTickets ?? 0;
  const colAvailable = myCollection?.availableTickets ?? 0;
  const colTotal = colSold + colReserved + colAvailable || 0;
  console.log("col Available ", colAvailable);
  console.log("total : ", colTotal);

  const ticketPrice = event?.ticketPrice ?? 0;
  const collected = (colSold * ticketPrice).toFixed(0);

  if (!event && !loading) {
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
      {loading && <LoadingScreen />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
      >
        {/* ── Hero image ────────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={{ uri: event?.imageUrl ?? event?.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.heroScrim} />

          {/* Badge "Activo" */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Activo</Text>
          </View>
        </View>

        {/* ── Content card ──────────────────────────────────── */}
        <View style={styles.card}>
          {/* Título */}
          <Text style={styles.title} numberOfLines={2}>
            {event?.title}
          </Text>

          {/* Info chips */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipLabel}>Precio</Text>
              <Text style={styles.infoChipValue}>
                S/ {ticketPrice.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.infoChip, { flex: 1.2 }]}>
              <Text style={styles.infoChipLabel}>Fecha</Text>
              <Text style={styles.infoChipValue} numberOfLines={1}>
                {formatDateToSpanish(event?.date)}
              </Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipLabel}>Lugar</Text>
              <Text style={styles.infoChipValue} numberOfLines={1}>
                {event?.place || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Descripción */}
          <Text style={styles.sectionLabel}>Descripción</Text>
          <Text style={styles.description}>
            {event?.description || "Sin descripción."}
          </Text>

          <View style={styles.divider} />

          {/* Métricas de mi colección */}
          <Text style={styles.sectionLabel}>Mis Ventas</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: GREEN_500 }]}>
                {colSold}
              </Text>
              <Text style={styles.metricLabel}>Vendidos</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: BLUE_500 }]}>
                {colReserved}
              </Text>
              <Text style={styles.metricLabel}>Reservados</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{colAvailable}</Text>
              <Text style={styles.metricLabel}>Disponibles</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: GREEN_900 }]}>
                S/ {collected}
              </Text>
              <Text style={styles.metricLabel}>Recaudado</Text>
            </View>
          </View>

          {/* Barra de progreso global */}
          <View style={styles.progressBarWrapper}>
            <ProgressBar soldTickets={colSold} total={colTotal} />
          </View>
        </View>
      </ScrollView>

      {/* ── Barra inferior: Vender Tickets ── */}
      <View style={styles.sellBar}>
        <TouchableOpacity
          style={styles.sellButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(app)/tickets/vendedor/sell/[id]",
              params: { id: eventId },
            })
          }
        >
          <Ionicons name="ticket-outline" size={20} color={WHITE} />
          <Text style={styles.sellButtonText}>Vender Tickets</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmTicketsButton}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {},

  // ── Error ──────────────────────────────────────────────
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

  // ── Hero ───────────────────────────────────────────────
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
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN_500,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    letterSpacing: 0.5,
  },

  // ── Content card ───────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    paddingBottom: 16,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 30,
    marginBottom: 16,
  },

  // ── Info chips ─────────────────────────────────────────
  infoRow: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 4,
  },
  infoChip: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  infoChipLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoChipValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // ── Section ────────────────────────────────────────────
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
    marginBottom: 10,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    lineHeight: 24,
  },

  // ── Metrics ────────────────────────────────────────────
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
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
  progressBarWrapper: {
    marginTop: 4,
  },

  // ── Collection card ────────────────────────────────────
  collectionCard: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 14,
    marginBottom: 4,
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  collectionAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  collectionAvatarText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  collectionCode: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 1,
  },
  collectionBadge: {
    backgroundColor: GREEN_50,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  collectionBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  colBarBg: {
    height: 6,
    backgroundColor: NEUTRAL_200,
    borderRadius: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  colBarFill: {
    height: 6,
    backgroundColor: GREEN_500,
    borderRadius: 3,
  },
  collectionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  collectionStat: {
    alignItems: "center",
  },
  collectionStatNum: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_700,
  },
  collectionStatLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  sellHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
  },
  sellHintText: {
    fontSize: Typography.sizes.xs,
    color: GREEN_900,
    fontWeight: Typography.weights.semibold,
  },

  // ── Sell bar ───────────────────────────────────────────
  sellBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
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
  confirmTicketsButton: {
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
