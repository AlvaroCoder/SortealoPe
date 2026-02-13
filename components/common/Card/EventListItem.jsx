import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";
import { useDateFormatter } from "../../../lib/dateFormatter";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const GREEN_100 = Colors.principal.green[100];

const EventListItem = ({ event }) => {
    const statusColor = event.availableTickets > 0 ? GREEN_500 : RED_500;
    const statusText = event.availableTickets > 0 ? 'Activo' : 'Finalizado';
    const { formatDateToSpanish } = useDateFormatter();
    const router = useRouter();
    return (
        <TouchableOpacity style={itemStyles.card} onPress={() => router.push({
            pathname: '/event/[id]',
            params : {id : event.id}
        })}>
            <Image source={{ uri: event.urlImagen }} style={itemStyles.image} />
            <View style={itemStyles.infoContainer}>
                <Text style={itemStyles.title} numberOfLines={1}>{event.title}</Text>
                <Text style={itemStyles.price}>S/ {event.ticketPrice.toFixed(2)} c/u</Text>
                <View style={itemStyles.detailsRow}>
                    <Ionicons name="calendar-outline" size={14} color={NEUTRAL_700} style={{ marginRight: 4 }} />
                    <Text style={itemStyles.detailText}>Sorteo: {formatDateToSpanish(event.createdAt) || 'N/A'}</Text>
                </View>
                <View style={itemStyles.detailsRow}>
                    <Ionicons name="ticket-outline" size={14} color={NEUTRAL_700} style={{ marginRight: 4 }} />
                    <Text style={itemStyles.detailText}>{event.availableTickets}/{event.totalTickets} vendidos</Text>
                </View>
            </View>
            <View style={itemStyles.statusPill}>
                 <Text style={[itemStyles.statusText, { color: statusColor }]}>{statusText}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color={GREEN_900} />
        </TouchableOpacity>
    );
};

export default EventListItem;

const itemStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: GREEN_100,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 2,
    },
    price: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
        marginBottom: 5,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: Colors.principal.green[50],
        marginRight: 10,
    },
    statusText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
    }
});