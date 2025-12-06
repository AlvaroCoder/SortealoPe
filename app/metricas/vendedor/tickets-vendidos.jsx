import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500]; 
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const mockSoldTickets = [
    { id: 201, eventTitle: 'Gran Sorteo Moto', ticketNumber: 'M-0001', soldTo: 'Juan Pérez', price: 50.00 },
    { id: 202, eventTitle: 'Súper Rifa Navideña', ticketNumber: 'T-0010', soldTo: 'Luisa C.', price: 20.00 },
    { id: 203, eventTitle: 'Colección Verano', ticketNumber: 'C-0050', soldTo: 'Carlos Ruiz', price: 15.00 },
    { id: 204, eventTitle: 'Gran Sorteo Moto', ticketNumber: 'M-0002', soldTo: 'Ana Torres', price: 50.00 },
    { id: 205, eventTitle: 'Súper Rifa Navideña', ticketNumber: 'T-0011', soldTo: 'Javier S.', price: 20.00 },
];

const SoldTicketCard = ({ ticket }) => (
    <TouchableOpacity style={styles.ticketCard}>
        <View style={styles.ticketIconContainer}>
            <Ionicons name="checkmark-circle-outline" size={24} color={GREEN_900} />
        </View>
        <View style={styles.ticketInfo}>
            <Text style={styles.ticketNumberTextSold}>{ticket.ticketNumber}</Text>
            <Text style={styles.ticketEventText} numberOfLines={1}>Comprador: {ticket.soldTo}</Text>
        </View>
        <Text style={styles.ticketPriceText}>S/ {ticket.price.toFixed(2)}</Text>
    </TouchableOpacity>
);


export default function TicketsVendidos() {
    const currentUserName = "Vendedor Alfa"; 
    
    const soldTickets = mockSoldTickets; 

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.mainTitle} numberOfLines={1}>
                    Tickets Vendidos: {currentUserName}
                </Text>
                <Text style={styles.subtitle}>
                    Listado de tickets gestionados y vendidos con éxito.
                </Text>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>Total Vendidos: </Text>
                    <Text style={styles.summaryCountSold}>{soldTickets.length}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {soldTickets.length > 0 ? (
                    soldTickets.map(ticket => (
                        <SoldTicketCard key={ticket.id} ticket={ticket} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={60} color={RED_500} />
                        <Text style={styles.emptyText}>Aún no tienes tickets registrados como vendidos.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
        paddingBottom: 15,
    },
    mainTitle: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 10,
    },
    summaryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.principal.green[50],
        padding: 10,
        borderRadius: 8,
    },
    summaryText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
    },
    summaryCountSold: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginLeft: 5,
    },
    
    listContent: {
        padding: 20,
    },
    ticketCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        shadowColor: NEUTRAL_700,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    ticketIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.principal.green[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: GREEN_500,
    },
    ticketInfo: {
        flex: 1,
    },
    ticketNumberTextSold: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 2,
    },
    ticketEventText: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
    },
    ticketPriceText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
    },
    
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50,
        backgroundColor: Colors.principal.red[50], 
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.principal.red[100],
    },
    emptyText: {
        fontSize: Typography.sizes.lg,
        color: GREEN_900,
        marginTop: 10,
        textAlign: 'center',
    }
});