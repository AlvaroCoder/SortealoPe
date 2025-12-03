import { Ionicons } from "@expo/vector-icons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MetricCard from "../../../components/common/Card/MetricCard";
import Title2 from "../../../components/common/Titles/Title2";
import { Colors, Typography } from "../../../constants/theme";
import CarrouselViewMainCard from "../../../views/Sliders/CarrouselViewMainCard";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const metricKpiData = [
  {
    label: "Eventos Creados",
    value: "35",
    icon: "create-outline",
    color: GREEN_500,
    useRoute: false,
  },
  {
    label: "Eventos Sorteados",
    value: "28",
    icon: "trophy-outline",
    color: RED_500,
    useRoute: false,
  },
  {
    label: "Recaudación Prom.",
    value: "S/ 1.5K",
    icon: "cash-outline",
    color: GREEN_900,
    useRoute: false,
  },
];

const mockPopularEvents = [
  {
    id: 101,
    title: "Rifa X - Alta Demanda",
    ticketsSold: 950,
    totalTickets: 1000,
    color: GREEN_500,
  },
  {
    id: 102,
    title: "Colección Verano",
    ticketsSold: 800,
    totalTickets: 1200,
    color: RED_500,
  },
  {
    id: 103,
    title: "Viaje a la Playa",
    ticketsSold: 620,
    totalTickets: 900,
    color: GREEN_900,
  },
];

const mockCreatedEvents = [
  { id: 201, title: "Rifa Diciembre", status: "Activo", date: "20/12/25" },
  {
    id: 202,
    title: "Colección Febrero",
    status: "Pendiente",
    date: "01/02/26",
  },
  { id: 203, title: "Sorteo Vacacional", status: "Activo", date: "15/01/26" },
];

const mockRaffledEvents = [
  { id: 301, title: "Rifa Anterior 1", winner: "Ana P.", date: "10/11/25" },
  { id: 302, title: "Rifa Anterior 2", winner: "Juan C.", date: "05/11/25" },
];

const EventRow = ({ title, status, date, winner }) => (
  <View style={styles.eventRow}>
    <View style={styles.eventRowIcon}>
      <Ionicons
        name={winner ? "checkmark-done-circle-outline" : "ellipse-outline"}
        size={14}
        color={winner ? GREEN_500 : GREEN_900}
      />
    </View>
    <View style={styles.eventRowContent}>
      <Text style={styles.eventRowTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.eventRowDetail}>
        {winner ? `Ganador: ${winner}` : `Fecha: ${date}`}
      </Text>
    </View>
    <Text
      style={[
        styles.eventRowStatus,
        status === "Activo" && styles.statusActive,
      ]}
    >
      {status || "Finalizado"}
    </Text>
  </View>
);

export default function PageMetricEventos() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Title2 styleTitle={styles.mainTitle}>Métricas de Eventos</Title2>
        <Text style={styles.subtitle}>
          Análisis de rendimiento de tus rifas.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas del evento</Text>
        <View style={styles.kpiGrid}>
          {metricKpiData.map((kpi, index) => (
            <MetricCard key={index} {...kpi} />
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.sectionNoPadding}>
        <Text style={styles.sectionTitle}>Eventos Más Populares</Text>
        <CarrouselViewMainCard data={mockPopularEvents} />
        <View style={styles.popularHint}>
          <Ionicons name="trending-up-outline" size={18} color={GREEN_500} />
          <Text style={styles.popularHintText}>
            Basado en tickets vendidos y recaudación.
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.doubleSectionContainer}>
        <View style={styles.eventListColumn}>
          <Text style={styles.sectionTitle}>Eventos Creados</Text>
          {mockCreatedEvents.map((event) => (
            <EventRow key={event.id} {...event} />
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver todos activos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventListColumn}>
          <Text style={styles.sectionTitle}>Eventos Sorteados</Text>
          {mockRaffledEvents.map((event) => (
            <EventRow key={event.id} {...event} status="Finalizado" />
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver historial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  mainTitle: {
    color: GREEN_900,
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 20,
    marginHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionNoPadding: {
    paddingLeft: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 15,
  },

  // --- ESTILOS KPI GRID ---
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "30%", // Tres tarjetas por fila
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: GREEN_100,
  },
  metricIconContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  metricLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    textAlign: "center",
    marginTop: 2,
  },

  // --- ESTILOS EVENTOS POPULARES ---
  popularHint: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  popularHintText: {
    fontSize: Typography.sizes.sm,
    color: GREEN_500,
    marginLeft: 5,
  },

  // --- ESTILOS EVENTOS CREADOS/SORTEADOS (DOUBLE COLUMN) ---
  doubleSectionContainer: {
    flexDirection: "column",
      paddingHorizontal: 12,
    gap : 20
  },
  eventListColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  eventRowIcon: {
    marginRight: 10,
  },
  eventRowContent: {
    flex: 1,
  },
  eventRowTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: GREEN_900,
  },
  eventRowDetail: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginTop: 2,
  },
  eventRowStatus: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: RED_500,
  },
  statusActive: {
    color: GREEN_500,
  },
  viewAllButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: GREEN_500,
    borderRadius: 8,
    alignItems: "center",
  },
  viewAllButtonText: {
    color: GREEN_500,
    fontWeight: Typography.weights.medium,
  },
});
