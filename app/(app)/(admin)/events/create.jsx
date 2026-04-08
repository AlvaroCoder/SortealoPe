import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Step1Content from "../../../../components/steps/Step1Content";
import Step2Content from "../../../../components/steps/Step2Content";
import Step3Content from "../../../../components/steps/Step3Content";
import Step3CategoryContent from "../../../../components/steps/Step3ContentCategory";
import { CreateEvent } from "../../../../Connections/events";
import { UploadImage } from "../../../../Connections/images";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { formatterDateToISO } from "../../../../lib/dateFormatter";
import { useUser } from "../../../../lib/useUser";
import LoadingScreen from "../../../../screens/LoadingScreen";
// ── Color tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

const TOTAL_STEPS = 4;

// ── Per-step metadata (title, description, tip card) ─────────────────────────
const STEP_META = [
  {
    title: "Paquete de\nTickets",
    description:
      "Elige el paquete que mejor se adapte a las necesidades de tu evento y tu audiencia.",
    tip: {
      headline:
        "Los eventos con más de 500 tickets generan mayor visibilidad y un 30% más de participantes recurrentes.",
      pro: "Elige un paquete acorde al tamaño de tu audiencia.",
    },
  },
  {
    title: "Detalles del\nSorteo",
    description:
      "Define la identidad de tu evento para que tus participantes sepan exactamente qué pueden ganar.",
    tip: {
      headline:
        "Los sorteos con descripciones detalladas y una ubicación clara generan un 45% más de confianza en los participantes.",
      pro: "Usa nombres cortos y pegajosos.",
    },
  },
  {
    title: "Categoría\ndel Evento",
    description:
      "Clasifica tu evento para que aparezca en las búsquedas correctas y llegue a más personas.",
    tip: {
      headline:
        "Los eventos bien categorizados reciben hasta un 60% más de visitas orgánicas desde la plataforma.",
      pro: "Sé específico con la categoría para mayor alcance.",
    },
  },
  {
    title: "Diseño\ny Archivos",
    description:
      "Una imagen atractiva puede aumentar la tasa de participación de tu evento hasta en un 3x.",
    tip: {
      headline:
        "Los eventos con imágenes de alta calidad generan mayor confianza y participación inmediata.",
      pro: "Usa imágenes de 1920×1080 px para mejor calidad.",
    },
  },
];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AdminCreateEvent() {
  const router = useRouter();
  const { userData } = useAuthContext();
  const { userData: userDataRaw } = useUser(); // needed for userId in payload
  const { title: initialTitle = "", description: initialDescription = "" } =
    useLocalSearchParams();

  const [loading, setLoading] = useState(false);
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

  // ── Header display info ──────────────────────────────────────────────────
  const firstName = userData?.sub?.split("@")[0] ?? "Admin";
  const avatarUri = userData?.photo ?? null;

  const meta = STEP_META[currentStep - 1];

  // ── Step navigation ──────────────────────────────────────────────────────
  const handleNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  };

  const handleBack = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
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
      let imageUrl;
      if (typeof formData.image === "string") {
        imageUrl = formData.image;
      } else {
        const multipart = new FormData();
        multipart.append("file", formData.image);
        const uploadRes = await UploadImage(multipart);
        if (!uploadRes.ok) {
          Alert.alert(
            "Error",
            "No se pudo subir la imagen. Inténtalo de nuevo.",
          );
          setLoading(false);
          return;
        }
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson?.url;
        if (!imageUrl) {
          Alert.alert("Error", "No se recibió la URL de la imagen subida.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formatterDateToISO(formData.date),
        place: formData.place,
        ticketsPerCollection: Number(formData.ticketsPerCollection),
        collectionsQuantity: 1,
        ticketPrice: parseFloat(formData.ticketPrice),
        packId: Number(formData.packId),
        image: imageUrl,
        hostId: userDataRaw?.userId ?? userData?.userId,
        eventCategoryId: Number(formData.eventCategoryId),
        status: 1,
      };

      const response = await CreateEvent(payload);
      if (response.ok) {
        router.replace("/(app)/(admin)/events/success");
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

  // ── Step content switch ──────────────────────────────────────────────────
  const renderStepContent = () => {
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

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {loading && <LoadingScreen />}

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {firstName[0]?.toUpperCase() ?? "A"}
              </Text>
            </View>
          )}
          <Text style={styles.brandText}>Sortealo</Text>
        </View>
        <TouchableOpacity
          style={styles.adminBadge}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Step label ────────────────────────────────────────────── */}
          <Text style={styles.stepLabel}>
            PASO {String(currentStep).padStart(2, "0")} DE{" "}
            {String(TOTAL_STEPS).padStart(2, "0")}
          </Text>

          {/* ── Title + progress dashes ───────────────────────────────── */}
          <View style={styles.titleRow}>
            <Text style={styles.stepTitle}>{meta.title}</Text>
            <View style={styles.progressDashes}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const isDone = i < currentStep - 1;
                const isActive = i === currentStep - 1;
                return (
                  <View
                    key={i}
                    style={[
                      styles.dash,
                      isDone && styles.dashDone,
                      isActive && styles.dashActive,
                      !isDone && !isActive && styles.dashPending,
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* ── Step description ─────────────────────────────────────── */}
          <Text style={styles.stepDescription}>{meta.description}</Text>

          {/* ── Step content (existing Step components) ───────────────── */}
          <View style={styles.stepContent}>{renderStepContent()}</View>

          {/* ── Tip card "¿Sabías que?" ───────────────────────────────── */}
          <View style={styles.tipCard}>
            {/* Decorative ticket */}
            <Ionicons
              name="ticket-outline"
              size={90}
              color="rgba(255,255,255,0.06)"
              style={styles.tipDecorIcon}
            />

            <Text style={styles.tipHeadline}>¿Sabías que?</Text>
            <Text style={styles.tipBody}>{meta.tip.headline}</Text>

            <View style={styles.tipProRow}>
              <View style={styles.tipProIconWrap}>
                <Ionicons name="bulb-outline" size={20} color={GREEN_900} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipProLabel}>TIP PRO</Text>
                <Text style={styles.tipProText}>{meta.tip.pro}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },

  // ── Header bar ─────────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: GREEN_900,
  },
  adminBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: GREEN_900,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: 0.5,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // ── Step label ─────────────────────────────────────────────────────────────
  stepLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN_500,
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  // ── Title row ──────────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: GREEN_900,
    lineHeight: 36,
    flex: 1,
  },
  progressDashes: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingTop: 8,
  },
  dash: {
    height: 5,
    width: 26,
    borderRadius: 3,
  },
  dashDone: {
    backgroundColor: GREEN_900,
  },
  dashActive: {
    backgroundColor: GREEN_500,
  },
  dashPending: {
    backgroundColor: NEUTRAL_200,
  },

  // ── Step description ───────────────────────────────────────────────────────
  stepDescription: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    lineHeight: 21,
    marginBottom: 24,
  },

  // ── Step content wrapper ───────────────────────────────────────────────────

  // ── Tip card ───────────────────────────────────────────────────────────────
  tipCard: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    gap: 0,
    marginBottom: Constants.statusBarHeight,
  },
  tipDecorIcon: {
    position: "absolute",
    bottom: -15,
    right: 4,
    transform: [{ rotate: "15deg" }],
  },
  tipHeadline: {
    fontSize: 18,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 8,
  },
  tipBody: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 21,
    marginBottom: 16,
  },
  tipProRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
  },
  tipProIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipProLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.60)",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  tipProText: {
    fontSize: 13,
    fontWeight: "600",
    color: WHITE,
    lineHeight: 18,
  },
});
