import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

const COLLECTIONS = [
    { tickets: 100, price: 10.00, label: "Paquete Bronce" },
    { tickets: 200, price: 15.00, label: "Paquete Plata" },
    { tickets: 500, price: 25.00, label: "Paquete Oro" },
    { tickets: 1000, price: 40.00, label: "Paquete Platino" },
];

const CollectionOption = ({ item, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.collectionCard, isSelected && styles.collectionCardSelected]}
        onPress={() => onPress(item)}
    >
        <Text style={styles.collectionLabel}>{item.label}</Text>
        <Text style={styles.collectionTickets}>{item.tickets} Tickets</Text>
        <Text style={styles.collectionPrice}>S/ {item.price.toFixed(2)} c/u</Text>
        {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color={GREEN_900} style={styles.collectionCheck} />
        )}
    </TouchableOpacity>
);

export default function Step1Content({ form, setForm, onNext }) {
    const totalRevenue = useMemo(() => {
        const count = parseFloat(form.ticketCount) || 0;
        const price = parseFloat(form.unitPrice) || 0;
        return (count * price).toFixed(2);
    }, [form.ticketCount, form.unitPrice]);

    const handleNext = () => {
        if (!form.ticketCount || !form.unitPrice || parseFloat(form.ticketCount) <= 0 || parseFloat(form.unitPrice) <= 0) {
            Alert.alert("Error", "Por favor, ingresa una cantidad y precio de ticket válidos.");
            return;
        }
        onNext({ totalRevenue });
    };

    const handleCollectionSelect = (item) => {
        setForm(prev => ({ 
            ...prev, 
            ticketCount: item.tickets.toString(), 
            unitPrice: item.price.toFixed(2),
            customMode: false 
        }));
    };

    const isCustom = form.customMode !== false; 
    
    const isSelected = (item) => 
        !isCustom && 
        item.tickets.toString() === form.ticketCount && 
        item.price.toFixed(2) === form.unitPrice;


    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitleText}>1. Define el Paquete de Tickets</Text>
            <Text style={styles.stepSubtitleText}>Selecciona un paquete predefinido o usa la opción personalizada abajo.</Text>
            
            {/* 🟢 LISTA DE COLECCIONES PREDEFINIDAS */}
            <View style={styles.collectionListContainer}>
                {COLLECTIONS.map((item) => (
                    <CollectionOption 
                        key={item.tickets}
                        item={item}
                        isSelected={isSelected(item)}
                        onPress={handleCollectionSelect}
                    />
                ))}
            </View>
            
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>— O personalizar el paquete —</Text>

            <Text style={styles.inputLabel}>Cantidad de Tickets a Emitir (Volumen)</Text>
            <TextInput
                style={[styles.textInput, isCustom && styles.textInputActive]}
                keyboardType="numeric"
                placeholder="Ej: 100, 200, 500"
                value={form.ticketCount}
                onFocus={() => setForm(prev => ({ ...prev, customMode: true }))}
                onChangeText={(text) => setForm(prev => ({ ...prev, ticketCount: text.replace(/[^0-9]/g, ''), customMode: true }))}
                placeholderTextColor={NEUTRAL_200}
            />

            <Text style={styles.inputLabel}>Precio Unitario del Ticket (Soles)</Text>
            <TextInput
                style={[styles.textInput, isCustom && styles.textInputActive]}
                keyboardType="numeric"
                placeholder="Ej: 10.00, 25.50"
                value={form.unitPrice}
                onFocus={() => setForm(prev => ({ ...prev, customMode: true }))}
                onChangeText={(text) => setForm(prev => ({ ...prev, unitPrice: text.replace(/[^0-9.]/g, ''), customMode: true }))}
                placeholderTextColor={NEUTRAL_200}
            />

            <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Recaudación Potencial Estimada:</Text>
                <Text style={styles.metricValue}>S/ {totalRevenue}</Text>
                <Ionicons name="cash-outline" size={30} color={GREEN_900} style={styles.metricIcon} />
            </View>

            <View style={styles.buttonContainer}>
                <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
                    Continuar
                </ButtonGradiend>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stepContent: {
        width: '100%',
        paddingBottom : 40
    },
    stepTitleText: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 8,
    },
    stepSubtitleText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.bold,
        color: NEUTRAL_700,
        textAlign: 'center',
        marginVertical: 10,
    },

    collectionListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    collectionCard: {
        width: '48%', 
        backgroundColor: GREEN_100,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: GREEN_100,
        position: 'relative',
    },
    collectionCardSelected: {
        borderColor: GREEN_500,
        backgroundColor: Colors.principal.green[50],
        borderWidth: 2,
    },
    collectionLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 5,
    },
    collectionTickets: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
    },
    collectionPrice: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 4,
    },
    collectionCheck: {
        position: 'absolute',
        top: 8,
        right: 8,
    },

    // --- ESTILOS DE FORMULARIO ---
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
        marginTop: 15,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        borderRadius: 12,
        padding: 15,
        fontSize: Typography.sizes.lg,
        color: GREEN_900,
        backgroundColor: WHITE,
    },
    textInputActive: {
        borderColor: GREEN_500,
        backgroundColor: Colors.principal.green[50],
    },
    metricBox: {
        backgroundColor: GREEN_100,
        borderRadius: 12,
        padding: 20,
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: GREEN_500,
    },
    metricValue: {
        fontSize: Typography.sizes['xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
    },
    metricIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        opacity: 0.1,
    },
    metricLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
    },

    // --- BOTONES DE ACCIÓN (Centrado) ---
    buttonContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    nextButton: {
        width: '100%',

    },
});