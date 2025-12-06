import { useState } from 'react';
import { Alert, LayoutAnimation, ScrollView, StyleSheet, View } from 'react-native';

import Step1Content from '../../../components/steps/Step1Content';
import Step2Content from '../../../components/steps/Step2Content';
import Step3Content from '../../../components/steps/Step3Content';
import StepperHeader from '../../../components/steps/StepperHeader';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

const STEPS = [
    { id: 1, title: 'Paquete de Tickets', icon: 'pricetags-outline' },
    { id: 2, title: 'Detalles del Premio', icon: 'gift-outline' },
    { id: 3, title: 'Diseño y Archivos', icon: 'image-outline' },
];


export default function CreateEventStepper() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        ticketCount: '100',
        unitPrice: '10.00',
        totalRevenue: '1000.00',
    });
    
    const handleNext = (data = {}) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFormData(prev => ({ ...prev, ...data }));
        setCurrentStep(prev => prev < STEPS.length ? prev + 1 : prev);
    };

    const handleBack = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCurrentStep(prev => prev > 1 ? prev - 1 : prev);
    };

    const handleSubmit = () => {
        Alert.alert("Evento Creado", `El evento ha sido creado con los datos del formulario. Recaudación Potencial: S/ ${formData.totalRevenue}`);
    };

    const renderContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1Content form={formData} setForm={setFormData} onNext={handleNext} />;
            case 2:
                return <Step2Content form={formData} setForm={setFormData} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Step3Content form={formData} setForm={setFormData} onSubmit={handleSubmit} onBack={handleBack} />;
            default:
                return <Step1Content form={formData} setForm={setFormData} onNext={handleNext} />;
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <StepperHeader currentStep={currentStep} />
            <View style={styles.contentWrapper}>
                {renderContent()}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    contentWrapper: {
        paddingHorizontal: 24,
        paddingTop: 20,
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
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
    },
    metricIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        opacity: 0.1,
    },
    
    // --- BOTONES DE ACCIÓN ---
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    nextButton: {
        flex: 1,
        marginLeft: 10,
    },
    backButton: {
        flex: 1,
        marginRight: 10,
    },
    placeholderText: {
        textAlign: 'center',
        paddingVertical: 50,
        backgroundColor: NEUTRAL_200,
        borderRadius: 12,
        marginTop: 20,
        color: NEUTRAL_700,
        fontStyle: 'italic',
    }
});