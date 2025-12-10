import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import Title from '../common/Titles/Title';

const GREEN_900 = Colors.principal.green[900];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const RED_500 = Colors.principal.red[500]; 
const RED_600 = Colors.principal.red[600];

const isValidDate = (dateString) => {
    if (dateString.length !== 10) return false;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
};

export default function Step2Content({ form, setForm, onNext, onBack }) {
    const [validationErrors, setValidationErrors] = useState({});

    const updateForm = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const setError = (key, message) => {
        setValidationErrors(prev => ({ ...prev, [key]: message }));
    };

    const handleDateChange = (text) => {
        let cleanText = text.replace(/[^0-9]/g, '');
        let formattedText = '';
        if (cleanText.length > 0) formattedText = cleanText.substring(0, 2);
        if (cleanText.length >= 3) formattedText += '/' + cleanText.substring(2, 4);
        if (cleanText.length >= 5) formattedText += '/' + cleanText.substring(4, 8);
        formattedText = formattedText.substring(0, 10);

        updateForm('date', formattedText);

        if (formattedText.length === 10) {
            if (!isValidDate(formattedText)) {
                setError('date', 'Formato inválido (DD/MM/AAAA) o fecha no existe.');
            } else {
                setError('date', ''); 
            }
        } else if (formattedText.length > 0 && formattedText.length < 10) {
             setError('date', '');
        } else if (formattedText.length === 0) {
            setError('date', ''); 
        }
    };
    
    const handlePriceChange = (text) => {
        const value = text.replace(/[^0-9.]/g, '');
        updateForm('ticketPrice', value);

        if (value && parseFloat(value) <= 0) {
            setError('ticketPrice', 'El precio debe ser mayor a cero.');
        } else {
            setError('ticketPrice', '');
        }
    };

    const handleIntegerChange = (key, text) => {
        const value = text.replace(/[^0-9]/g, '');
        updateForm(key, value);

        if (value && parseInt(value) <= 0) {
            setError(key, 'La cantidad debe ser mayor a cero.');
        } else {
            setError(key, '');
        }
    };


    const handleNext = () => {
        const errors = {};
        let hasErrors = false;
        
        if (!form.title) errors.title = "El título es obligatorio.";
        if (!form.description) errors.description = "La descripción es obligatoria.";
        if (!form.place) errors.place = "El lugar es obligatorio.";
        
        if (!form.ticketPrice || parseFloat(form.ticketPrice) <= 0) errors.ticketPrice = "Ingresa un precio válido (> 0).";
        if (!form.ticketsPerCollection || parseInt(form.ticketsPerCollection) <= 0) errors.ticketsPerCollection = "Ingresa una cantidad válida (> 0).";
        
        if (!form.date) {
            errors.date = "La fecha es obligatoria.";
        } else if (!isValidDate(form.date)) {
            errors.date = "Formato de fecha inválido (DD/MM/AAAA).";
        }
        
        setValidationErrors(errors);
        hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
            Alert.alert("Error de Validación", "Por favor, corrige los errores en el formulario.");
            return;
        }

        onNext({});
    };

    const ErrorMessage = ({ error }) => {
        if (!error) return null;
        return (
            <Text style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color={RED_500} /> {error}
            </Text>
        );
    };

    const isInputInvalid = (key) => !!validationErrors[key];
    const getTextInputStyle = (key) => [styles.textInput, isInputInvalid(key) && styles.textInputError];


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.stepContent}>
            <Title styleTitle={styles.stepTitleText}>2. Ingresar datos del evento</Title>
            <Text style={styles.stepSubtitleText}>
                Ingresa los detalles clave de tu evento para que los compradores puedan identificarlo.
            </Text>

            <Text style={styles.sectionTitle}>Información básica</Text>

            <Text style={styles.inputLabel}>Título del evento <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={getTextInputStyle('title')}
                placeholder='Ej: Rifa Viaje a Cancún'
                value={ form.title }
                onChangeText={(text) => updateForm('title', text)}
                placeholderTextColor={NEUTRAL_200}
            />
            <ErrorMessage error={validationErrors.title} />

            <Text style={styles.inputLabel}>Descripción del evento <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={[getTextInputStyle('description'), styles.textArea]}
                placeholder='Ingresa la descripción y el premio principal'
                value={ form.description }
                onChangeText={(text) => updateForm('description', text)}
                placeholderTextColor={NEUTRAL_200}
                multiline
                numberOfLines={4}
            />
            <ErrorMessage error={validationErrors.description} />


            <Text style={[styles.sectionTitle, {marginTop: 20}]}>Detalles y fechas</Text>
            
            <Text style={styles.inputLabel}>Precio Unitario del Ticket (S/.) <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={getTextInputStyle('ticketPrice')}
                keyboardType='numeric'
                placeholder='00.00'
                value={ form.ticketPrice}
                onChangeText={handlePriceChange} 
                placeholderTextColor={NEUTRAL_200}
            />
            <ErrorMessage error={validationErrors.ticketPrice} />

            <Text style={styles.inputLabel}>Cantidad de Tickets por Vendedor <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={getTextInputStyle('ticketsPerCollection')}
                keyboardType='numeric'
                placeholder='Total de tickets a generar'
                value={form?.ticketsPerCollection}
                onChangeText={(text) => handleIntegerChange('ticketsPerCollection', text)} 
                placeholderTextColor={NEUTRAL_200}
            />
            <ErrorMessage error={validationErrors.ticketsPerCollection} />


            <Text style={styles.inputLabel}>Lugar del evento <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={getTextInputStyle('place')}
                placeholder='Ej: Sede Central / Zoom'
                value={form?.place}
                onChangeText={(text) => updateForm('place', text)}
                placeholderTextColor={NEUTRAL_200}
            />
            <ErrorMessage error={validationErrors.place} />
            
            <Text style={styles.inputLabel}>Fecha de Cierre del Sorteo (DD/MM/AAAA) <Text style={{color : RED_600}}>(*)</Text></Text>
            <TextInput
                style={getTextInputStyle('date')}
                placeholder='DD/MM/AAAA'
                value={form?.date}
                onChangeText={handleDateChange}
                keyboardType='numeric'
                maxLength={10}
                placeholderTextColor={NEUTRAL_200}
            />
            <ErrorMessage error={validationErrors.date} />

              <View style={styles.actionRow}>
                   <TouchableOpacity onPress={onBack} style={styles.backButton}>
                       <Ionicons name="arrow-back-outline" style={{color : GREEN_900}} size={24} />
                   </TouchableOpacity>
                <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
                    Continuar
                </ButtonGradiend>
            </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    stepContent: {
        width: "100%",
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
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        marginBottom: 10,
        color : Colors.principal.blue[800]
    },
    
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        marginTop: 15,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        borderRadius: 12,
        padding: 15,
        fontSize: Typography.sizes.lg,
        backgroundColor: WHITE,
    },
    textInputError: {
        borderColor: RED_500, 
        borderWidth: 2,
    },
    errorText: {
        fontSize: Typography.sizes.sm,
        color: RED_500,
        marginTop: 4,
        marginLeft: 5,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom:  40,
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