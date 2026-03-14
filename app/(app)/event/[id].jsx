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
import ProgressBar from "../../../components/cards/ProgressBar";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useRaffleContext } from "../../../context/RaffleContext";
import { useDateFormatter } from "../../../lib/dateFormatter";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

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

const URL_EVENT_ID = ENDPOINTS_EVENTS.GET_BY_ID;

export default function EventDetailPage() {
  const { formatDateToSpanish } = useDateFormatter();
  const router = useRouter();
  const { id: eventId, eventStatus } = useLocalSearchParams();
  const { isAdmin, isSeller } = useRaffleContext();

  const { data, loading } = useFetch(
    `${URL_EVENT_ID}${eventId}?eventStatus=${eventStatus}`,
  );
  const event = data;

  const totalTickets =
    data?.collections
      ?.map((c) => c.ticketsQuantity)
      .reduce((a, b) => a + b, 0) ?? 0;

  const availableTickets =
    data?.collections
      ?.map((c) => c.availableTickets)
      .reduce((a, b) => a + b, 0) ?? 0;

  const reservedTickets =
    data?.collections
      ?.map((c) => c.reservedTickets)
      .reduce((a, b) => a + b, 0) ?? 0;

  const soldTickets =
    data?.collections?.map((c) => c.soldTickets).reduce((a, b) => a + b, 0) ??
    0;

  const ticketPrice = event?.ticketPrice ?? 0;
  const collected = (soldTickets * ticketPrice).toFixed(0);

  // Barra inferior: visible para seller/admin cuando el evento está activo (status 2)
  const showBottomBar = eventStatus >= 2;

  const statusConfig = eventStatus >= 2;

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
      {/**isAdmin && <FloatinActionButtons /> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          // Admin FAB is ~90px; seller CTA is in-flow so no extra padding needed
        ]}
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
          {/* Gradient scrim for readability */}
          <View style={styles.heroScrim} />

          {/* Status badge */}
          {event?.status && (
            <View
              style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
            >
              <Text
                style={[styles.statusBadgeText, { color: statusConfig.color }]}
              >
                {statusConfig.label}
              </Text>
            </View>
          )}
        </View>

        {/* ── Content card ──────────────────────────────────── */}
        <View style={styles.card}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {event?.title}
            </Text>
            {isAdmin && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: "event/edit",
                    params: { id: eventId },
                  })
                }
              >
                <Ionicons name="create-outline" size={20} color={GREEN_900} />
              </TouchableOpacity>
            )}
          </View>

          {/* Key info row */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipLabel}>Precio</Text>
              <Text style={styles.infoChipValue}>
                S/ {ticketPrice.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.infoChip, styles.infoChipCenter]}>
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

          {/* Description */}
          <Text style={styles.sectionLabel}>Descripción</Text>
          <Text style={styles.description}>
            {event?.description || "Sin descripción."}
          </Text>

          <View style={styles.divider} />

          {/* Ticket progress */}
          <Text style={styles.sectionLabel}>Tickets</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{availableTickets}</Text>
              <Text style={styles.progressStatLabel}>Disponibles</Text>
            </View>
            <View style={[styles.progressStat, { alignItems: "center" }]}>
              <Text style={[styles.progressStatNumber, { color: BLUE_500 }]}>
                {totalTickets > 0
                  ? `${(((soldTickets + reservedTickets) / totalTickets) * 100).toFixed(0)}%`
                  : "0%"}
              </Text>
              <Text style={styles.progressStatLabel}>Ocupados</Text>
            </View>
            <View style={[styles.progressStat, { alignItems: "flex-end" }]}>
              <Text style={styles.progressStatNumber}>{totalTickets}</Text>
              <Text style={styles.progressStatLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.progressBarWrapper}>
            <ProgressBar available={availableTickets} total={totalTickets} />
          </View>

          {(isAdmin || isSeller) && event?.status >= 2 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Métricas</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={[styles.metricNumber, { color: GREEN_500 }]}>
                    {soldTickets}
                  </Text>
                  <Text style={styles.metricCardLabel}>Vendidos</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={[styles.metricNumber, { color: BLUE_500 }]}>
                    {reservedTickets}
                  </Text>
                  <Text style={styles.metricCardLabel}>Reservados</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricNumber}>{availableTickets}</Text>
                  <Text style={styles.metricCardLabel}>Disponibles</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={[styles.metricNumber, { color: GREEN_900 }]}>
                    S/ {collected}
                  </Text>
                  <Text style={styles.metricCardLabel}>Recaudado</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Barra inferior: Vender + Agregar Vendedor ──────── */}
      {showBottomBar && (
        <View style={styles.sellBar}>
          <TouchableOpacity
            style={styles.sellButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(app)/tickets/sell/[id]",
                params: { id: eventId },
              })
            }
          >
            <Text style={styles.sellButtonText}>Vender Tickets</Text>
            <Ionicons name="arrow-forward" size={18} color={WHITE} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addSellerButton}
            activeOpacity={0.85}
            onPress={() => router.push("/vendedores/agregar")}
          >
            <Ionicons
              name="person-add-outline"
              size={22}
              color={Colors.principal.blue[900]}
            />
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 30,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.principal.yellow[100],
    borderWidth: 1,
    borderColor: Colors.principal.yellow[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
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
  infoChipCenter: {
    flex: 1.2,
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

  // ── Progress ───────────────────────────────────────────
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressStat: {
    alignItems: "flex-start",
  },
  progressStatNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  progressStatLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  progressBarWrapper: {
    marginTop: 4,
  },

  // ── Metrics ────────────────────────────────────────────
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
  metricCardLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Sell bar ───────────────────────────────────────────
  sellBar: {
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
  addSellerButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.principal.blue[100],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BLUE_500,
  },
});
