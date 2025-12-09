import { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import CollectionOption from '../common/Card/ColletionOption';
import Title from '../common/Titles/Title';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

const COLLECTIONS = [
    { tickets: 100, price: 10.00, label: "Paquete Bronce" },
    { tickets: 200, price: 20.00, label: "Paquete Plata" },
    { tickets: 500, price: 50.00, label: "Paquete Oro" },
    { tickets: 1000, price: 100.00, label: "Paquete Platino" },
];

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
            <Title>1. Define el Paquete de Tickets</Title>
            <Text style={styles.stepSubtitleText}>Selecciona un paquete predefinido o usa la opción personalizada abajo.</Text>
            
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
        marginVertical: 10,
    },
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
    collectionListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    buttonContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    nextButton: {
        width: '100%',

    },
});