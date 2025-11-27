import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MetricCard from '../components/common/Card/MetricCard';
import { Colors, Typography } from '../constants/theme';
import { useRaffleContext } from '../context/RaffleContext';
import RolSwitchBar from '../views/Bars/RolSwitchBar';
import CarrouselViewMainCard from '../views/Sliders/CarrouselViewMainCard';

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const WHITE = '#FFFFFF';

const kpiDataSeller = [
  { label: "Tickets Vendidos", value: "85", icon: "checkmark-circle-outline" },
  { label: "Tickets Faltantes", value: "115", icon: "close-circle-outline" },
];

const mockEventData = [];

export default function MonitorSellerDashboard() {
  const { userRole, updateRole } = useRaffleContext();
  const mockEventDataPlaceholder = [
    { title: "Rifa Principal", date: "10-Dic", price: 50, status: "Activo" },
    { title: "Colección C", date: "20-Dic", price: 20, status: "Activo" }
  ];

  return (
    <View style={styles.monitorContainer}>
      
      <RolSwitchBar userRole={userRole} updateRole={updateRole} />

      <ScrollView 
        style={styles.mainContentArea} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentPadding}>

            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mi Rendimiento</Text>
              <View style={styles.metricGrid}>
                {kpiDataSeller.map((kpi, index) => (
                  <MetricCard key={index} {...kpi} />
                ))}
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mis Eventos Asignados</Text>
              <CarrouselViewMainCard 
                data={mockEventData.length ? mockEventData : mockEventDataPlaceholder} 
              />
            </View>

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
  roleSwitchBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: WHITE, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  contentPadding: {
    paddingHorizontal: 0, 
    paddingTop: 10, 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  // --- SECCIONES Y DIVISORES ---
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 20,
    marginHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900, 
    marginBottom: 15,
  },
    metricGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});