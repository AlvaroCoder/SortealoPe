import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import ButtonUploadImage from '../common/Buttons/ButtonUploadImage';

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

// URL mock para simular la subida de una imagen
const MOCK_IMAGE_URL = 'https://placehold.co/400x200/16CD91/FFFFFF?text=Dise%C3%B1o+del+Ticket'; 

export default function Step3Content({ form, setForm, onSubmit, onBack }) {
    
    const pickImage = (imageType) => {
        // En una aplicación real, aquí llamarías a ImagePicker.launchImageLibraryAsync
        
        // Usamos una URL mock para demostrar la selección
        const imageUrl = MOCK_IMAGE_URL + `+${imageType}`;
        
        // Alerta para simular el proceso de carga
        Alert.alert("Simulación de Carga", `Imagen para ${imageType} seleccionada.`);
        
        // Guardamos la URL en el formulario
        setForm(prev => ({ ...prev, [imageType]: imageUrl }));
    };

    // Función para obtener la vista previa
    const getPreview = (imageType) => {
        const source = form[imageType] ? { uri: form[imageType] } : null;
        
        return (
            <View style={styles.imagePreviewContainer}>
                {source ? (
                    <Image source={source} style={styles.imagePreview} resizeMode="cover" />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={40} color={NEUTRAL_700} />
                        <Text style={styles.placeholderTextSmall}>Haz clic para seleccionar la imagen</Text>
                    </View>
                )}
            </View>
        );
    };

    const handleFinalSubmit = () => {
        if (!form.ticketDesign) {
             Alert.alert("Error", "Debes subir al menos el Diseño del Ticket antes de publicar.");
             return;
        }
        onSubmit();
    };


    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitleText}>3. Diseño y Archivos Promocionales</Text>
            <Text style={styles.stepSubtitleText}>
                Sube la imagen de la rifa (Banner principal) y el diseño visual que tendrán los tickets.
            </Text>
            
            {/* 1. CARGA DE IMAGEN DEL TICKET (Obligatorio) */}
            <Text style={styles.inputLabel}>Diseño Visual del Ticket (*)</Text>
            <TouchableOpacity 
                onPress={() => pickImage('ticketDesign')}
                style={styles.imageUploadWrapper}
            >
                {getPreview('ticketDesign')}
            </TouchableOpacity>

            {/* 2. CARGA DE BANNER PRINCIPAL (Opcional) */}
            <Text style={styles.inputLabel}>Imagen Principal de la Rifa (Banner)</Text>
            <ButtonUploadImage />
            
            <Text style={styles.hintText}>Formato recomendado: JPG/PNG. Máx. 2MB</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" style={{color : GREEN_900}} size={24} />
                </TouchableOpacity>
                <ButtonGradiend onPress={handleFinalSubmit} style={styles.nextButton}>
                    Finalizar
                </ButtonGradiend>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stepContent: {
        width: '100%',
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
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
        marginTop: 15,
        marginBottom: 8,
    },
    hintText: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        textAlign: 'right',
        marginTop: 5,
    },
    
    // --- ESTILOS DE CARGA DE IMAGEN ---
    imageUploadWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: NEUTRAL_200,
        backgroundColor: GREEN_100,
        marginBottom: 10,
    },
    imagePreviewContainer: {
        height: 150,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.principal.green[50],
        padding: 20,
    },
    placeholderTextSmall: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 5,
    },

    // --- BOTONES DE ACCIÓN ---
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 100,
    },
    nextButton: {
        flex: 1,
        marginLeft: 10,

    },
    backButton: {
      borderColor: GREEN_900,
      borderRadius: "100%",
        width : 50,
      borderWidth: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems : 'center'
    },
});