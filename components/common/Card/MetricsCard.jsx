import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const ORANGE = "#F59E0B";

/** Single metric cell — tappable when onPress is provided */
function MetricCell({ number, label, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.metricCard, onPress && styles.metricCardTappable]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={[styles.metricNumber, color && { color }]}>{number}</Text>
      <View style={styles.metricFooter}>
        <Text style={styles.metricLabel}>{label}</Text>
        {onPress && (
          <Ionicons name="chevron-forward" size={12} color={NEUTRAL_500} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MetricsCard({
  soldTickets,
  reservedTickets,
  onHold,
  availableTickets,
  // Optional tap handlers — when provided the card becomes pressable
  onPressVendidos,
  onPressReservados,
  onPressEnEspera,
  onPressDisponibles,
}) {
  return (
    <View style={styles.metricsGrid}>
      <MetricCell
        number={soldTickets}
        label="Vendidos"
        color={GREEN_500}
        onPress={onPressVendidos}
      />
      <MetricCell
        number={reservedTickets}
        label="Reservados"
        color={BLUE_500}
        onPress={onPressReservados}
      />
      <MetricCell
        number={onHold}
        label="En espera"
        color={ORANGE}
        onPress={onPressEnEspera}
      />
      <MetricCell
        number={availableTickets}
        label="Disponibles"
        onPress={onPressDisponibles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  metricCardTappable: {
    // Subtle cue that the card is interactive
    borderStyle: "solid",
  },
  metricNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_700,
    marginBottom: 4,
  },
  metricFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
