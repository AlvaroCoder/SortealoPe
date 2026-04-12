import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  1: {
    label: "Disponible",
    bg: "#F0FDF4",
    text: "#16A34A",
    icon: "checkmark-circle-outline",
  },
  2: {
    label: "En espera",
    bg: "#FFFBEB",
    text: "#B45309",
    icon: "time-outline",
  },
  3: {
    label: "Reservado",
    bg: "#EFF6FF",
    text: "#1D4ED8",
    icon: "bookmark-outline",
  },
  4: {
    label: "Vendido",
    bg: "#F0FDF4",
    text: "#15803D",
    icon: "ribbon-outline",
  },
};

export default function TicketRow({ ticket, accentColor }) {
  const statusId = ticket?.ticketStatus?.id ?? ticket?.status ?? 0;
  const cfg = STATUS_CONFIG[statusId] ?? {
    label: "—",
    bg: NEUTRAL_50,
    text: NEUTRAL_500,
    icon: "help-circle-outline",
  };

  const serial = ticket?.serialNumber ?? ticket?.serial ?? "—";
  const serialFormatted = String(serial).padStart(3, "0");

  return (
    <View style={styles.row}>
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      {/* Body */}
      <View style={styles.body}>
        {/* Ticket number */}
        <View style={styles.serialSection}>
          <View
            style={[styles.serialBadge, { borderColor: accentColor + "40" }]}
          >
            <Ionicons name="ticket-outline" size={13} color={accentColor} />
            <Text style={[styles.serialLabel, { color: accentColor }]}>
              #{serialFormatted}
            </Text>
          </View>
          <Text style={styles.serialSub}>Ticket</Text>
        </View>

        {/* Status pill */}
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={12} color={cfg.text} />
          <Text style={[styles.statusText, { color: cfg.text }]}>
            {cfg.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },

  // Serial
  serialSection: {
    gap: 2,
  },
  serialBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  serialLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  serialSub: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginLeft: 2,
  },

  // Status
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexShrink: 0,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
