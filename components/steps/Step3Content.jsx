import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import ButtonUploadImage from '../common/Buttons/ButtonUploadImage';
import Title from '../common/Titles/Title';

export function Step3Content({ form = {}, setForm, onSubmit, onBack }) {
    
    const handleImageSelected = (imageType, uri) => {
        setForm(prev => ({ ...prev, [imageType]: uri }));
    };

    const handleFinalSubmit = () => {
        if (!form.ticketDesign) {
             Alert.alert(
                "Campo Requerido", 
                "Es obligatorio subir el Diseño del Ticket con las dimensiones exactas (1080x1620 px)."
             );
             return;
        }
        if (onSubmit) onSubmit();
    };

    return (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Title>3. Diseño y Archivos Promocionales</Title>
            
            <Text style={styles.stepSubtitleText}>
                Sube las piezas gráficas de tu evento. Recuerda que deben cumplir con el tamaño de 1080x1620 px para asegurar la calidad.
            </Text>
            
            <Text style={styles.inputLabel}>Diseño Visual del Ticket (*)</Text>
            <ButtonUploadImage 
                title="Subir Diseño de Ticket"
                subtitle="Requerido: 1080 x 1620 px"
                requiredWidth={1080}
                requiredHeight={1620}
                image={form.ticketDesign}
                onImageSelected={(uri) => handleImageSelected('ticketDesign', uri)}
            />

            <Text style={styles.inputLabel}>Imagen Principal de la Rifa (Banner)</Text>
            <ButtonUploadImage 
                title="Subir Banner Promocional"
                subtitle="Requerido: 1080 x 1620 px"
                requiredWidth={1080}
                requiredHeight={1620}
                image={form.mainBanner}
                onImageSelected={(uri) => handleImageSelected('mainBanner', uri)}
            />
            
            <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.principal.neutral[700]} />
                <Text style={styles.hintText}>
                    Las imágenes que no cumplan con las dimensiones exactas serán rechazadas por el sistema.
                </Text>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" style={{ color: Colors.principal.green[900] }} size={24} />
                </TouchableOpacity>
                
                <ButtonGradiend style={{flex : 1}} onPress={handleFinalSubmit}>
                    Finalizar
                </ButtonGradiend>
            </View>
        </ScrollView>
    );
}

export default function App() {
  const [form, setForm] = useState({ ticketDesign: null, mainBanner: null });
  
  return (
    <View style={styles.appContainer}>
      <Step3Content 
        form={form} 
        setForm={setForm} 
        onBack={() => Alert.alert("Atrás", "Volviendo al paso anterior...")}
        onSubmit={() => Alert.alert("Éxito", "Evento creado correctamente.")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: Colors.principal.white,
    },
    stepContent: {
        flex: 1,
    },
    simulatedTitle: {
      fontSize: Typography.sizes.xl,
      fontWeight: Typography.weights.extrabold,
      color: Colors.principal.green[900],
      marginBottom: 10,
    },
    stepSubtitleText: {
        fontSize: Typography.sizes.base,
        color: Colors.principal.neutral[700],
        marginBottom: 15,
        lineHeight: 22,
    },
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        color: Colors.principal.green[900],
    },
    uploadContainer: {
      width: '100%',
      height: 200,
      backgroundColor: Colors.principal.green[50],
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.principal.green[200],
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    uploadPlaceholder: {
      alignItems: 'center',
    },
    uploadTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.principal.green[900],
      marginTop: 8,
    },
    uploadSubtitle: {
      fontSize: 12,
      color: Colors.principal.green[900],
      opacity: 0.7,
    },
    uploadedImage: {
      width: '100%',
      height: '100%',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.principal.neutral[50],
        padding: 10,
        borderRadius: 8,
        marginTop: 15,
    },
    hintText: {
        fontSize: Typography.sizes.xs,
        color: Colors.principal.neutral[700],
        marginLeft: 8,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        gap : 5,
        marginTop: 40,
        marginBottom: 40,
        width : '100%'
    },
    simulatedGradientButton: {
      flex: 1,
      backgroundColor: Colors.principal.green[900],
      borderRadius: 12,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    simulatedGradientButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    backButton: {
        borderColor: Colors.principal.green[900],
        borderRadius: 25,
        width: 50,
        height: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});