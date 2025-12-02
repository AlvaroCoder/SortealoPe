import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProfileAvatar from '../../components/cards/ProfileAvatar';
import ProgressBar from '../../components/cards/ProgressBar';
import { Colors, Typography } from '../../constants/theme';
import { useDateFormatter } from '../../lib/dateFormatter';
import DataCardEvent from "../../mock/DataCardEvent.json";
import FloatinActionButtons from '../../views/SectionsButtons/FloatinActionButtons';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_100 = Colors.principal.neutral[100];

const mockAssignedSellers = [
    { id: 1, name: "Ana P.", avatarUrl: "https://placehold.co/50x50/16CD91/FFFFFF?text=AP" },
    { id: 2, name: "Benito R.", avatarUrl: "https://placehold.co/50x50/34D399/FFFFFF?text=BR" },
    { id: 3, name: "Calixto V.", avatarUrl: "https://placehold.co/50x50/059669/FFFFFF?text=CV" },
];

const mockRecentBuyers = [
    { id: 10, name: "Juan M.", avatarUrl: "https://placehold.co/50x50/F2B705/FFFFFF?text=JM" },
    { id: 11, name: "Luisa C.", avatarUrl: "https://placehold.co/50x50/14B8A6/FFFFFF?text=LC" },
    { id: 12, name: "Pedro G.", avatarUrl: "https://placehold.co/50x50/F2B705/FFFFFF?text=PG" },
    { id: 13, name: "Elena F.", avatarUrl: "https://placehold.co/50x50/14B8A6/FFFFFF?text=EF" },
    { id: 14, name: "Roberto B.", avatarUrl: "https://placehold.co/50x50/F2B705/FFFFFF?text=RB" },
];

export default function EventDetailPage() {
    const { formatDateToSpanish } = useDateFormatter();
    
    const params = useLocalSearchParams();
    const eventId = params.id; 
    
    const data = DataCardEvent;
    const event = data?.filter((item)=>parseInt(eventId) === item.id)[0]; 
    
    if (!event) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: RED_500 }}>Evento ID: {eventId} no encontrado.</Text>
            </View>
        );
    }
    const assignedSellers = event.assignedSellers || mockAssignedSellers;
    const recentBuyers = event.recentBuyers || mockRecentBuyers;
    const hasSellers = assignedSellers && assignedSellers.length > 0;
    const hasBuyers = recentBuyers && recentBuyers.length > 0;

    return (
        <View style={styles.container}>
            
            <FloatinActionButtons />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: event.urlImagen }} 
                        style={styles.eventImage} 
                        onError={() => console.log('Error loading image')}
                    />
                </View>
                
                <View style={styles.contentSection}>
                    
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={18} color={GREEN_500} />
                        <Text style={styles.infoText}>Fecha de Sorteo: {formatDateToSpanish(event?.createdAt)}</Text>
                    </View>

                    <View style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Detalles del Evento</Text>
                    <Text style={styles.descriptionText}>{event.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Progreso de Tickets</Text>
                    <ProgressBar available={event.availableTickets} total={event.totalTickets} />

                    <View style={styles.divider} />
                    
                    <View style={styles.purchaseSummary}>
                        <View>
                            <Text style={styles.priceLabel}>Precio por Ticket:</Text>
                            <Text style={styles.priceValue}>S/ {event.ticketPrice.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Vendedores Asignados ({assignedSellers.length})</Text>
                    
                    {hasSellers ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileList}>
                            {assignedSellers.map(seller => (
                                <ProfileAvatar key={seller.id} user={seller} />
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noSellerText}>
                            <Ionicons name="alert-circle-outline" size={16} color={RED_500} /> 
                            {' No hay vendedores asignados.'}
                        </Text>
                    )}

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Compradores Recientes ({recentBuyers.length})</Text>
                    
                    {hasBuyers ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileList}>
                            {recentBuyers.map(buyer => (
                                <ProfileAvatar key={buyer.id} user={buyer} />
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noSellerText}>
                            No hay compradores registrados aún.
                        </Text>
                    )}
                    
                </View>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    scrollContent: {
        paddingBottom: 100, 
    },
    
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
        backgroundColor: NEUTRAL_100,
    },
    eventImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // --- CONTENIDO PRINCIPAL ---
    contentSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
        backgroundColor: WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20, // Efecto de superposición
    },
    eventTitle: {
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoText: {
        fontSize: Typography.sizes.md,
        color: NEUTRAL_700,
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: NEUTRAL_100,
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        lineHeight: 22,
    },
    purchaseSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    priceLabel: {
        fontSize: Typography.sizes.md,
        color: NEUTRAL_700,
    },
    priceValue: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500, 
        marginTop: 4,
    },
    debugText: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        textAlign: 'center',
        paddingVertical: 10,
    },

    // --- ESTILOS DE PERFILES HORIZONTALES (VENDEDORES/COMPRADORES) ---
    profileList: {
        paddingVertical: 5,
        marginBottom: 10,
    },
    noSellerText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        backgroundColor: Colors.principal.red[50],
        padding: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: RED_500,
    },
    
});