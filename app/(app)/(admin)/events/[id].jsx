import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GuideStatusCard from "../../../../components/cards/GuideStatusCard";
import { ENDPOINTS_EVENTS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useRaffleContext } from "../../../../context/RaffleContext";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#FFFFFF";
const ORANGE = "#F59E0B";

const STATUS_MAP = {
  1: { label: "EN ESPERA", bg: "#F1F5F9", text: "#475569" },
  2: { label: "ACTIVO", bg: "#D1FAE5", text: "#065F46" },
  3: { label: "SORTEADO", bg: GREEN_900, text: WHITE },
};

const MOCK_WINNERS = [
  { rank: 1, name: "Elena Rodríguez", ticket: "#4521" },
  { rank: 2, name: "Marcos Silva", ticket: "#8902" },
  { rank: 3, name: "Lucía Méndez", ticket: "#1134" },
];
const RANK_COLORS = {
  1: GREEN_900,
  2: "#6B7280",
  3: "#92400E",
};

const AVATAR_PALETTE = [GREEN_500, BLUE_500, GREEN_900, "#7C3AED"];
const MAX_AVATARS = 4;

export default function AdminEventDetailPage() {
  const router = useRouter();
  const { id: eventId, eventStatus } = useLocalSearchParams();

  const { isAdmin } = useRaffleContext();

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  const { data, loading, refetch } = useFetch(
    `${ENDPOINTS_EVENTS.GET_BY_ID}${eventId}?eventStatus=${eventStatus}`,
  );
  const event = data;

  const availableTickets =
    data?.collections
      ?.map((c) => c.availableTickets)
      .reduce((a, b) => a + b, 0) ?? 0;
  const reservedTickets =
    data?.collections
      ?.map((c) => c.reservedTickets)
      .reduce((a, b) => a + b, 0) ?? 0;
  const onHoldTickets =
    data?.collections?.map((c) => c.onHoldTickets).reduce((a, b) => a + b, 0) ??
    0;
  const soldTickets =
    data?.collections?.map((c) => c.soldTickets).reduce((a, b) => a + b, 0) ??
    0;
  const totalTickets = availableTickets + reservedTickets + soldTickets;
  const ticketPrice = event?.ticketPrice ?? 0;
  const collected = soldTickets * ticketPrice;
  const activeSellers = (data?.collections ?? []).length;
  const progressPct = totalTickets > 0 ? soldTickets / totalTickets : 0;

  useEffect(() => {
    if (!event?.date) return;
    const target = new Date(event.date).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [event?.date]);

  const daysUntilEnd = (() => {
    if (!event?.date) return null;
    const diff = new Date(event.date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  })();

  const statusCfg = STATUS_MAP[Number(eventStatus)] ?? STATUS_MAP[1];

  const formatMoney = (n) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `S/.${n.toFixed(0)}`;
  };

  const extraSellers =
    activeSellers > MAX_AVATARS ? activeSellers - MAX_AVATARS : 0;
  const sellerInitials = (data?.collections ?? [])
    .slice(0, MAX_AVATARS)
    .map((col) => {
      const name =
        col.seller?.firstName ??
        col.seller?.username ??
        col.seller?.email ??
        "?";
      return name[0]?.toUpperCase() ?? "?";
    });

  function renderStatusRow() {
    return (
      <View style={styles.statusRow}>
        <View style={[styles.statusChip, { backgroundColor: statusCfg.bg }]}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  statusCfg.text === WHITE ? GREEN_500 : statusCfg.text,
              },
            ]}
          />
          <Text style={[styles.statusChipText, { color: statusCfg.text }]}>
            {statusCfg.label}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(app)/(admin)/events/edit",
              params: { id: eventId, eventStatus },
            })
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={Colors.principal.neutral[500]}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderImageCard() {
    return (
      <View style={styles.imageCard}>
        <Image
          source={{ uri: event?.image ?? event?.image }}
          style={styles.imageCardImg}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  function renderTitleSection() {
    return (
      <View style={styles.card}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event?.title ?? "—"}
        </Text>
        <Text style={styles.eventDescription}>
          {event?.description ?? "Sin descripción."}
        </Text>

        <View style={styles.infoSeparator} />

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconBox, { backgroundColor: GREEN_50 }]}>
              <Ionicons name="pricetag-outline" size={15} color={GREEN_500} />
            </View>
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Precio</Text>
              <Text style={styles.infoValue}>S/. {ticketPrice.toFixed(2)}</Text>
            </View>
          </View>

          {!!event?.place && (
            <View style={styles.infoItem}>
              <View
                style={[styles.infoIconBox, { backgroundColor: "#EFF6FF" }]}
              >
                <Ionicons name="location-outline" size={15} color={BLUE_500} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Lugar</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {event.place}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  function renderCountdownCard() {
    if (!event?.date) return null;
    const pad = (n) => String(n).padStart(2, "0");
    const formattedDate = new Date(event.date).toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={[styles.card, styles.countdownCard]}>
        <View style={styles.countdownHeader}>
          <Ionicons name="time-outline" size={15} color={GREEN_500} />
          <Text style={styles.countdownHeaderText}>
            {countdown.expired
              ? "El evento ha finalizado"
              : "El sorteo finaliza en"}
          </Text>
        </View>

        {!countdown.expired && (
          <View style={styles.countdownRow}>
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownNumber}>{pad(countdown.days)}</Text>
              <Text style={styles.countdownLabel}>DÍAS</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownNumber}>{pad(countdown.hours)}</Text>
              <Text style={styles.countdownLabel}>HORAS</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownNumber}>
                {pad(countdown.minutes)}
              </Text>
              <Text style={styles.countdownLabel}>MINS</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownNumber}>
                {pad(countdown.seconds)}
              </Text>
              <Text style={styles.countdownLabel}>SEGS</Text>
            </View>
          </View>
        )}

        <View style={styles.countdownDateRow}>
          <Ionicons name="calendar-outline" size={13} color={NEUTRAL_500} />
          <Text style={styles.countdownDateText}>{formattedDate}</Text>
        </View>
      </View>
    );
  }

  function renderSalesCard() {
    return (
      <View style={styles.card}>
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
    );
  }

  function renderMetricsGrid() {
    const metrics = [
      { label: "Vendidos", value: soldTickets, color: GREEN_500 },
      { label: "En espera", value: onHoldTickets, color: ORANGE },
      { label: "Reservados", value: reservedTickets, color: BLUE_500 },
    ];
    return (
      <View style={styles.metricsRow}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: m.color }]}>
              {m.value}
            </Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    );
  }

  function renderRemainingTicketsCard() {
    return (
      <View style={[styles.card, styles.cardDark]}>
        <Text style={styles.cardLabelDark}>TICKETS RESTANTES</Text>
        <Text style={styles.largeNumberDark}>{availableTickets}</Text>
        {daysUntilEnd !== null && (
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color="rgba(255,255,255,0.75)"
            />
            <Text style={styles.dateRowText}>
              Finaliza en {daysUntilEnd} día{daysUntilEnd !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>
    );
  }

  /** Vendedores Activos card — tap to see full list */
  function renderSellersCard() {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: BG_PAGE }]}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/(app)/(admin)/vendedores",
            params: { eventId, eventStatus },
          })
        }
      >
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>VENDEDORES ACTIVOS</Text>
          <Ionicons name="chevron-forward" size={16} color={NEUTRAL_400} />
        </View>
        <Text style={[styles.largeNumber, { color: GREEN_900 }]}>
          {activeSellers}
        </Text>

        {/* Overlapping avatar circles */}
        {activeSellers > 0 && (
          <View style={styles.avatarStack}>
            {sellerInitials.map((initial, i) => (
              <View
                key={i}
                style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: AVATAR_PALETTE[i % AVATAR_PALETTE.length],
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: MAX_AVATARS - i,
                  },
                ]}
              >
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            ))}
            {extraSellers > 0 && (
              <View
                style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: NEUTRAL_400,
                    marginLeft: -8,
                    zIndex: 0,
                  },
                ]}
              >
                <Text style={styles.avatarInitial}>+{extraSellers}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  /** Empezar a sortear card — visible only when event is active (status=2) */
  function renderSortearCard() {
    return (
      <TouchableOpacity
        style={styles.sortearCard}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/(app)/(admin)/tickets/sortear",
            params: { eventId, eventTitle: event?.title ?? "" },
          })
        }
      >
        <Image
          source={{
            uri: "https://res.cloudinary.com/dabyqnijl/image/upload/v1775886772/RifaloPeSuper.png",
          }}
          style={styles.sortearMascot}
          contentFit="contain"
        />
        <View style={styles.sortearText}>
          <Text style={styles.sortearTitle}>¡Es hora de sortear!</Text>
          <Text style={styles.sortearSubtitle}>
            Inicia el sorteo y elige al ganador
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={WHITE} />
      </TouchableOpacity>
    );
  }

  /** Ganadores card */
  function renderWinnersCard() {
    const hasSorteo = Number(eventStatus) === 3;
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.winnersHeader}>
          <Text style={styles.winnersTitle}>Ganadores</Text>
          <Ionicons name="trophy-outline" size={20} color={GREEN_500} />
        </View>

        {hasSorteo ? (
          /* Winner rows */
          <>
            {MOCK_WINNERS.map((winner) => (
              <View key={winner.rank} style={styles.winnerRow}>
                <View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: RANK_COLORS[winner.rank] },
                  ]}
                >
                  <Text style={styles.rankBadgeText}>{winner.rank}</Text>
                </View>
                <View style={styles.winnerInfo}>
                  <Text style={styles.winnerName}>{winner.name}</Text>
                  <Text style={styles.winnerTicket}>
                    Ticket {winner.ticket}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          /* Placeholder */
          <View style={styles.noWinnersBox}>
            <Ionicons name="hourglass-outline" size={28} color={NEUTRAL_400} />
            <Text style={styles.noWinnersText}>
              El sorteo aún no ha sido realizado
            </Text>
          </View>
        )}

        {/* Ver Todos button */}
        <TouchableOpacity style={styles.verTodosBtn} activeOpacity={0.75}>
          <Text style={styles.verTodosBtnText}>Ver Todos los Ganadores</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {loading && <LoadingScreen />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={GREEN_900}
            colors={[GREEN_900]}
          />
        }
      >
        {/* Status chip + ID */}
        {renderStatusRow()}

        {/* Event image (framed card) */}
        {renderImageCard()}

        {/* Title + description + price + place */}
        {renderTitleSection()}

        {/* Countdown to event end */}
        {renderCountdownCard()}

        {/* Ventas Totales (bloqueado) */}
        {renderSalesCard()}

        {/* Métricas: Vendidos · En espera · Disponibles */}
        {renderMetricsGrid()}

        {/* Tickets Restantes */}
        {renderRemainingTicketsCard()}

        {/* Vendedores Activos */}
        {renderSellersCard()}

        {/* Ganadores */}
        {eventStatus >= 3 && renderWinnersCard()}

        {/* Sortear */}
        {Number(eventStatus) === 2 && renderSortearCard()}

        <View style={{ marginHorizontal: 20 }}>
          <GuideStatusCard />
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Sticky bottom bar ─────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        {/* Vender Tickets */}
        <TouchableOpacity
          style={styles.sellBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(app)/(admin)/tickets/vender",
              params: {
                eventId,
                ticketPrice: String(ticketPrice),
                eventTitle: event?.title ?? "",
              },
            })
          }
        >
          <Text style={styles.sellBtnText}>Vender Tickets</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>

        {/* Confirmar tickets icon */}
        <TouchableOpacity
          style={styles.iconBtn}
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

        {/* Agregar vendedor (admin only) */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.iconBtnBlue}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(app)/(admin)/vendedores/agregar",
                params: { eventId },
              })
            }
          >
            <Ionicons
              name="person-add-outline"
              size={22}
              color={Colors.principal.blue[900]}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_PAGE,
    marginTop: Constants.statusBarHeight,
  },
  scroll: {
    paddingTop: 12,
    paddingBottom: 8,
  },

  // ── Status row ─────────────────────────────────────────────────────────
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.6,
  },
  eventIdText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Image card ─────────────────────────────────────────────────────────
  imageCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: "hidden",
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageCardImg: {
    width: "100%",
    height: "100%",
  },

  // ── Title section ───────────────────────────────────────────────────────
  eventTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 30,
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    lineHeight: 20,
    marginBottom: 14,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_900,
    borderRadius: 14,
    height: 50,
  },
  downloadBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Generic card ────────────────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: GREEN_900,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: NEUTRAL_500,
    marginBottom: 4,
  },
  cardLabelDark: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.70)",
    marginBottom: 4,
  },
  largeNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: NEUTRAL_700,
    marginBottom: 8,
  },
  largeNumberDark: {
    fontSize: 36,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 8,
  },

  // ── Sales card ──────────────────────────────────────────────────────────
  salesTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  growthText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "#065F46",
  },
  miniBarBg: {
    height: 6,
    backgroundColor: NEUTRAL_100,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  miniBarFill: {
    height: 6,
    backgroundColor: GREEN_500,
    borderRadius: 3,
  },
  salesSubtext: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Tickets restantes card ───────────────────────────────────────────────
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateRowText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.75)",
    fontWeight: Typography.weights.medium,
  },

  // ── Sellers card ────────────────────────────────────────────────────────
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  avatarStack: {
    flexDirection: "row",
    marginTop: 4,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 11,
    fontWeight: "700",
    color: WHITE,
  },

  // ── Chart card ───────────────────────────────────────────────────────────
  chartHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 4,
  },
  toggleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: NEUTRAL_100,
  },
  toggleChipActive: {
    backgroundColor: GREEN_900,
  },
  toggleChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: NEUTRAL_500,
    letterSpacing: 0.4,
  },
  toggleChipTextActive: {
    color: WHITE,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: 20,
    borderRadius: 6,
    minHeight: 6,
  },
  barDayLabel: {
    fontSize: 10,
    color: NEUTRAL_500,
    fontWeight: "500",
  },

  // ── Winners card ─────────────────────────────────────────────────────────
  winnersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  winnersTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  winnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rankBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  winnerTicket: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 1,
  },
  noWinnersBox: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  noWinnersText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_400,
    textAlign: "center",
  },
  verTodosBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: GREEN_900,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  verTodosBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // ── Gestionar Premios button ──────────────────────────────────────────────
  managePrizesBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_900,
    borderRadius: 16,
    height: 54,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  managePrizesBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Sticky bottom bar ─────────────────────────────────────────────────────
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
  sellBtn: {
    flex: 1,
    backgroundColor: GREEN_900,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sellBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
  iconBtn: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GREEN_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GREEN_900,
  },
  iconBtnBlue: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.principal.blue[100],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BLUE_500,
  },

  // ── Locked overlay ────────────────────────────────────────────────────────
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,71,57,0.82)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 20,
  },
  lockedIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: WHITE,
    letterSpacing: 0.3,
  },
  lockedSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.70)",
    textAlign: "center",
    lineHeight: 17,
  },

  // ── Title info grid ───────────────────────────────────────────────────────
  infoSeparator: {
    height: 1,
    backgroundColor: Colors.principal.neutral[200],
    marginVertical: 14,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoTexts: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },

  // ── Countdown card ────────────────────────────────────────────────────────
  countdownCard: {
    backgroundColor: GREEN_900,
  },
  countdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  countdownHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  countdownBlock: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 58,
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: WHITE,
    letterSpacing: -0.5,
  },
  countdownLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: GREEN_500,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  countdownSep: {
    fontSize: 24,
    fontWeight: "800",
    color: "rgba(255,255,255,0.40)",
    marginBottom: 14,
  },
  countdownDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  countdownDateText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.60)",
    fontWeight: Typography.weights.medium,
  },

  // ── Sortear card ─────────────────────────────────────────────────────────
  sortearCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_900,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  sortearMascot: {
    width: 64,
    height: 64,
  },
  sortearText: {
    flex: 1,
    gap: 4,
  },
  sortearTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  sortearSubtitle: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.70)",
    fontWeight: Typography.weights.medium,
  },

  // ── Metrics row ───────────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.principal.neutral[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
