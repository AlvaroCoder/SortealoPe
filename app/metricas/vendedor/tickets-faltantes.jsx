import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500]; 
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const mockMissingTickets = [
    { id: 101, eventTitle: 'Súper Rifa Navideña', ticketNumber: 'T-0012', available: true, price: 20.00 },
    { id: 102, eventTitle: 'Colección Verano', ticketNumber: 'C-0105', available: true, price: 15.00 },
    { id: 103, eventTitle: 'Gran Sorteo Moto', ticketNumber: 'M-0511', available: true, price: 50.00 },
    { id: 104, eventTitle: 'Súper Rifa Navideña', ticketNumber: 'T-0013', available: true, price: 20.00 },
    { id: 105, eventTitle: 'Gran Sorteo Moto', ticketNumber: 'M-0512', available: true, price: 50.00 },
];

const MissingTicketCard = ({ ticket }) => (
    <TouchableOpacity style={styles.ticketCard}>
        <View style={styles.ticketIconContainer}>
            <Ionicons name="ticket-outline" size={24} color={GREEN_900} />
        </View>
        <View style={styles.ticketInfo}>
            <Text style={styles.ticketNumberText}>{ticket.ticketNumber}</Text>
            <Text style={styles.ticketEventText} numberOfLines={1}>{ticket.eventTitle}</Text>
        </View>
        <Text style={styles.ticketPriceText}>S/ {ticket.price.toFixed(2)}</Text>
    </TouchableOpacity>
);


export default function TicketsFaltantes() {
    const currentUserName = "Vendedor Alfa"; 
    
    const missingTickets = mockMissingTickets.filter(t => t.available); 

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.mainTitle} numberOfLines={1}>
                    Tickets Faltantes: {currentUserName}
                </Text>
                <Text style={styles.subtitle}>
                    Listado de tickets disponibles y no vendidos.
                </Text>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>Total Faltantes: </Text>
                    <Text style={styles.summaryCount}>{missingTickets.length}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {missingTickets.length > 0 ? (
                    missingTickets.map(ticket => (
                        <MissingTicketCard key={ticket.id} ticket={ticket} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="happy-outline" size={60} color={GREEN_500} />
                        <Text style={styles.emptyText}>¡Genial! No te faltan tickets por vender.</Text>
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
        backgroundColor: Colors.principal.red[50],
        padding: 10,
        borderRadius: 8,
    },
    summaryText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: RED_500,
    },
    summaryCount: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
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
    ticketNumberText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: RED_500,
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
        backgroundColor: Colors.principal.green[50],
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.principal.green[100],
    },
    emptyText: {
        fontSize: Typography.sizes.lg,
        color: GREEN_900,
        marginTop: 10,
        textAlign: 'center',
    }
});