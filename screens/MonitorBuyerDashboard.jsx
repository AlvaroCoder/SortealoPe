import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Title from '../components/common/Titles/Title';
import Title2 from '../components/common/Titles/Title2';
import { Colors, Typography } from '../constants/theme';
import { useRaffleContext } from '../context/RaffleContext';
import RolSwitchBar from '../views/Bars/RolSwitchBar';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = '#FFFFFF';
const RED_500 = Colors.principal.red[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_700 = Colors.principal.neutral[700];

const mockTicketData = [
  { 
    id: '1',
    title: "Ticket #12345", 
    date: "Sorteo: 25 Diciembre", 
    location: "Premio: TV 65'", 
    status: "Activo",
    urlImagen: "https://placehold.co/150x150/004739/FFFFFF?text=TICKET"
  },
  { 
    id: '2',
    title: "Ticket #67890", 
    date: "Sorteo: 15 Enero", 
    location: "Premio: Motocicleta", 
    status: "Pendiente",
    urlImagen: "https://placehold.co/150x150/16CD91/FFFFFF?text=TICKET"
  },
  { 
    id: '3',
    title: "Ticket #11223", 
    date: "Sorteo: 02 Febrero", 
    location: "Premio: Kit Gamer", 
    status: "Activo",
    urlImagen: "https://placehold.co/150x150/004739/FFFFFF?text=TICKET"
  },
];

const TicketListItem = ({ ticket }) => {
  const isActive = ticket.status === "Activo";

  return (
    <TouchableOpacity style={styles.ticketCard} activeOpacity={0.8}>
      <View style={styles.ticketImageContainer}>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? GREEN_500 : RED_500 }]}>
          <Text style={styles.statusBadgeText}>{ticket.status}</Text>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <Title2>{ticket.title}</Title2>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={NEUTRAL_700} />
          <Text style={styles.infoText}>{ticket.date}</Text>
        </View>


        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>Ver detalles</Text>
          <Ionicons name="chevron-forward" size={14} color={GREEN_900} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

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
              <View style={styles.sectionHeader}>
                <Title>Mis Tickets Comprados</Title>
                <View style={styles.countBadge}>
                  <Title >{mockTicketData.length}</Title>
                </View>
              </View>
              
              <View style={styles.listWrapper}>
                {mockTicketData.map((ticket) => (
                  <TicketListItem key={ticket.id} ticket={ticket} />
                ))}
              </View>
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
  mainContentArea: {
    flex: 1,
    backgroundColor: WHITE, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  contentPadding: {
    paddingTop: 10, 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'column',
    justifyContent : 'flex-start',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900, 
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: Colors.principal.green[100],
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 7,
    width : 40,
  },

  listWrapper: {
    gap: 15,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  ticketImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  ticketTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: NEUTRAL_700,
    marginLeft: 6,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  viewDetailsText: {
    color: GREEN_900,
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 4,
  },
  // --- Explorar ---
  exploreSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED_500,
    padding: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    marginLeft: 10,
  },
});