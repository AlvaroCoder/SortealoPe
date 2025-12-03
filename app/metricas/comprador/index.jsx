import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MetricCard from '../../../components/common/Card/MetricCard';
import Title2 from '../../../components/common/Titles/Title2';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const metricKpiData = [
  { label: "Compradores Totales", value: "1,200", icon: "people-outline", color: GREEN_500, useRoute : false },
  { label: "Gasto Promedio", value: "S/ 55.50", icon: "trending-up-outline", color: GREEN_900, useRoute : false },
  { label: "Tickets Comprados", value: "15K", icon: "ticket-outline", color: RED_500, useRoute : false },
];

const mockBuyerLeaderboard = [
  { id: 1, name: "Maria L.", totalSpent: 2850, tickets: 142, icon: "trophy" },
  { id: 2, name: "Carlos R.", totalSpent: 1900, tickets: 95, icon: "medal" },
  { id: 3, name: "Ana P.", totalSpent: 1500, tickets: 75, icon: "ribbon" },
  { id: 4, name: "Javier M.", totalSpent: 1250, tickets: 50, icon: "star" },
  { id: 5, name: "Luisa F.", totalSpent: 980, tickets: 49, icon: "star" },
];

const mockDistributionData = [
    { range: '1 Ticket', value: 45, color: GREEN_500 },
    { range: '2-5 Tickets', value: 35, color: GREEN_900 },
    { range: '6-10 Tickets', value: 15, color: RED_500 },
    { range: '+10 Tickets', value: 5, color: Colors.principal.red[900] },
];


const LeaderboardRow = ({ rank, name, totalSpent, tickets, icon }) => (
  <TouchableOpacity style={styles.leaderboardRow}>
    <Text style={[styles.rankText, rank <= 3 && styles.topRankText]}>{rank}</Text>
    
    <Ionicons 
      name={rank === 1 ? 'trophy' : rank === 2 ? 'medal' : rank === 3 ? 'ribbon' : 'star-outline'} 
      size={20} 
      color={rank <= 3 ? RED_500 : GREEN_500}
      style={{ marginRight: 10 }}
    />
    
    <View style={styles.leaderboardInfo}>
      <Text style={styles.leaderboardName} numberOfLines={1}>{name}</Text>
      <Text style={styles.leaderboardDetail}>Tickets: {tickets}</Text>
    </View>
    
    <Text style={styles.leaderboardSpent}>S/ {totalSpent.toFixed(2)}</Text>
  </TouchableOpacity>
);

const DistributionSection = ({ data }) => (
    <View style={styles.distributionContainer}>
        <Text style={styles.sectionTitle}>Distribución de Compra (%)</Text>
        <Text style={styles.subtitle}>Porcentaje de compradores según la cantidad de tickets por transacción.</Text>
        
        <View style={styles.distributionBarContainer}>
            {data.map((item, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.distributionBar, 
                        { width: `${item.value}%`, backgroundColor: item.color }
                    ]}
                />
            ))}
        </View>

        <View style={styles.distributionLegend}>
            {data.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.range} ({item.value}%)</Text>
                </View>
            ))}
        </View>
    </View>
);


export default function PageMetricComprador() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.header}>
        <Title2 styleTitle={styles.mainTitle}>Métricas de Compradores</Title2>
        <Text style={styles.subtitle}>Análisis de lealtad y comportamiento de compra.</Text>
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
        <Text style={styles.sectionTitle}>Ranking de Compradores</Text>
        <Text style={styles.subtitle}>Top 5 por gasto total (Lealtad).</Text>
        
        <View style={styles.leaderboardList}>
          {mockBuyerLeaderboard.map((buyer, index) => (
            <LeaderboardRow 
              key={buyer.id} 
              rank={index + 1} 
              name={buyer.name} 
              totalSpent={buyer.totalSpent} 
              tickets={buyer.tickets}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.section}>
          <DistributionSection data={mockDistributionData} />
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
  metricCard: {
    width: '30%', // Tres tarjetas por fila
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: GREEN_100,
  },
  metricIconContainer: {
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  metricLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    textAlign: 'center',
    marginTop: 2,
  },

  // --- ESTILOS RANKING (LEADERBOARD) ---
  leaderboardList: {
    marginTop: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  rankText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
    width: 30, // Ancho fijo para el número de ranking
    textAlign: 'left',
    marginRight: 10,
  },
  topRankText: {
    color: RED_500,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: GREEN_900,
  },
  leaderboardDetail: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  leaderboardSpent: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: RED_500,
  },

  // --- ESTILOS DISTRIBUCIÓN DE TICKETS ---
  distributionContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  distributionBarContainer: {
    flexDirection: 'row',
    height: 25,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 15,
  },
  distributionBar: {
    height: '100%',
  },
  distributionLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  }
});