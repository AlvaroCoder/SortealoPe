import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import Step1Content from "../../../components/steps/Step1Content";
import Step2Content from "../../../components/steps/Step2Content";
import Step3Content from "../../../components/steps/Step3Content";
import Step3CategoryContent from "../../../components/steps/Step3ContentCategory";
import StepperHeader from "../../../components/steps/StepperHeader";
import { CreateEvent } from "../../../Connections/events";
import { UploadImage } from "../../../Connections/images";
import { Colors, Typography } from "../../../constants/theme";
import { formatterDateToISO } from "../../../lib/dateFormatter";
import { useUser } from "../../../lib/useUser";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

const STEPS = [
  { id: 1, title: "Paquete de Tickets", icon: "pricetags-outline" },
  { id: 2, title: "Detalles del Premio", icon: "gift-outline" },
  { id: 3, title: "Categoría del Evento", icon: "albums-outline" },
  { id: 4, title: "Diseño y Archivos", icon: "image-outline" },
];

export default function CreateEventStepper() {
  const { userData } = useUser();
  const { title: initialTitle = "", description: initialDescription = "" } =
    useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    date: "",
    place: "",
    collectionsQuantity: 1,
    ticketsPerCollection: 0,
    packId: 1,
    hostId: 1,
    image: "",
    eventCategoryId: "",
    status: 1,
  });

  const handleNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  };

  const handleBack = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      Alert.alert(
        "Imagen requerida",
        "Debes subir una imagen de banner para el evento.",
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Subir imagen primero
      const multipart = new FormData();
      multipart.append("file", formData.image); // { uri, type, name }

      const uploadRes = await UploadImage(multipart);
      if (!uploadRes.ok) {
        Alert.alert("Error", "No se pudo subir la imagen. Inténtalo de nuevo.");
        return;
      }

      const uploadJson = await uploadRes.json();
      const imageUrl = uploadJson?.url;

      console.log("Respuesta imagen : ", imageUrl);

      if (!imageUrl) {
        Alert.alert("Error", "No se recibió la URL de la imagen subida.");
        return;
      }

      // 2. Construir payload con tipos correctos
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formatterDateToISO(formData.date),
        place: formData.place,
        ticketsPerCollection: Number(formData.ticketsPerCollection),
        collectionsQuantity: 1, // siempre 1
        ticketPrice: parseFloat(formData.ticketPrice),
        packId: Number(formData.packId),
        image: imageUrl,
        hostId: userData?.userId,
        eventCategoryId: Number(formData.eventCategoryId),
        status: 1, // siempre 1
      };

      console.log("Datos enviados : ", payload);

      // 3. Crear evento
      const response = await CreateEvent(payload);

      if (response.ok) {
        Alert.alert(
          "Evento creado",
          "Tu evento fue enviado y está pendiente de aprobación.",
          [{ text: "OK", onPress: () => router.replace("/(app)/(drawer)") }],
        );
      } else {
        const errJson = await response.json().catch(() => null);
        Alert.alert(
          "Error",
          errJson?.message || "No se pudo crear el evento. Inténtalo de nuevo.",
        );
      }
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Content
            form={formData}
            setForm={setFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2Content
            form={formData}
            setForm={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3CategoryContent
            form={formData}
            setForm={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step3Content
            form={formData}
            setForm={setFormData}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return (
          <Step1Content
            form={formData}
            setForm={setFormData}
            onNext={handleNext}
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      {loading && <LoadingScreen />}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <StepperHeader currentStep={currentStep} />

        <View style={styles.contentWrapper}>{renderContent()}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {},
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: Typography.sizes.base,
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
    fontSize: Typography.sizes.lg,
    color: GREEN_900,
    backgroundColor: WHITE,
  },
  metricBox: {
    backgroundColor: GREEN_100,
    borderRadius: 12,
    padding: 20,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: GREEN_500,
  },
  metricValue: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: RED_500,
  },
  metricIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    opacity: 0.1,
  },

  // --- BOTONES DE ACCIÓN ---
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  placeholderText: {
    textAlign: "center",
    paddingVertical: 50,
    backgroundColor: NEUTRAL_200,
    borderRadius: 12,
    marginTop: 20,
    color: NEUTRAL_700,
    fontStyle: "italic",
  },
});
