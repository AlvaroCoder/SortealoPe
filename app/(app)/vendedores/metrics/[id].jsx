import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Title from '../../../../components/common/Titles/Title';
import { Colors, Typography } from '../../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const mockVendorData = {
    '1': { name: "Ana Torres", assignedTickets: 10, soldTickets: 5, totalRevenue: 150.00, email: "ana.t@email.com" },
    '2': { name: "Carlos Ruiz", assignedTickets: 15, soldTickets: 3, totalRevenue: 24.00, email: "carlos.r@email.com" },
    '3': { name: "Maria López", assignedTickets: 20, soldTickets: 10, totalRevenue: 150.00, email: "maria.l@email.com" },
    'default': { name: "Vendedor No Encontrado", assignedTickets: 0, soldTickets: 0, totalRevenue: 0.00, email: "n/a" },
};

const MetricCard = ({ label, value, icon, color }) => (
  <View style={styles.metricCard}>
    <View style={[styles.metricIconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={28} color={WHITE} />
    </View>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

export default function PageIdVendedor() {
    const params = useLocalSearchParams();
    const vendedorId = params.id;
    const vendor = mockVendorData[vendedorId] || mockVendorData.default;

    const metrics = useMemo(() => {
        const remainingTickets = vendor.assignedTickets - vendor.soldTickets;

        return [
            { 
                label: "Tickets Vendidos", 
                value: vendor.soldTickets.toLocaleString(), 
                icon: 'checkmark-circle-outline', 
                color: GREEN_500 
            },
            { 
                label: "Tickets Reservados", 
                value: remainingTickets.toLocaleString(), 
                icon: 'close-circle-outline', 
                color: RED_500 
            },
            { 
                label: "Total Disponibles", 
                value: `15`, 
                icon: 'cash-outline', 
                color: Colors.principal.yellow[600]
            },
        ];
    }, [vendor]);
  
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Title styleTitle={styles.mainTitle}>Vendedor:</Title>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorEmail}>{vendor.email}</Text>
            </View>

            <View style={styles.metricsGrid}>
                <Text style={styles.sectionTitle}>Rendimiento del Vendedor</Text>
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </View>

            <View style={styles.assignmentBox}>
                <Ionicons name="ticket-outline" size={30} color={GREEN_900} />
                <View>
                    <Text style={styles.assignmentLabel}>Tickets Asignados</Text>
                    <Text style={styles.assignmentValue}>
                        {vendor.assignedTickets.toLocaleString()}
                    </Text>
                </View>
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    
    header: {
        marginBottom: 30,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
    },
    mainTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: NEUTRAL_700,
    },
    vendorName: {
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginTop: 5,
    },
    vendorEmail: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginTop: 2,
    },
    
    sectionTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: GREEN_500,
        paddingLeft: 10,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: '48%',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.principal.green[800],
    },
    metricIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    metricLabel: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: NEUTRAL_700,
        marginTop: 5,
    },
    metricValue: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
    },
    
    assignmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.principal.green[50],
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: GREEN_500,
    },
    assignmentLabel: {
        fontSize: Typography.sizes.md,
        color: GREEN_900,
        fontWeight: Typography.weights.medium,
        marginLeft: 15,
    },
    assignmentValue: {
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
        marginLeft: 15,
    }
});