import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ENDPOINTS_RESERVATIONS } from "../../Connections/APIURLS";
import { Colors, Typography } from "../../constants/theme";
import { useFetch } from "../../lib/useFetch";
import QRModalVender from "../common/Modal/QRModalVender";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  1: { label: "Pendiente", bg: "#FFFBEB", text: "#B45309" },
  2: { label: "Confirmada", bg: "#F0FDF4", text: "#16A34A" },
};

// ── Date helper ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReservationRow({ reservation, accentColor }) {
  const [qrVisible, setQrVisible] = useState(false);
  console.log("Reservacion : ", reservation);

  const reservationId = reservation?.id;
  const statusId = reservation?.status ?? 0;
  const cfg = STATUS_CONFIG[statusId] ?? {
    label: "—",
    bg: NEUTRAL_50,
    text: NEUTRAL_500,
  };

  console.log("reservationId =", reservationId);

  // Fetch tickets of this reservation to get the count
  const { data: ticketsData, loading: loadingTickets } = useFetch(
    reservationId
      ? `${ENDPOINTS_RESERVATIONS.GET_TICKETS}?reservationId=${reservationId}&page=0&size=10`
      : null,
  );

  console.log("ticketsData = ", ticketsData);

  const ticketCount =
    ticketsData?.totalElements ?? ticketsData?.content?.length ?? 0;

  return (
    <>
      <View style={styles.row}>
        {/* Left accent bar */}
        <View style={[styles.rowAccent, { backgroundColor: accentColor }]} />

        <View style={styles.rowBody}>
          <View style={styles.rowMain}>
            {/* Left: date + ticket count */}
            <View style={styles.infoSection}>
              <Text style={styles.dateText}>
                {formatDate(reservation?.createdAt)}
              </Text>

              {loadingTickets ? (
                <ActivityIndicator
                  size="small"
                  color={NEUTRAL_400}
                  style={{ marginTop: 2 }}
                />
              ) : (
                <Text style={styles.ticketCountText}>
                  {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Right: status pill + QR button */}
            <View style={styles.actionsSection}>
              <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusText, { color: cfg.text }]}>
                  {cfg.label}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.qrBtn}
                onPress={() => setQrVisible(true)}
                activeOpacity={0.75}
              >
                <Ionicons name="qr-code-outline" size={20} color={GREEN_900} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* QR Modal */}
      <QRModalVender
        visible={qrVisible}
        reservationCode={reservationId}
        ticketCount={ticketCount}
        onSellMore={() => setQrVisible(false)}
        onClose={() => setQrVisible(false)}
      />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
  },
  rowAccent: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  rowBody: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  // Left section
  infoSection: {
    flex: 1,
    gap: 4,
  },
  dateText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.principal.neutral[700],
  },
  ticketCountText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // Right section
  actionsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  qrBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
  },
});
