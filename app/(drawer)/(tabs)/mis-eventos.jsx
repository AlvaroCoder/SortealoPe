import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';
import DataCardEvent from "../../../mock/DataCardEvent.json";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = 'white'
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const mockEvents = DataCardEvent.map((event, index) => ({
    ...event,
    currentState: index % 3 === 0 ? 'EN_ESPERA' : index % 3 === 1 ? 'EMPEZADO' : 'CREADO',
}));

const TABS = [
    { key: 'CREADO', title: 'Creados', icon: 'cube-outline' },
    { key: 'EMPEZADO', title: 'Activos', icon: 'play-circle-outline' },
    { key: 'EN_ESPERA', title: 'En Espera', icon: 'time-outline' },
];

const EventCard = ({ event }) => {
    const statusColor = event.currentState === 'EMPEZADO' ? GREEN_500 : event.currentState === 'CREADO' ? RED_500 : NEUTRAL_700;
    
    return (
        <TouchableOpacity style={styles.eventCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
                <Text style={[styles.cardStatus, { color: statusColor }]}>
                    {event.currentState === 'EMPEZADO' ? 'Activo' : event.currentState === 'CREADO' ? 'Nuevo' : 'En Espera'}
                </Text>
            </View>
            <View style={styles.cardDetail}>
                <Ionicons name="pricetags-outline" size={16} color={GREEN_900} style={{marginRight: 5}}/>
                <Text style={styles.cardDetailText}>{event.totalTickets} Tickets @ S/{event.ticketPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.cardDetail}>
                <Ionicons name="calendar-outline" size={16} color={GREEN_900} style={{marginRight: 5}}/>
                <Text style={styles.cardDetailText}>Sorteo: {event.createdAt || 'Fecha sin definir'}</Text>
            </View>
        </TouchableOpacity>
    );
};


export default function MisEventos() {
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    
    const filteredEvents = mockEvents.filter(event => event.currentState === activeTab);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Ionicons 
                            name={tab.icon} 
                            size={20} 
                            color={activeTab === tab.key ? WHITE : GREEN_900} 
                        />
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                <Text style={styles.eventCountText}>{filteredEvents.length} Eventos encontrados</Text>

                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <View style={styles.noEventsContainer}>
                        <Ionicons name="search-outline" size={50} color={NEUTRAL_200} />
                        <Text style={styles.noEventsText}>No tienes eventos en este estado.</Text>
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.principal.green[50], 
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-around',
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: NEUTRAL_200,
    },
    tabItemActive: {
        backgroundColor: GREEN_900,
        borderColor: GREEN_900,
    },
    tabText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginLeft: 5,
    },
    tabTextActive: {
        color: WHITE,
    },
    
    listContent: {
        padding: 20,
    },
    eventCountText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 15,
        fontWeight: Typography.weights.medium,
    },
    eventCard: {
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        shadowColor: Colors.principal.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        flex: 1,
        marginRight: 10,
    },
    cardStatus: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
    },
    cardDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    cardDetailText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
    },
    noEventsContainer: {
        alignItems: 'center',
        paddingVertical: 50,
        backgroundColor: Colors.principal.green[50],
        borderRadius: 12,
        marginTop: 20,
    },
    noEventsText: {
        fontSize: Typography.sizes.lg,
        color: NEUTRAL_700,
        marginTop: 10,
    }
});