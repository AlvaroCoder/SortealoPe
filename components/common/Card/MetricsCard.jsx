import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const ORANGE = "#F59E0B";

export default function MetricsCard({
  soldTickets,
  reservedTickets,
  onHold,
  availableTickets,
}) {
  return (
    <View style={styles.metricsGrid}>
      <View style={styles.metricCard}>
        <Text style={[styles.metricNumber, { color: GREEN_500 }]}>
          {soldTickets}
        </Text>
        <Text style={styles.metricLabel}>Vendidos</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={[styles.metricNumber, { color: BLUE_500 }]}>
          {reservedTickets}
        </Text>
        <Text style={styles.metricLabel}>Reservado</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={[styles.metricNumber, { color: ORANGE }]}>{onHold}</Text>
        <Text style={styles.metricLabel}>En espera</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricNumber}>{availableTickets}</Text>
        <Text style={styles.metricLabel}>Disponibles</Text>
      </View>
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
});
