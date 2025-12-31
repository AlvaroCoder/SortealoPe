import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import LoadingScreen from '../../screens/LoadingScreen';

const DIGITS = 6;
const INITIAL_TIME = 15 * 60; 

export default function ValidateCode() {
  const { userData, validateCode, signin, loading } = useAuthContext();
    const router = useRouter();
const [code, setCode] = useState(Array(DIGITS).fill(''));
  const inputsRef = useRef([]);

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

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
    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

const handleValidate = async () => {
  const fullCode = code.join("");
    
    console.log(fullCode);
    console.log(userData);
    
  const response = await validateCode(userData.email, fullCode);

  if (response?.error) {
    return Alert.alert("Error", response.error);
  }

  const loginResponse = await signin({
    email: userData.email,
    password: userData.password,
  });

  if (loginResponse?.error) {
    return Alert.alert("Error al iniciar sesión", loginResponse.error);
  }

  router.push("(app)/(drawer)");
};

  const handleResend = () => {
    console.log("📩 Reenviando código...");
    setCode(Array(DIGITS).fill(""));
    setTimeLeft(INITIAL_TIME);
    setCanResend(false);
    inputsRef.current[0].focus();
  };

  const isComplete = code.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading && <LoadingScreen/>}
      <View style={styles.content}>
        <Text style={styles.title}>Validar Código</Text>
        
        <Text style={styles.subTitle}>
          Ingresa el código que enviamos a tu correo 📩
        </Text>
        
        <Text style={styles.emailText}>
          {userData?.email}
        </Text>

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
          <Text
            style={[
              styles.resendText,
              !canResend && styles.resendDisabled
            ]}
          >
            Reenviar código
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.principal.white,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: "100%"
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.principal.green[800],
    marginBottom: 10,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: Typography.sizes.md,
    color: Colors.principal.neutral[600],
    marginBottom: 8,
  },
  emailText: {
    fontWeight: Typography.weights.bold,
    marginBottom: 25
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    width: 50,
    height: 55,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: Typography.sizes['2xl'],
    color: Colors.principal.green[900],
    borderColor: Colors.principal.neutral[300],
    backgroundColor: 'white',
  },
  inputFilled: {
    borderColor: Colors.principal.green[500],
  },
  timerText: {
    fontSize: 16,
    fontWeight: Typography.weights.medium,
    color: Colors.principal.green[700],
    marginBottom: 25,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.principal.green[700],
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: 'white',
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  resendText: {
    color: Colors.principal.blue?.[600] || "#0066CC",
    textDecorationLine: "underline",
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium
  },
  resendDisabled: {
    opacity: 0.4,
  },
});