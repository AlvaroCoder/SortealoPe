import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Typography } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

function getBuyerName(buyer) {
  if (buyer?.firstName && buyer?.lastName) {
    return `${buyer.firstName} ${buyer.lastName}`;
  }
  if (buyer?.firstName) return buyer.firstName;
  if (buyer?.lastName) return buyer.lastName;
  return buyer?.username ?? "—";
}

export default function TicketCard({ item: ticket, index }) {
  const [visible, setVisible] = useState(false);

  const buyerName = getBuyerName(ticket?.buyer);
  const statusName = ticket?.status?.name ?? "vendido";

  return (
    <>
      {/* ── Row ──────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.ticketRow}
        activeOpacity={0.75}
        onPress={() => setVisible(true)}
      >
        <View style={styles.ticketNumBadge}>
          <Text style={styles.ticketNum}>{index + 1}</Text>
        </View>
        <View style={styles.ticketIcon}>
          <Ionicons name="ticket-outline" size={18} color={GREEN_900} />
        </View>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketCode} numberOfLines={1}>
            #{ticket.serialNumber}
          </Text>
          <Text style={styles.ticketBuyer} numberOfLines={1}>
            {buyerName}
          </Text>
        </View>
        <View style={styles.ticketStatusChip}>
          <Text style={styles.ticketStatusText}>
            {statusName.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIconWrap}>
                <Ionicons name="ticket" size={26} color={GREEN_500} />
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color={NEUTRAL_500} />
              </TouchableOpacity>
            </View>

            {/* Ticket number */}
            <View style={styles.serialWrap}>
              <Text style={styles.serialLabel}>N° DE TICKET</Text>
              <Text style={styles.serialNumber}>#{ticket.serialNumber}</Text>
            </View>

            <View style={styles.divider} />

            {/* Info rows */}
            <View style={styles.infoList}>
              <InfoRow
                icon="person-outline"
                label="Comprador"
                value={buyerName}
              />
              {ticket?.buyer?.email && (
                <InfoRow
                  icon="mail-outline"
                  label="Email"
                  value={ticket.buyer.email}
                />
              )}
              {ticket?.buyer?.phone && (
                <InfoRow
                  icon="call-outline"
                  label="Teléfono"
                  value={ticket.buyer.phone}
                />
              )}
              <InfoRow
                icon="checkmark-circle-outline"
                label="Estado"
                value={statusName.charAt(0).toUpperCase() + statusName.slice(1)}
                valueColor={GREEN_500}
              />
            </View>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeFullBtn}
              onPress={() => setVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.closeFullBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function InfoRow({ icon, label, value, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={16} color={GREEN_900} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text
          style={[styles.infoValue, valueColor ? { color: valueColor } : null]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Row ──────────────────────────────────────────────────────────────────
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  ticketNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ticketNum: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
  },
  ticketIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: GREEN_500 + "40",
  },
  ticketInfo: {
    flex: 1,
    gap: 2,
  },
  ticketCode: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  ticketBuyer: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },
  ticketStatusChip: {
    backgroundColor: GREEN_500 + "22",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GREEN_500 + "55",
    flexShrink: 0,
  },
  ticketStatusText: {
    fontSize: 9,
    fontWeight: "800",
    color: GREEN_700,
    letterSpacing: 0.4,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_500 + "40",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
  },

  // Ticket number hero
  serialWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  serialLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_400,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  serialNumber: {
    fontSize: 52,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 58,
  },

  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginBottom: 20,
  },

  // Info rows
  infoList: {
    gap: 14,
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoTexts: {
    flex: 1,
    gap: 1,
  },
  infoLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_400,
    fontWeight: Typography.weights.medium,
  },
  infoValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },

  // Close button
  closeFullBtn: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeFullBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
