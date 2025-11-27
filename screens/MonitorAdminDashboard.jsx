import { ScrollView, StyleSheet, Text, View } from "react-native";
import MetricCard from "../components/common/Card/MetricCard";
import { Colors, Typography } from "../constants/theme";
import DataCardEvent from "../mock/DataCardEvent.json";
import RolSwitchBar from "../views/Bars/RolSwitchBar";
import TimelinePrincipalEvents from "../views/Monitor/TimelinePrincipalEvents";
import CarrouselViewMainCard from "../views/Sliders/CarrouselViewMainCard";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const WHITE = "#FFFFFF";

const kpiData = [
  { label: "Eventos Creados", value: "24", icon: "calendar-outline" },
  { label: "Vendedores Activos", value: "15", icon: "people-outline" },
  {
    label: "Compradores Totales",
    value: "1,200",
    icon: "person-circle-outline",
  }
];

export default function MonitorAdminDashboard({ userRole, updateRole }) {
  const mockEventData = DataCardEvent;

  return (
    <View style={styles.monitorContainer}>
      <RolSwitchBar userRole={userRole} updateRole={updateRole} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos Creados</Text>
          <CarrouselViewMainCard data={mockEventData} />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas del Sistema</Text>
          <View style={styles.metricGrid}>
            {kpiData.map((kpi, index) => (
              <MetricCard key={index} {...kpi} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.section, {marginBottom : 100}]}>
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <TimelinePrincipalEvents/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {},
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 20,
    marginHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
    
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 15,
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vendorList: {
    marginTop: 10,
    marginBottom : 100
  },
});
