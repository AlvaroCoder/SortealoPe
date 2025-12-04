import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";
import ButtonGradiend from "../common/Buttons/ButtonGradiendt";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const WHITE = Colors.principal.white;

export default function Step2Content({ form, setForm, onNext, onBack }) {
  
  const handleNext = () => {
    if (!form.title || !form.description || !form.location || !form.date) {
        Alert.alert("Error", "Por favor, completa todos los campos del evento.");
        return;
    }
    onNext({}); 
  };

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.stepContent}>
            <Text style={styles.stepTitleText}>2. Detalles del Evento y Premio</Text>
            <Text style={styles.stepSubtitleText}>
                Define la información clave que aparecerá visiblemente en la rifa y en el ticket.
            </Text>
            
            <Text style={styles.inputLabel}>Título de la Rifa/Evento</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Ej: Súper Rifa Navideña 2025"
                value={form.title}
                onChangeText={(text) => updateForm('title', text)}
                placeholderTextColor={NEUTRAL_200}
            />

            <Text style={styles.inputLabel}>Descripción del Evento y Premio Principal</Text>
            <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe el gran premio y el objetivo de la rifa..."
                value={form.description}
                onChangeText={(text) => updateForm('description', text)}
                placeholderTextColor={NEUTRAL_200}
                multiline
                numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Lugar del Sorteo o Evento</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Ej: Online (Zoom), Parque Central"
                value={form.location}
                onChangeText={(text) => updateForm('location', text)}
                placeholderTextColor={NEUTRAL_200}
            />
            
            <Text style={styles.inputLabel}>Fecha de Cierre y Sorteo (DD/MM/AAAA)</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Ej: 20/12/2025"
                value={form.date}
                onChangeText={(text) => updateForm('date', text)}
                placeholderTextColor={NEUTRAL_200}
            />
            
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  stepContent: {
    width: "100%",
  },
  stepTitleText: {
    fontSize: Typography.sizes["2xl"],
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
  textInput: {
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderRadius: 12,
    padding: 15,
    color: GREEN_900,
    backgroundColor: WHITE,
  },
  textArea: {
      minHeight: 100,
      textAlignVertical: 'top', 
      paddingTop: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
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