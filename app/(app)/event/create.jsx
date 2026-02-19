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

import { useRouter } from "expo-router";
import Step1Content from "../../../components/steps/Step1Content";
import Step2Content from "../../../components/steps/Step2Content";
import Step3Content from "../../../components/steps/Step3Content";
import Step3CategoryContent from "../../../components/steps/Step3ContentCategory";
import StepperHeader from "../../../components/steps/StepperHeader";
import { CreateEvent, UploadImage } from "../../../Connections/events";
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
  const { userData, token } = useUser();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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
    setLoading(true);
    const newDataFormData = {
      ...formData,
      hostId: userData?.userId || null,
      date: formData.date ? formatterDateToISO(formData.date) : null,
    };

    console.log("Formulario de enviar ", newDataFormData);
    try {
      // Primero subir la imagen a Cloudinary y obtener la URL
      if (formData?.image) {
        console.log(formData?.image);

        const responseUpload = await UploadImage(formData.image, token);
        const responseJSON = await responseUpload.json();

        const imageUrl = responseJSON?.url;
        console.log("Imagen ", imageUrl);

        newDataFormData.image = imageUrl || "";
      }

      console.log("Data antes de enviar ", newDataFormData);

      const response = await CreateEvent(newDataFormData, token);
      console.log(response);

      if (response.ok) {
        Alert.alert(
          "Evento Creado",
          `El evento ha sido creado con los datos del formulario. `,
        );

        router.push("/(app)/(drawer)");
      } else {
        Alert.alert("Error ", `El evento no se creo`);
      }
    } catch (error) {
      console.error("Error al crear el evento:", error);
      Alert.alert("Error", "No se pudo crear el evento. Inténtalo de nuevo.");
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
