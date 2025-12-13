import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';
import ButtonGradiend from '../../common/Buttons/ButtonGradiendt';

const GREEN_900 = Colors.principal.green[900];
const RED_500 = Colors.principal.red[500];
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const Step1Content = ({ ticketQuantity, setTicketQuantity, onNext }) => {
    
    const handleQuantityChange = (text) => {
        const cleanText = text.replace(/[^0-9]/g, '');
        setTicketQuantity(cleanText);
    };

    const handleContinue = () => {
        const quantity = parseInt(ticketQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            Alert.alert("Error", "Por favor, ingresa una cantidad válida de tickets (mayor a cero).");
            return;
        }
        onNext();
    };

    return (
        <View style={modalStyles.stepContainer}>
            <Text style={modalStyles.modalTitle}>Asignación de Tickets</Text>
            <Text style={modalStyles.modalSubtitle}>
                Ingresa la cantidad de tickets que asignarás a este vendedor.
            </Text>

            <Text style={modalStyles.inputLabel}>Cantidad de Tickets (*)</Text>
            <TextInput
                style={modalStyles.textInput}
                keyboardType='numeric'
                placeholder='Ej: 100'
                value={ticketQuantity}
                onChangeText={handleQuantityChange}
                maxLength={5}
                placeholderTextColor={NEUTRAL_200}
            />

            <ButtonGradiend
                onPress={handleContinue}
                style={modalStyles.continueButton}
            >
                Continuar 
            </ButtonGradiend>
        </View>
    );
};

const Step2Content = ({ qrCodeData, onClose, ticketQuantity }) => (
    <View style={modalStyles.stepContainer}>
        <Text style={modalStyles.modalTitle}>Código QR de Invitación</Text>
        <Text style={modalStyles.modalSubtitle}>
            Asignados: {parseInt(ticketQuantity).toLocaleString()} tickets.
        </Text>

        <View style={modalStyles.qrCodeBox}>
            <Text style={modalStyles.qrCodePlaceholder}>
                [QR GENERADO]
            </Text>
            <Text style={modalStyles.qrCodeLink}>{qrCodeData}</Text>
        </View>
        
        <Text style={modalStyles.warningText}>
            <Ionicons name="warning-outline" size={14} color={RED_500} /> 
            {' El código es válido por 24 horas.'}
        </Text>

        <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={onClose}
        >
            <Text style={modalStyles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
    </View>
);


export default function QRVendedorModal({
    visible,
    onClose,
    qrCodeData,
    initialQuantity = '10'
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [ticketQuantity, setTicketQuantity] = useState(initialQuantity);

    const handleNext = () => {
        setCurrentStep(2);
    };

    const handleCloseModal = () => {
        setCurrentStep(1);
        onClose();
    };

    const renderContent = () => {
        if (currentStep === 1) {
            return (
                <Step1Content
                    ticketQuantity={ticketQuantity}
                    setTicketQuantity={setTicketQuantity}
                    onNext={handleNext}
                />
            );
        }
        return (
            <Step2Content 
                qrCodeData={qrCodeData} 
                onClose={handleCloseModal}
                ticketQuantity={ticketQuantity}
            />
        );
    };

  return (
      <Modal
          animationType='slide'
          transparent={true}
          visible={visible}
          onRequestClose={handleCloseModal}
      >
        <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
                {renderContent()}
            </View>
        </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        width: Dimensions.get('window').width * 0.85,
        maxWidth: 400,
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    stepContainer: {
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 5,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 20,
        textAlign: 'center',
    },
    
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        borderRadius: 12,
        padding: 15,
        fontSize: Typography.sizes.lg,
        color: GREEN_900,
        backgroundColor: WHITE,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: Typography.weights.bold,
    },
    continueButton: {
        width: '100%',
        
    },

    qrCodeBox: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 5,
        borderColor: GREEN_900,
        marginBottom: 20,
        position: 'relative',
    },
    qrCodePlaceholder: {
        fontSize: 20,
        color: NEUTRAL_700,
        padding: 50,
        backgroundColor: NEUTRAL_200,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    qrCodeLink: {
        fontSize: Typography.sizes.xs,
        color: NEUTRAL_700,
        marginTop: 10,
        textAlign: 'center',
    },
    warningText: {
        fontSize: Typography.sizes.sm,
        color: RED_500,
        marginTop: 10,
    },
    closeButton: {
        backgroundColor: RED_500,
        padding: 15,
        borderRadius: 12,
        marginTop: 25,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: WHITE,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.lg,
    }
});