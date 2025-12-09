import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ButtonGradiend from '../../components/common/Buttons/ButtonGradiendt';
import { Colors, Typography } from '../../constants/theme';
import { isValidDate } from '../../lib/validate';
import DataCardEvent from "../../mock/DataCardEvent.json";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_200 = Colors.principal.neutral[200];
const RED_600 = Colors.principal.red[600];

const initialMockEvent = {
    id: 1,
    title: 'Súper Rifa Anual por Fondos COSAI',
    description: '¡Participa en nuestra rifa más grande para apoyar la misión!',
    ticketPrice: 20.00,
    location: 'Sede Central',
    date: '20/12/2025',
    urlImagen: 'https://res.cloudinary.com/dabyqnijl/image/upload/v1764608015/WhatsApp_Image_2025-11-26_at_16.47.57_gjgygx.jpg',
    prizeValue: '15000',
};



export default function EditEventPage() {
    const params = useLocalSearchParams();
    const eventId = params.id; 
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ticketPrice: '',
        location: '',
        date: '',
        mainBanner: '', 
        prizeValue: '', 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dateError, setDateError] = useState(''); 

    useEffect(() => {
        const data = DataCardEvent;
        const loadedEvent = data?.find(item => parseInt(eventId) === item.id) || initialMockEvent;

        setFormData({
            title: loadedEvent.title || '',
            description: loadedEvent.description || '',
            ticketPrice: loadedEvent.ticketPrice ? loadedEvent.ticketPrice.toString() : '0.00',
            location: loadedEvent.location || '',
            date: loadedEvent.date || loadedEvent.createdAt || '', 
            mainBanner: loadedEvent.urlImagen || '',
            prizeValue: loadedEvent.prizeValue || '10000', 
        });
        setIsLoading(false);
    }, [eventId]);

    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleDateChange = (text) => {
        let cleanText = text.replace(/[^0-9]/g, '');

        let formattedText = '';
        if (cleanText.length > 0) {
            formattedText = cleanText.substring(0, 2);
        }
        if (cleanText.length >= 3) {
            formattedText += '/' + cleanText.substring(2, 4);
        }
        if (cleanText.length >= 5) {
            formattedText += '/' + cleanText.substring(4, 8);
        }

        formattedText = formattedText.substring(0, 10);

        updateForm('date', formattedText);

        if (formattedText.length === 10) {
            if (!isValidDate(formattedText)) {
                setDateError('Formato inválido (DD/MM/AAAA) o fecha no existe.');
            } else {
                setDateError('');
            }
        } else if (formattedText.length > 0 && formattedText.length < 10) {
             setDateError(''); 
        } else {
             setDateError(''); 
        }
    };
    
    const handleSave = () => {
        if (!formData.title || !formData.ticketPrice || !formData.date) {
            Alert.alert("Error de Validación", "El título, precio y fecha son campos obligatorios.");
            return;
        }
        if (dateError) {
             Alert.alert("Error de Validación", "Corrige el formato de la fecha antes de guardar.");
            return;
        }

        Alert.alert(
            "Evento Actualizado", 
            `El evento "${formData.title}" ha sido guardado exitosamente.`
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando evento...</Text>
            </View>
        );
    }


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.mainTitle}>Editar Evento: {formData.title}</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Básica</Text>
                
                <Text style={styles.inputLabel}>Título del Evento (*)</Text>
                <TextInput
                    style={styles.textInput}
                    value={formData.title}
                    onChangeText={(text) => updateForm('title', text)}
                    placeholderTextColor={NEUTRAL_200}
                />

                <Text style={styles.inputLabel}>Descripción del Evento</Text>
                <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => updateForm('description', text)}
                    placeholderTextColor={NEUTRAL_200}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles y Fechas</Text>

                <Text style={styles.inputLabel}>Precio Unitario del Ticket (S/)</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={formData.ticketPrice}
                    onChangeText={(text) => updateForm('ticketPrice', text.replace(/[^0-9.]/g, ''))}
                    placeholderTextColor={NEUTRAL_200}
                />
                
                <Text style={styles.inputLabel}>Valor Estimado del Premio (S/)</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={formData.prizeValue}
                    onChangeText={(text) => updateForm('prizeValue', text.replace(/[^0-9.]/g, ''))}
                    placeholderTextColor={NEUTRAL_200}
                />

                <Text style={styles.inputLabel}>Fecha de Cierre y Sorteo (DD/MM/AAAA) <Text style={{color : RED_600}}>(*)</Text> </Text>
                <TextInput
                    style={[styles.textInput, dateError && styles.textInputError]}
                    placeholder="Ej: 20/12/2025"
                    value={formData.date}
                    onChangeText={handleDateChange} 
                    keyboardType='numeric'
                    maxLength={10} 
                    placeholderTextColor={NEUTRAL_200}
                />
                {dateError ? (
                    <Text style={styles.errorText}>
                        <Ionicons name="alert-circle-outline" size={14} color={RED_500} /> {dateError}
                    </Text>
                ) : null}

                <Text style={styles.inputLabel}>Lugar del Sorteo o Evento</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ej: Online (Zoom), Parque Central"
                    value={formData.location}
                    onChangeText={(text) => updateForm('location', text)}
                    placeholderTextColor={NEUTRAL_200}
                />
            </View>

            <View style={styles.buttonContainer}>
                <ButtonGradiend onPress={handleSave}>
                    Guardar Cambios
                </ButtonGradiend>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    loadingText: {
        fontSize: Typography.sizes.lg,
        color: GREEN_500,
    },
    mainTitle: {
        fontSize: Typography.sizes['3xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginTop: 20,
        marginBottom: 30,
    },
    
    section: {
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
    },
    sectionTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: RED_500, 
        marginBottom: 15,
    },
    
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
        marginTop: 10,
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
    textInputError: { 
        borderColor: RED_500,
        backgroundColor: Colors.principal.red[50],
    },
    errorText: {
        fontSize: Typography.sizes.sm,
        color: RED_500,
        marginTop: 5,
        marginLeft: 5,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    
    buttonContainer: {
        marginTop: 30,
        marginBottom: 20,
    }
});