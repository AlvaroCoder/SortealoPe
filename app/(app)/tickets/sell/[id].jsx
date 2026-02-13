import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Title from '../../../../components/common/Titles/Title';
import { Colors, Typography } from '../../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const YELLOW_500 = Colors.principal.yellow[200];
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const mockEventDetail = {
    title: "Rifa de Aniversario - Tech",
    ticketPrice: 25.00,
    availableTickets: [
        { id: 'T001', number: '0001', status: 'available' },
        { id: 'T002', number: '0002', status: 'available' },
        { id: 'T003', number: '0003', status: 'available' },
        { id: 'T004', number: '0004', status: 'available' },
        { id: 'T005', number: '0005', status: 'available' },
        { id: 'T006', number: '0006', status: 'available' },
        { id: 'T007', number: '0007', status: 'available' },
        { id: 'T008', number: '0008', status: 'available' },
        { id: 'T009', number: '0009', status: 'available' },
        { id: 'T010', number: '0010', status: 'available' },
        { id: 'T011', number: '0011', status: 'available' },
        { id: 'T012', number: '0012', status: 'reserved' }, 
    ]
};

const TicketItem = ({ ticket, isSelected, onToggle }) => {
    let backgroundColor = NEUTRAL_200;
    let textColor = NEUTRAL_700;
    let icon = 'lock-closed-outline'; 

    if (ticket.status === 'available') {
        backgroundColor = isSelected ? GREEN_500 : WHITE;
        textColor = isSelected ? WHITE : GREEN_900;
        icon = 'ticket-outline';
    } else if (ticket.status === 'reserved') {
         backgroundColor = Colors.principal.red[100];
         textColor = RED_500;
         icon = 'time-outline';
    }

    const isDisabled = ticket.status !== 'available';

    return (
        <TouchableOpacity 
            style={[styles.ticketItem, { backgroundColor: backgroundColor, borderColor: isSelected ? GREEN_900 : NEUTRAL_200 }]}
            onPress={() => !isDisabled && onToggle(ticket.id)}
            disabled={isDisabled}
        >
            <Ionicons name={icon} size={16} color={textColor} />
            <Text style={[styles.ticketNumber, { color: textColor }]}>
                {ticket.number}
            </Text>
            {isSelected && <Ionicons name="checkmark-circle" size={18} color={WHITE} style={{marginLeft: 5}} />}
        </TouchableOpacity>
    );
};


export default function PageSellTicket() {
    const params = useLocalSearchParams();
    const eventId = params.id;
    const [selectedTickets, setSelectedTickets] = useState({}); // { id: true/false }
    
    const event = mockEventDetail;

    const selectedCount = useMemo(() => {
        return Object.values(selectedTickets).filter(isSelected => isSelected).length;
    }, [selectedTickets]);

    const totalCost = useMemo(() => {
        return selectedCount * event.ticketPrice;
    }, [selectedCount, event.ticketPrice]);

    const handleToggleTicket = (ticketId) => {
        setSelectedTickets(prev => ({
            ...prev,
            [ticketId]: !prev[ticketId]
        }));
    };

    const getSelectedTicketIds = () => {
        return event.availableTickets
            .filter(t => selectedTickets[t.id])
            .map(t => t.number)
            .join(', ');
    };

    const handleAction = (action) => {
        if (selectedCount === 0) {
            Alert.alert("Error", "Selecciona al menos un ticket para continuar.");
            return;
        }
        
        const actionText = action === 'sell' ? "VENDIDOS" : "SEPARADOS";
        Alert.alert(
            `Confirmar ${actionText}`,
            `¿Deseas marcar los ${selectedCount} tickets (${getSelectedTicketIds()}) como ${actionText}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: actionText, onPress: () => {
                    setSelectedTickets({}); 
                    Alert.alert("Éxito", `Tickets marcados como ${actionText}.`);
                }}
            ]
        );
    };

    const renderTicketItem = ({ item }) => (
        <TicketItem 
            ticket={item}
            isSelected={!!selectedTickets[item.id]}
            onToggle={handleToggleTicket}
        />
    );
  
    const listPaddingBottom = 160; 

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Title>{event.title}</Title>
                <Text style={styles.subtitle}>Selecciona los tickets disponibles para marcar como vendidos o separados. (Precio: S/{event.ticketPrice.toFixed(2)})</Text>
            </View>

            <FlatList
                data={event.availableTickets}
                renderItem={renderTicketItem}
                keyExtractor={(item) => item.id}
                numColumns={4} 
                columnWrapperStyle={styles.row}
                contentContainerStyle={[styles.listContent, { paddingBottom: listPaddingBottom }]}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="sad-outline" size={50} color={NEUTRAL_200} />
                        <Text style={styles.emptyText}>No hay tickets disponibles para este evento.</Text>
                    </View>
                )}
            />

            <View style={styles.floatingCartContainer}>
                <View style={styles.cartSummary}>
                    <View>
                        <Text style={styles.cartLabel}>Tickets Seleccionados:</Text>
                        <Text style={styles.cartCount}>{selectedCount}</Text>
                    </View>
                    <View style={styles.totalCostBox}>
                        <Text style={styles.cartLabel}>Costo Total:</Text>
                        <Text style={styles.cartTotal}>S/ {totalCost.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.separateButton]}
                        onPress={() => handleAction('separate')}
                        disabled={selectedCount === 0}
                    >
                        <Ionicons name="time-outline" size={20} color={GREEN_900} />
                        <Text style={styles.separateButtonText}>SEPARAR</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.sellButton]}
                        onPress={() => handleAction('sell')}
                        disabled={selectedCount === 0}
                    >
                         <Ionicons name="checkmark-circle-outline" size={20} color={WHITE} />
                        <Text style={styles.sellButtonText}>VENDER</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
        paddingBottom: 15,
    },
    mainTitle: {
        fontSize: Typography.sizes['xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
    },
    
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    ticketItem: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        minHeight: 60,
        flexDirection: 'row',
    },
    ticketNumber: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.bold,
        marginLeft: 5,
    },
    
    floatingCartContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 15,
        zIndex: 10,
    },
    cartSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
        marginBottom: 10,
    },
    cartLabel: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
    },
    cartCount: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginTop: 2,
    },
    totalCostBox: {
        alignItems: 'flex-end',
    },
    cartTotal: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5, 
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    separateButton: {
        backgroundColor: YELLOW_500,
        borderWidth: 1,
        borderColor: GREEN_900,
    },
    separateButtonText: {
        color: GREEN_900,
        fontWeight: Typography.weights.bold,
        marginLeft: 5,
    },
    sellButton: {
        backgroundColor: GREEN_900,
    },
    sellButtonText: {
        color: WHITE,
        fontWeight: Typography.weights.bold,
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50,
        backgroundColor: NEUTRAL_200,
        borderRadius: 12,
        marginTop: 20,
    },
    emptyText: {
        fontSize: Typography.sizes.lg,
        color: NEUTRAL_700,
        marginTop: 10,
        textAlign: 'center',
    }
});