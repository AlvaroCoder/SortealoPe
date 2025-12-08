import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const RED_500 = Colors.principal.red[500];
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function QRVendedorModal({
    visible,
    onClose,
    qrCodeData
}) {
  return (
      <Modal
          animationType='slide'
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
      >
                      <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Código QR de Invitación</Text>
                    <Text style={modalStyles.modalSubtitle}>Escanea para asignar un vendedor</Text>

                    <View style={modalStyles.qrCodeBox}>
                        <Text style={modalStyles.qrCodePlaceholder}>
                            [CÓDIGO QR]
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
            </View>
    </Modal>
  )
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
    modalTitle: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 20,
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