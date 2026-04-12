import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

const STATUS_CONFIG = {
  1: {
    label: "EN ESPERA",
    dotColor: "#94A3B8",
    badgeBg: "#F1F5F9",
    badgeText: "#475569",
  },
  2: {
    label: "CREADO",
    dotColor: "#16CD91",
    badgeBg: "#D1FAE5",
    badgeText: "#065F46",
  },
  3: {
    label: "SORTEADO",
    dotColor: "#004739",
    badgeBg: "#004739",
    badgeText: "#FFFFFF",
  },
};

const getStatus = (ev) =>
  STATUS_CONFIG[ev.eventStatus ?? ev.status ?? 1] ?? STATUS_CONFIG[1];

export default function CardEvents({ item, selectedStatus }) {
  const router = useRouter();

  const statusCfg = getStatus({ eventStatus: selectedStatus });

  const statusValue = selectedStatus;

  const sold = item.soldTickets ?? 0;
  const total = item.ticketsPerCollection ?? item.totalTickets ?? 0;
  const pct = total > 0 ? Math.round((sold / total) * 100) : 0;

  // Progress bar fill color per status
  const progressFillColor =
    statusValue === 2 ? GREEN_500 : statusValue === 3 ? GREEN_900 : NEUTRAL_400;

  // Sold number color per status
  const soldNumberColor = statusValue === 1 ? NEUTRAL_400 : GREEN_900;

  // Percentage color per status
  const pctColor = statusValue === 2 ? GREEN_500 : NEUTRAL_500;

  // Subtitle text per status
  const subtitleText =
    statusValue === 1
      ? "Esperando aprobación"
      : statusValue === 3
        ? "Sorteo realizado"
        : item.date
          ? new Date(item.date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "";

  return (
    <View style={styles.eventCard}>
      {/* ── Top section ─────────────────────────────────────────────── */}
      <View style={styles.cardTop}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title ?? "Evento"}
          </Text>

          {/* Status badge: dot + label */}
          <View
            style={[styles.statusBadge, { backgroundColor: statusCfg.badgeBg }]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusCfg.dotColor },
              ]}
            />
            <Text style={[styles.statusLabel, { color: statusCfg.badgeText }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        {!!subtitleText && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitleText}
          </Text>
        )}
      </View>

      {/* ── Middle section: progress ─────────────────────────────────── */}
      <View style={styles.cardMiddle}>
        <View style={styles.progressLabelRow}>
          {/* Sold / total */}
          <View style={styles.soldRow}>
            <Text style={[styles.soldNumber, { color: soldNumberColor }]}>
              {sold}
            </Text>
            <Text style={styles.totalText}> / {total}</Text>
          </View>
          {/* Percentage */}
          <Text style={[styles.pctText, { color: pctColor }]}>{pct}%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${pct}%`,
                backgroundColor: progressFillColor,
              },
            ]}
          />
        </View>
      </View>

      {/* ── Bottom section: actions ──────────────────────────────────── */}
      <View style={styles.cardBottom}>
        {statusValue === 2 && (
          <>
            {/* Event ID chip */}
            <View style={styles.idChip}>
              <Text style={styles.idChipText}>#{item.id}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(app)/(admin)/events/[id]",
                  params: { id: item.id, eventStatus: item.eventStatus ?? 2 },
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.detailsBtn}>Detalles →</Text>
            </TouchableOpacity>
          </>
        )}

        {statusValue === 3 && (
          <View style={styles.completedRow}>
            <Ionicons name="checkmark-circle" size={16} color={GREEN_500} />
            <Text style={styles.completedText}>Sorteo completado</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Event card

  eventCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  // Card top
  cardTop: {
    padding: 16,
    paddingBottom: 10,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: GREEN_900,
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
    flexShrink: 0,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: NEUTRAL_500,
    marginTop: 6,
  },
  // Card middle
  cardMiddle: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  soldRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  soldNumber: {
    fontSize: 24,
    fontWeight: "800",
  },
  totalText: {
    fontSize: 14,
    color: NEUTRAL_500,
  },
  pctText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: NEUTRAL_200,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Card bottom
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
  },
  cardBottomHint: {
    fontSize: 13,
    color: NEUTRAL_500,
  },
  editBtn: {
    fontSize: 14,
    fontWeight: "600",
    color: NEUTRAL_500,
  },
  detailsBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: GREEN_900,
  },
  idChip: {
    backgroundColor: GREEN_50,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  idChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: GREEN_900,
  },
  completedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completedText: {
    fontSize: 14,
    color: NEUTRAL_500,
  },
});
