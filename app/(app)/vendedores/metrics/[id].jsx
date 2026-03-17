import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Title from "../../../../components/common/Titles/Title";
import { ENDPOINTS_USERS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const MetricCard = ({ label, value, icon, color }) => (
  <View style={styles.metricCard}>
    <View style={[styles.metricIconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={28} color={WHITE} />
    </View>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

export default function PageIdVendedor() {
  const { id: vendedorId } = useLocalSearchParams();

  const { data: vendor, loading: loadingData } = useFetch(
    `${ENDPOINTS_USERS.GET_BY_ID}${vendedorId}`,
  );

  const metrics = useMemo(() => {
    const soldTickets = vendor?.soldTickets ?? 0;
    const assignedTickets = vendor?.assignedTickets ?? 0;
    const reservedTickets = assignedTickets - soldTickets;

    return [
      {
        label: "Tickets Vendidos",
        value: soldTickets.toLocaleString(),
        icon: "checkmark-circle-outline",
        color: GREEN_500,
      },
      {
        label: "Tickets Reservados",
        value: reservedTickets.toLocaleString(),
        icon: "close-circle-outline",
        color: RED_500,
      },
      {
        label: "Total Disponibles",
        value: assignedTickets.toLocaleString(),
        icon: "cash-outline",
        color: Colors.principal.yellow[600],
      },
    ];
  }, [vendor]);

  if (loadingData) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Title styleTitle={styles.mainTitle}>Vendedor:</Title>
        <Text style={styles.vendorName}>{vendor?.username}</Text>
        <Text style={styles.vendorEmail}>{vendor?.email}</Text>
      </View>

      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>Rendimiento del Vendedor</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </View>
      </View>

      <View style={styles.assignmentBox}>
        <Ionicons name="ticket-outline" size={30} color={GREEN_900} />
        <View>
          <Text style={styles.assignmentLabel}>Tickets Asignados</Text>
          <Text style={styles.assignmentValue}>
            {(vendor?.assignedTickets ?? 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  mainTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_700,
  },
  vendorName: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginTop: 5,
  },
  vendorEmail: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 2,
  },

  metricsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: GREEN_500,
    paddingLeft: 10,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.principal.green[800],
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_700,
    marginTop: 5,
  },
  metricValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  assignmentBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.principal.green[50],
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: GREEN_500,
  },
  assignmentLabel: {
    fontSize: Typography.sizes.base,
    color: GREEN_900,
    fontWeight: Typography.weights.medium,
    marginLeft: 15,
  },
  assignmentValue: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: RED_500,
    marginLeft: 15,
  },
});
