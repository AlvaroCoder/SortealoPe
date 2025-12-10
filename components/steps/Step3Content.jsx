import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import ButtonUploadImage from '../common/Buttons/ButtonUploadImage';
import Title from '../common/Titles/Title';

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const MOCK_IMAGE_URL = 'https://placehold.co/400x200/16CD91/FFFFFF?text=Dise%C3%B1o+del+Ticket'; 

export default function Step3Content({ form, setForm, onSubmit, onBack }) {
    
    const pickImage = (imageType) => {
        
        const imageUrl = MOCK_IMAGE_URL + `+${imageType}`;
        
        Alert.alert("Simulación de Carga", `Imagen para ${imageType} seleccionada.`);
        
        setForm(prev => ({ ...prev, [imageType]: imageUrl }));
    };

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
            <Title>
                3. Diseño y Archivos Promocionales
            </Title>
            <Text style={styles.stepSubtitleText}>
                Sube la imagen de la rifa (Banner principal) y el diseño visual que tendrán los tickets.
            </Text>
            
            <Text style={styles.inputLabel}>Diseño Visual del Ticket (*)</Text>
            <TouchableOpacity 
                onPress={() => pickImage('ticketDesign')}
                style={styles.imageUploadWrapper}
            >
                {getPreview('ticketDesign')}
            </TouchableOpacity>

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
        marginTop: 15,
        marginBottom: 8,
    },
    hintText: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        textAlign: 'right',
        marginTop: 5,
    },
    
    imageUploadWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: NEUTRAL_200,
        
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
      
        padding: 20,
    },
    placeholderTextSmall: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 5,
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 40,
        gap : 8
    },
    nextButton: {
        flex: 1,

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