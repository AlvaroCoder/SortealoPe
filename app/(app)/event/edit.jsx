import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { UpdateEvent } from "../../../Connections/events";
import { Colors, Typography } from "../../../constants/theme";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_50 = Colors.principal.neutral[50];
const WHITE = "#FFFFFF";

const URL_EVENT_ID = ENDPOINTS_EVENTS.GET_BY_ID;

export default function EditEventPage() {
  const params = useLocalSearchParams();
  const eventId = params.id;
  const { data, loading: loadingData } = useFetch(
    `${URL_EVENT_ID}${eventId}?eventStatus=2`,
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ticketPrice: "",
    location: "",
    date: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Snapshot of the data as it arrived from the API — used to compute the diff
  const originalData = useRef(null);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setFormData(data);
      originalData.current = data;
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

    // Only diff against the fields the form can actually edit — prevents
    // sending backend-owned fields (id, status, collections, etc.)
    const EDITABLE_FIELDS = [
      "title",
      "description",
      "ticketPrice",
      "date",
      "place",
      "image",
    ];
    const original = originalData.current ?? {};
    const changedFields = {};

    for (const key of EDITABLE_FIELDS) {
      const prev = original[key];
      const next = formData[key];

      if (key === "date") {
        // Compare by timestamp to avoid ISO format mismatches ("2025-01-01T00:00:00" vs Date object)
        const prevTime = prev ? new Date(prev).getTime() : null;
        const nextTime = next ? new Date(next).getTime() : null;
        if (prevTime !== nextTime) {
          changedFields[key] = next instanceof Date ? next.toISOString() : next;
        }
      } else {
        const prevStr = String(prev ?? "");
        const nextStr = String(next ?? "");
        if (prevStr !== nextStr) {
          // ticketPrice must be a number, not a string
          changedFields[key] = key === "ticketPrice" ? parseFloat(next) : next;
        }
      }
    }

    if (Object.keys(changedFields).length === 0) {
      Alert.alert("Sin cambios", "No has modificado ningún campo.");
      return;
    }

    setLoading(true);
    // UpdateEvent(eventId, data) — note: eventId is first, data second
    const response = await UpdateEvent(eventId, changedFields);

    if (!response.ok) {
      setLoading(false);
      Alert.alert("Error", "No se pudo guardar el evento.");
      return;
    }

    setLoading(false);
    router.push("/(drawer)/home/(tab)");
    Alert.alert("Guardado", `El evento "${formData.title}" fue actualizado.`);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      {(loading || loadingData) && <LoadingScreen />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View style={styles.header}>
            <Text style={styles.mainTitle} numberOfLines={2}>
              {formData.title}
            </Text>
            <Text style={styles.headerSubtitle}>
              Edita los detalles del evento
            </Text>
          </View>

          {/* Información Básica */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Título del Evento (*)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => updateForm("title", text)}
                placeholder="Ej: Rifa Navideña"
                placeholderTextColor={NEUTRAL_200}
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
                placeholderTextColor={NEUTRAL_200}
                multiline
              />
            </View>
          </View>

          {/* Detalles y Fechas */}
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
                placeholderTextColor={NEUTRAL_200}
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
                placeholderTextColor={NEUTRAL_200}
              />
            </View>
          </View>

          {/* Imagen Principal */}
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
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },

  // Section cards
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16,
  },

  // Inputs
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.sizes.base,
    color: "#111111",
    backgroundColor: NEUTRAL_50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  priceInput: {
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // Bottom button bar
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
  },
});
