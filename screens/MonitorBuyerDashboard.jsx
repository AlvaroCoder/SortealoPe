import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../constants/theme';
import { useRaffleContext } from '../context/RaffleContext';
import RolSwitchBar from '../views/Bars/RolSwitchBar';
import CarrouselViewMainCard from '../views/Sliders/CarrouselViewMainCard';

const GREEN_900 = Colors.principal.green[900];
const WHITE = '#FFFFFF';
const RED_500 = Colors.principal.red[500];

const mockTicketData = [
  { 
    title: "Ticket #12345", 
    date: "Sorteo: 25 Diciembre", 
    location: "Premio: TV 65'", 
    status: "Activo",
    urlImagen: "https://placehold.co/100x100/16CD91/FFFFFF?text=TICKET"
  },
  { 
    title: "Ticket #67890", 
    date: "Sorteo: 15 Enero", 
    location: "Premio: Motocicleta", 
    status: "Pendiente",
    urlImagen: "https://placehold.co/100x100/16CD91/FFFFFF?text=TICKET"
  },
];


export default function MonitorBuyerDashboard() {
  const { userRole, updateRole } = useRaffleContext();

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
              <Text style={styles.sectionTitle}>Mis Tickets Comprados</Text>
              
              <CarrouselViewMainCard 
                data={mockTicketData} 
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
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.principal.neutral[200],
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
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED_500,
    padding: 15,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginLeft: 10,
  },
});