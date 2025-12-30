import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500]; 
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLACK = 'black'; 

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

const SCAN_STATUS = {
    WAITING: 'Esperando escaneo...',
    SCANNING: 'Escaneando...',
    SUCCESS: 'Código QR detectado!',
    ERROR: 'QR no válido o ilegible.',
};

export default function PageScanQR() {
    const [scanStatus, setScanStatus] = useState(SCAN_STATUS.WAITING);
    const [scannedData, setScannedData] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(true); 

    const handleBarcodeScanned = ({ data }) => {
        setIsScanning(false); 
        
        if (data && data.startsWith('ID Vendedor:')) {
            setScannedData(data);
            setScanStatus(SCAN_STATUS.SUCCESS);
        } else {
            setScannedData(null);
            setScanStatus(SCAN_STATUS.ERROR);
            Alert.alert(
                "QR Inválido", 
                "El código escaneado no corresponde a un vendedor de Sortealope."
            );
        }
    };
    
    const focusColor = scanStatus === SCAN_STATUS.SUCCESS ? GREEN_500 : 
                       scanStatus === SCAN_STATUS.ERROR ? RED_500 : 
                       BLUE_500;
    
    if (!permission) {
        return (
            <View style={[styles.container, { justifyContent: 'center', backgroundColor: WHITE }]}>
                <Text style={{ color: GREEN_900 }}>Cargando permisos de cámara...</Text>
            </View>
        );
    }
    
    if (!permission.granted) {
        return (
            <View style={[styles.container, { justifyContent: 'center', backgroundColor: WHITE }]}>
                <Text style={styles.permissionText}>Necesitamos acceso a la cámara para escanear QR.</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.requestButton}>
                    <Text style={styles.requestButtonText}>Otorgar Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <CameraView 
                style={StyleSheet.absoluteFill} 
                facing="back"
                barcodeScanningSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            >
                <View style={styles.cameraOverlay}>
                    
                    <View style={styles.header}>
                        <Text style={styles.mainTitle}>Escanear Código QR</Text>
                        <Text style={styles.subtitle}>Enfoca el código de invitación del vendedor en el área marcada.</Text>
                    </View>

                    <View style={styles.scanAreaContainer}>
                        <View style={[styles.scanArea, { borderColor: focusColor }]} />
                        
                        <Ionicons name="scan" size={40} color={focusColor} style={styles.focusOverlayIcon} />
                    </View>
                    
                    <Text style={[styles.statusText, { color: focusColor }]}>
                        {scanStatus}
                    </Text>

                </View>
            </CameraView>

            {scannedData && (
                <View style={styles.resultBox}>
                    <Ionicons name="person-add-outline" size={24} color={GREEN_900} />
                    <Text style={styles.resultText}>Vendedor Listo para Asignación:</Text>
                    <Text style={styles.resultData}>{scannedData}</Text>
                    
                    <TouchableOpacity style={styles.assignButton} onPress={() => Alert.alert("Asignación", "Procediendo a asignar el vendedor...")}>
                        <Text style={styles.assignButtonText}>Asignar Evento</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.resetButton} onPress={() => { setScannedData(null); setScanStatus(SCAN_STATUS.WAITING); setIsScanning(true); }}>
                        <Text style={styles.resetButtonText}>Escanear Otro</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLACK, 
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        alignItems: 'center',
        paddingTop: 40,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    mainTitle: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: WHITE,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: Typography.sizes.base,
        color: Colors.principal.neutral[400], 
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    
    scannerWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanAreaContainer: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanArea: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        borderWidth: 5,
        borderRadius: 10,
    },
    focusOverlayIcon: {
        position: 'absolute',
        opacity: 0.8,
    },
    statusText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        marginTop: 20,
        marginBottom: 10,
    },
    
    resultBox: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: WHITE,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    resultText: {
        fontSize: Typography.sizes.md,
        color: NEUTRAL_700,
        marginTop: 5,
    },
    resultData: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginTop: 5,
    },
    assignButton: {
        backgroundColor: GREEN_900,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
        width: '80%',
        alignItems: 'center',
    },
    assignButtonText: {
        color: WHITE,
        fontWeight: Typography.weights.bold,
    },
    resetButton: {
        marginTop: 10,
    },
    resetButtonText: {
        color: RED_500,
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
    },
    
    permissionText: {
        fontSize: Typography.sizes.xl,
        color: GREEN_900,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    requestButton: {
        backgroundColor: BLUE_500,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    requestButtonText: {
        color: WHITE,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.lg,
    }
});