import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Typography } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import LoadingScreen from "../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_300 = Colors.principal.neutral[300];
const NEUTRAL_600 = Colors.principal.neutral[600];
const BLUE_600 = Colors.principal.blue[600];
const WHITE = "#FFFFFF";

const DIGITS = 6;
const INITIAL_TIME = 15 * 60;
const SUCCESS_DISPLAY_MS = 3000;

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ email, onDone }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate icon in
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after SUCCESS_DISPLAY_MS
    const timer = setTimeout(onDone, SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[GREEN_900, GREEN_500, WHITE]}
      locations={[0, 0.55, 1]}
      style={styles.successContainer}
    >
      <Animated.View
        style={[
          styles.successContent,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Checkmark circle */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={52} color={GREEN_900} />
        </View>

        <Text style={styles.successTitle}>¡Felicitaciones!</Text>
        <Text style={styles.successSubtitle}>
          Tu cuenta ha sido verificada exitosamente.
        </Text>

        {/* Email chip */}
        <View style={styles.emailChip}>
          <Ionicons name="mail-outline" size={14} color={GREEN_700} />
          <Text style={styles.emailChipText} numberOfLines={1}>
            {email}
          </Text>
        </View>

        <Text style={styles.successHint}>
          Redirigiendo al inicio de sesión…
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ValidateCode() {
  const { userData, validateCode, resendCode, loading } = useAuthContext();
  const router = useRouter();

  const [code, setCode] = useState(Array(DIGITS).fill(""));
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < DIGITS - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleValidate = async () => {
    const fullCode = code.join("");
    const result = await validateCode(userData?.email, fullCode);
    if (result?.error) {
      return Alert.alert("Error", result.error);
    }
    setShowSuccess(true);
  };

  const handleResend = async () => {
    const result = await resendCode(userData?.email);
    if (result?.error) {
      return Alert.alert("Error", "No se pudo reenviar el código. Intenta de nuevo.");
    }
    setCode(Array(DIGITS).fill(""));
    setTimeLeft(INITIAL_TIME);
    setCanResend(false);
    inputsRef.current[0]?.focus();
    Alert.alert("Código reenviado", "Revisa tu correo electrónico.");
  };

  const isComplete = code.every((digit) => digit !== "");

  if (showSuccess) {
    return (
      <SuccessScreen
        email={userData?.email}
        onDone={() => router.replace("/(auth)/login")}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {loading && <LoadingScreen />}
      <View style={styles.content}>
        <Text style={styles.title}>Validar Código</Text>
        <Text style={styles.subTitle}>
          Ingresa el código que enviamos a tu correo 📩
        </Text>
        <Text style={styles.emailText}>{userData?.email}</Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputsRef.current[index] = ref)}
              style={[styles.input, digit && styles.inputFilled]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoCorrect={false}
              autoCapitalize="none"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {canResend ? "00:00" : formatTime(timeLeft)}
        </Text>

        <TouchableOpacity
          style={[styles.button, !isComplete && styles.buttonDisabled]}
          onPress={handleValidate}
          disabled={!isComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Validar Correo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={canResend ? handleResend : null}
          disabled={!canResend}
        >
          <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
            Reenviar código
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ── Validate form ────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.principal.green[800],
    marginBottom: 10,
  },
  subTitle: {
    textAlign: "center",
    fontSize: Typography.sizes.base,
    color: NEUTRAL_600,
    marginBottom: 8,
  },
  emailText: {
    fontWeight: Typography.weights.bold,
    marginBottom: 25,
  },
  codeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  input: {
    width: 50,
    height: 55,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: Typography.sizes["2xl"],
    color: GREEN_900,
    borderColor: NEUTRAL_300,
    backgroundColor: WHITE,
  },
  inputFilled: {
    borderColor: GREEN_500,
  },
  timerText: {
    fontSize: 16,
    fontWeight: Typography.weights.medium,
    color: GREEN_700,
    marginBottom: 25,
  },
  button: {
    width: "100%",
    backgroundColor: GREEN_700,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: WHITE,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  resendText: {
    color: BLUE_600,
    textDecorationLine: "underline",
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  resendDisabled: {
    opacity: 0.4,
  },

  // ── Success screen ───────────────────────────────────────────────────────
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
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: Typography.sizes.base,
    color: WHITE,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 24,
    lineHeight: 22,
  },
  emailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
    maxWidth: "90%",
  },
  emailChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_700,
  },
  successHint: {
    fontSize: Typography.sizes.sm,
    color: WHITE,
    opacity: 0.65,
  },
});
