import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EventCard from '../../components/cards/EventCard';
import { Colors, Typography } from '../../constants/theme';
import DataCardEvent from "../../mock/DataCardEvent.json";

const GREEN_900 = Colors.principal.green[900];
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