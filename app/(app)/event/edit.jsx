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

import { Colors, Typography } from "../../../constants/theme";

import { useFetch } from "../../../lib/useFetch";

const GREEN_900 = Colors.principal.green[900];

const GREEN_500 = Colors.principal.green[500];

const RED_500 = Colors.principal.red[500];

const WHITE = "white";

const NEUTRAL_200 = Colors.principal.neutral[200];

const initialMockEvent = {
  id: 1,

  title: "Súper Rifa Anual por Fondos COSAI",

  description: "¡Participa en nuestra rifa más grande para apoyar la misión!",

  ticketPrice: 20.0,

  location: "Sede Central",

  date: "20/12/2025",

  urlImagen:
    "https://res.cloudinary.com/dabyqnijl/image/upload/v1764608015/WhatsApp_Image_2025-11-26_at_16.47.57_gjgygx.jpg",

  prizeValue: "15000",
};

const URL_EVENT_ID = ENDPOINTS_EVENTS.GET_EVENT_BY_ID_EVENT;

export default function EditEventPage() {
  const params = useLocalSearchParams();

  const eventId = params.id;

  const { data, loading } = useFetch(`${URL_EVENT_ID}${eventId}`);

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    ticketPrice: "",

    location: "",

    date: initialMockEvent.date,

    mainBanner: "",

    prizeValue: "",
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

  const handleSave = () => {
    if (!formData.title || !formData.ticketPrice || !formData.date) {
      Alert.alert("Error", "El título, precio y fecha son obligatorios.");

      return;
    }

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
          <Title>{formData.title}</Title>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <Text style={styles.inputLabel}>Título del Evento (*)</Text>

            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={(text) => updateForm("title", text)}
              placeholder="Ej: Rifa Navideña"
              placeholderTextColor={NEUTRAL_200}
              returnKeyType="next"
            />

            <Text style={styles.inputLabel}>Descripción</Text>

            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => updateForm("description", text)}
              placeholder="Breve descripción del evento"
              placeholderTextColor={NEUTRAL_200}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles y Fechas</Text>

            <Text style={styles.inputLabel}>Precio del Ticket (S/)</Text>

            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={formData?.ticketPrice.toString()}
              onChangeText={(text) =>
                updateForm("ticketPrice", text.replace(/[^0-9.]/g, ""))
              }
              placeholder="0.00"
              placeholderTextColor={NEUTRAL_200}
            />

            <DatePickerInput
              label="Fecha del Sorteo"
              value={formData.date}
              onDateChange={(date) => updateForm("date", date)}
            />

            <Text style={styles.inputLabel}>Lugar</Text>

            <TextInput
              style={styles.textInput}
              value={formData.place}
              onChangeText={(text) => updateForm("place", text)}
              placeholder="Ej: Sede Central"
              placeholderTextColor={NEUTRAL_200}
            />
          </View>

          {/* Imagen */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imagen Principal</Text>

            <ButtonUploadImage
              title="Actualizar Banner"
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

    backgroundColor: WHITE,
  },

  container: {
    flex: 1,

    paddingTop: 20,
  },

  scrollContent: {
    paddingBottom: 10,

    paddingHorizontal: 24,
  },

  loadingContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: WHITE,
  },

  loadingText: {
    fontSize: Typography.sizes.lg,

    color: GREEN_500,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: Typography.sizes.lg,

    fontWeight: Typography.weights.bold,

    color: RED_500,

    marginBottom: 10,
  },

  inputLabel: {
    fontSize: Typography.sizes.md,

    fontWeight: Typography.weights.medium,

    color: GREEN_900,

    marginBottom: 5,
  },

  textInput: {
    borderWidth: 1,

    borderColor: NEUTRAL_200,

    borderRadius: 12,

    padding: 14,

    fontSize: Typography.sizes.lg,

    color: GREEN_900,

    backgroundColor: WHITE,
  },

  textArea: {
    minHeight: 110,

    textAlignVertical: "top",
  },

  buttonContainer: {
    position: "absolute",

    bottom: 0,

    left: 24,

    right: 24,

    backgroundColor: "white",

    paddingVertical: 15,
  },
});
