import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonGradiend from "../../../components/common/Buttons/ButtonGradiendt";
import { ENDPOINTS_USERS } from "../../../Connections/APIURLS";
import { UpdateUser } from "../../../Connections/users";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_700 = Colors.principal.green[700];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

const EDITABLE_FIELDS = ["firstName", "lastName", "phone", "address"];
const PROFILE_FIELDS = ["firstName", "lastName", "phone", "address"];

const SUCCESS_DISPLAY_MS = 3200;

// ── Congratulations screen ────────────────────────────────────────────────────
function SuccessScreen({ firstName, onDone }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onDone, SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[GREEN_900, GREEN_500, WHITE]}
      locations={[0, 0.52, 1]}
      style={styles.successContainer}
    >
      <Animated.View
        style={[
          styles.successContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.checkCircle}>
          <Ionicons name="person-done-outline" size={48} color={GREEN_900} />
        </View>

        <Text style={styles.successGreeting}>
          ¡Hola, {firstName || "Usuario"}!
        </Text>
        <Text style={styles.successTitle}>Perfil completado</Text>
        <Text style={styles.successSubtitle}>
          Tu información ha sido guardada.{"\n"}
          Ya puedes disfrutar de Sortealo al máximo.
        </Text>

        {/* Completion badge */}
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={GREEN_700} />
          <Text style={styles.completedBadgeText}>100% completado</Text>
        </View>

        <Text style={styles.successHint}>Volviendo a inicio…</Text>
      </Animated.View>
    </LinearGradient>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function CompleteProfilePage() {
  const router = useRouter();
  const { userData: authData } = useAuthContext();

  const userId = authData?.userId;

  const { data, loading: loadingData } = useFetch(
    userId ? `${ENDPOINTS_USERS.GET_BY_ID}${userId}` : null,
  );

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const originalData = useRef(null);

  useEffect(() => {
    if (data) {
      const prefilled = {
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phone: data.phone ?? "",
      };
      setFormData(prefilled);
      originalData.current = prefilled;
    }
  }, [data]);

  const updateForm = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const filledCount = PROFILE_FIELDS.filter((k) =>
    formData[k]?.toString().trim(),
  ).length;
  const progress = filledCount / PROFILE_FIELDS.length;

  const handleSave = async () => {
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      Alert.alert(
        "Campos requeridos",
        "El nombre y apellido son obligatorios.",
      );
      return;
    }

    const original = originalData.current ?? {};
    const changedFields = {};
    for (const key of EDITABLE_FIELDS) {
      const prevStr = String(original[key] ?? "");
      const nextStr = String(formData[key] ?? "");
      if (prevStr !== nextStr) changedFields[key] = formData[key];
    }

    if (Object.keys(changedFields).length === 0) {
      Alert.alert("Sin cambios", "No has modificado ningún campo.");
      return;
    }
    console.log("Campos modificados : ", changedFields);

    setLoading(true);
    const response = await UpdateUser(changedFields);

    if (!response.ok) {
      setLoading(false);
      Alert.alert("Error", "No se pudo guardar el perfil. Intenta de nuevo.");
      return;
    }

    setLoading(false);
    setShowSuccess(true);
  };

  // Show congratulations screen
  if (showSuccess) {
    return (
      <SuccessScreen
        firstName={formData.firstName}
        onDone={() => router.back()}
      />
    );
  }

  if (loadingData && !data) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {loading && <LoadingScreen />}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Campos completados</Text>
              <Text style={styles.progressCount}>
                {filledCount} / {PROFILE_FIELDS.length}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>

          {/* Información Personal */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="person-outline" size={16} color={GREEN_900} />
              </View>
              <Text style={styles.sectionTitle}>Información Personal</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Nombre <Text style={styles.inputRequired}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.firstName}
                onChangeText={(t) => updateForm("firstName", t)}
                placeholder="Tu nombre"
                placeholderTextColor={NEUTRAL_500}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Apellido <Text style={styles.inputRequired}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.lastName}
                onChangeText={(t) => updateForm("lastName", t)}
                placeholder="Tu apellido"
                placeholderTextColor={NEUTRAL_500}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Contacto */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="call-outline" size={16} color={GREEN_900} />
              </View>
              <Text style={styles.sectionTitle}>Contacto</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(t) => updateForm("phone", t)}
                placeholder="Ej: 987654321"
                placeholderTextColor={NEUTRAL_500}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ButtonGradiend onPress={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar perfil"}
          </ButtonGradiend>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Form ───────────────────────────────────────────────────────────────
  safeArea: { flex: 1, backgroundColor: WHITE },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

  progressSection: { marginBottom: 24 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },
  progressCount: {
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    fontWeight: Typography.weights.bold,
  },
  progressTrack: {
    height: 6,
    backgroundColor: NEUTRAL_200,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: GREEN_900, borderRadius: 3 },

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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  inputWrapper: { marginBottom: 14 },
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
  inputRequired: { color: Colors.principal.red[500] },

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

  // ── Success screen ──────────────────────────────────────────────────────
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successContent: {
    alignItems: "center",
    width: "100%",
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  successGreeting: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: WHITE,
    opacity: 0.85,
    marginBottom: 6,
  },
  successTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 12,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: Typography.sizes.base,
    color: WHITE,
    opacity: 0.88,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  completedBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_700,
  },
  successHint: {
    fontSize: Typography.sizes.sm,
    color: WHITE,
    opacity: 0.6,
  },
});
