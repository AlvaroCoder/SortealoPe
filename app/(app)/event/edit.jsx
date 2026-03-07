import { useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerInput from "../../../components/common/Buttons/ButtonDatePicker";
import ButtonGradiend from "../../../components/common/Buttons/ButtonGradiendt";
import ButtonUploadImage from "../../../components/common/Buttons/ButtonUploadImage";
import Title from "../../../components/common/Titles/Title";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { UpdateEvent } from "../../../Connections/events";
import { Colors, Typography } from "../../../constants/theme";
import { useFetch } from "../../../lib/useFetch";
import { useUser } from "../../../lib/useUser";
import LoadingScreen from "../../../screens/LoadingScreen";

const URL_EVENT_ID = ENDPOINTS_EVENTS.GET_BY_ID;

export default function EditEventPage() {
  const params = useLocalSearchParams();
  const eventId = params.id;
  const { data, loading: loadingData } = useFetch(`${URL_EVENT_ID}${eventId}`);
  const [loading, setLoading] = useState(false);
  const { token } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ticketPrice: "",
    location: "",
    date: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(false);

      setFormData(data);
    }
  }, [data]);

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.ticketPrice || !formData.date) {
      Alert.alert("Error", "El título, precio y fecha son obligatorios.");

      return;
    }
    setLoading(true);
    const response = await UpdateEvent(formData, eventId, token);
    console.log(await response.json());
    setLoading(false);
    Alert.alert("Guardado", `El evento "${formData.title}" fue actualizado.`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando evento…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      {(loading || loadingData) && <LoadingScreen />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Title>{formData.title}</Title>
            <Text style={styles.headerSubtitle}>
              Personaliza los detalles del sorteo
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Título del Evento (*)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => updateForm("title", text)}
                placeholder="Ej: Rifa Navideña"
                placeholderTextColor={Colors.principal.neutral[200]}
                returnKeyType="next"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => updateForm("description", text)}
                placeholder="Breve descripción del evento"
                placeholderTextColor={Colors.principal.neutral[200]}
                multiline
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Detalles y Fechas</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Precio del Ticket (S/)</Text>
              <TextInput
                style={[styles.textInput, styles.priceInput]}
                keyboardType="numeric"
                value={formData?.ticketPrice?.toString()}
                onChangeText={(text) =>
                  updateForm("ticketPrice", text.replace(/[^0-9.]/g, ""))
                }
                placeholder="0.00"
                placeholderTextColor={Colors.principal.neutral[200]}
              />
            </View>

            <DatePickerInput
              label="Fecha del Sorteo"
              value={formData?.date ? new Date(formData.date) : new Date()}
              onChange={(date) => updateForm("date", date)}
            />

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Lugar</Text>
              <TextInput
                style={styles.textInput}
                value={formData.place}
                onChangeText={(text) => updateForm("place", text)}
                placeholder="Ej: Sede Central"
                placeholderTextColor={Colors.principal.neutral[200]}
              />
            </View>
          </View>

          {/* Imagen */}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Imagen Principal</Text>
            <ButtonUploadImage
              title="Subir Banner del Evento"
              image={formData?.image}
              onImageSelected={(uri) => updateForm("image", uri)}
            />
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ButtonGradiend onPress={handleSave}>Guardar Cambios</ButtonGradiend>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: "white",
    zIndex: 100,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  simulatedMainTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: "800",
    color: Colors.principal.green[900],
  },
  headerSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.principal.neutral[700],
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.principal.white,
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    color: Colors.principal.green[500],
    fontWeight: "600",
    marginTop: 10,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.principal.neutral[100],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.principal.red[500],
    marginBottom: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // --- Estilos de Inputs ---
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.principal.green[900],
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: Colors.principal.neutral[100],
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: Colors.principal.green[900],
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  priceInput: {
    fontWeight: "bold",
    color: Colors.principal.green[500],
  },
  simulatedPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.principal.neutral[100],
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F8FAFC",
  },
  // --- ButtonUploadImage Rediseñado ---
  customUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.principal.white,
    borderWidth: 2,
    borderColor: Colors.principal.neutral[200],
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
  },
  customUploadButtonActive: {
    borderColor: Colors.principal.green[500],
    backgroundColor: Colors.principal.green[50],
    borderStyle: "solid",
  },
  uploadIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.principal.neutral[700],
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: Colors.principal.neutral[700],
    opacity: 0.7,
  },
  imageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.principal.green[500],
    position: "absolute",
    top: 10,
    right: 10,
  },
  // --- Footer ---
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.principal.white,
    borderTopWidth: 1,
    borderTopColor: Colors.principal.neutral[100],
  },
  simulatedGradient: {
    backgroundColor: Colors.principal.green[900],
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 5,
    shadowColor: Colors.principal.green[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  simulatedGradientText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
