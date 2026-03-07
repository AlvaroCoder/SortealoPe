import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import { Colors, Typography } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import { isValidEmail } from "../../lib/validate";
import LoadingScreen from "../../screens/LoadingScreen";

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return Alert.alert("Campo requerido", "Ingresa tu correo electrónico");
    }
    if (!isValidEmail(email)) {
      return Alert.alert(
        "Correo no válido",
        "Ingresa un correo electrónico válido"
      );
    }
    const result = await forgotPassword(email);
    if (result?.error) {
      return Alert.alert("Error", result.error);
    }
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: Constants.statusBarHeight }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {loading && <LoadingScreen />}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.principal.green[900]}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        {sent ? (
          <View style={styles.successContainer}>
            <Ionicons
              name="mail-open-outline"
              size={64}
              color={Colors.principal.green[500]}
            />
            <Text style={styles.title}>¡Correo enviado!</Text>
            <Text style={styles.subtitle}>
              Revisa tu bandeja de entrada en{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
              {"\n"}y sigue las instrucciones para recuperar tu contraseña.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Ionicons
              name="lock-open-outline"
              size={56}
              color={Colors.principal.green[700]}
              style={styles.icon}
            />
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos las instrucciones
              para restablecerla.
            </Text>
            <OutlineTextField
              title="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              type="email"
              onChangeText={setEmail}
              required
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.button, !email && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!email}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enviar instrucciones</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 16,
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    alignItems: "center",
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.principal.green[900],
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.principal.neutral[600],
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emailHighlight: {
    fontWeight: Typography.weights.bold,
    color: Colors.principal.green[700],
  },
  button: {
    width: "100%",
    backgroundColor: Colors.principal.green[700],
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: "white",
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
});
