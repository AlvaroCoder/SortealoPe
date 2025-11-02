import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../components/common/Button";
import { Colors, Typography } from "../../constants/theme";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1762043981/sortealope/Mobile-bro_zdw1nq.png";

const GOOGLE_LOGO = "https://res.cloudinary.com/dabyqnijl/image/upload/v1732559213/sortealope/google_icon_zmkfvh.png";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    console.log('Iniciando sesión...');

  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleGoogleLogin = () => {
    console.log('Login con Google...');
  };

  const handleForgotPassword = () => {
    console.log('Olvidé mi contraseña...');

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: URL_IMAGEN }}
          contentFit="contain"
          transition={1000}
          style={styles.image}
        />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Inicia Sesión</Text>
        
        {/* Formulario de login */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput 
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor={Colors.light.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.light.textMuted}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.buttonsContainer}>
            <Button 
              title="Iniciar Sesión"
              onPress={handleLogin}
              size="large"
              variant="primary"
              style={styles.primaryButton}
            />
    
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Image
              source={{ uri: GOOGLE_LOGO }}
              style={styles.googleLogo}
              contentFit="contain"
            />
            <Text style={styles.googleButtonText}>Inicia sesión con Google</Text>
          </TouchableOpacity>

          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerLinkText}>
              ¿No tienes una cuenta? {" "}
              <Text style={styles.registerLink} onPress={handleRegister}>
                Regístrate
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: Colors.principal.red[500],
  },
  image: {
    width: "100%",
    height: 150,
  },
  header: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Typography.fonts.display,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: Typography.sizes.sm,
    color: Colors.principal.red[500],
    fontWeight: Typography.weights.medium,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    width: "100%",
  },
  secondaryButton: {
    width: "100%",
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: Typography.sizes.sm,
    color: Colors.light.textMuted,
    fontWeight: Typography.weights.medium,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  registerLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  registerLinkText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  registerLink: {
    color: Colors.principal.red[500],
    fontWeight: Typography.weights.semibold,
  },
});