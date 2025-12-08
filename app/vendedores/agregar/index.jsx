import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ButtonActionAgregar from '../../../components/common/Buttons/ButtonActionAgregar';
import QRVendedorModal from '../../../components/common/Dividers/QRVendedorModal';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const WHITE = 'white';
const NEUTRAL_700 = Colors.principal.neutral[700];

const QR_DATA_MOCK = "sortealope://vendedor/invitar/eventoId123";

export default function PageAgregarVendedor() {
    const [isQrModalVisible, setIsQrModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            
            <Text style={styles.mainTitle}>Agregar un Vendedor</Text>
            <Text style={styles.subtitle}>Selecciona cómo deseas integrar nuevos vendedores a tu evento.</Text>

            <View style={styles.actionsContainer}>
                <ButtonActionAgregar
                    icon="cloud-upload-outline"
                    title="Importar Vendedores"
                    subtitle="Carga una lista masiva (CSV/Excel)"
                    onPress={() => Alert.alert("Importar", "Abriendo pantalla de importación...")}
                />
                
                <ButtonActionAgregar
                    icon="qr-code-outline"
                    title="Agregar por QR"
                    subtitle="Genera un enlace/código de invitación"
                    onPress={() => setIsQrModalVisible(true)}
                />
            </View>
            
            <QRVendedorModal 
                visible={isQrModalVisible}
                onClose={() => setIsQrModalVisible(false)}
                qrCodeData={QR_DATA_MOCK}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        padding: 24,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        textAlign: 'center',
        marginBottom: 40,
    },
    actionsContainer: {
        width: '100%',
        maxWidth: 400, 
        gap: 20,
    },
    
});
