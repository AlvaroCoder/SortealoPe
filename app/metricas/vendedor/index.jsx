import { ScrollView, StyleSheet, Text, View } from 'react-native';
import VendorRankingRow from '../../../components/cards/VendorRankingRow';
import MetricCard from '../../../components/common/Card/MetricCard';
import Title2 from '../../../components/common/Titles/Title2';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const metricKpiData = [
  {
    label: "Ventas Totales",
    value: "S/ 58,450",
    icon: "wallet-outline",
    color: RED_500,
    useRoute : false
  },
  {
    label: "Ticket Promedio",
    value: "S/ 35.00",
    icon: "pricetag-outline",
    color: GREEN_500,
    useRoute : false
  },
  {
    label: "Tickets Asignados",
    value: "2,500",
    icon: "ticket-outline",
    color: GREEN_900,
    useRoute : false
  },
];

const mockVendorRanking = [
  { id: 1, name: "Ana Torres", sales: 15500, ticketsSold: 442 },
  { id: 2, name: "Carlos Ruiz", sales: 12800, ticketsSold: 365 },
  { id: 3, name: "María López", sales: 9950, ticketsSold: 284 },
  { id: 4, name: "Javier V.", sales: 8100, ticketsSold: 231 },
  { id: 5, name: "Elena G.", sales: 5500, ticketsSold: 157 },
];


export default function PageMetricVendedor() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.header}>
        <Title2 styleTitle={styles.mainTitle}>Métricas de Vendedores</Title2>
        <Text style={styles.subtitle}>Rendimiento, ventas y clasificación del equipo.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.kpiGrid}>
          {metricKpiData.map((kpi, index) => (
            <MetricCard key={index} {...kpi} />
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ranking por Ventas</Text>
        <Text style={styles.subtitle}>Top 5 vendedores por volumen total recaudado.</Text>
        
        <View style={styles.rankingList}>
          {mockVendorRanking.map((vendor, index) => (
            <VendorRankingRow 
              key={vendor.id} 
              rank={index + 1} 
              name={vendor.name} 
              sales={vendor.sales} 
              ticketsSold={vendor.ticketsSold}
            />
          ))}
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
    fontSize: Typography.sizes['3xl'],
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
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 10,
  },
  
  // --- ESTILOS KPI GRID ---
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
  },

});