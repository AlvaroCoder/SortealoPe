import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Buttons/Button";
import { Colors, Typography } from "../../constants/theme";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1762043981/sortealope/Mobile-bro_zdw1nq.png";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D52941", "#E86855", "#FCD581"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: URL_IMAGEN }}
            style={styles.image}
            contentFit="contain"
            transition={1000}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Gestiona tus rifas</Text>

          <Text style={styles.subtitle}>
            Crea tus rifas y contrólalas a tan solo {"\n"} un click de distancia
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar sesión"
              onPress={() => router.push("/(auth)/login")}
              style={styles.buttonLogin}
              textStyle={styles.buttonText}
            />
            <Button
              title="Registrarse"
              onPress={() => router.push("/(auth)/register")}
              style={styles.buttonRegister}
              textStyle={styles.buttonTextRegister}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 60,
    minHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.principal.red[900],
    textAlign: "center",
    marginBottom: 10,
    fontFamily: Typography.fonts.display,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.normal,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 45,
    minHeight: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonLogin: {
    width: "100%",
  },
  buttonRegister: {
    backgroundColor: "white",
    borderColor: Colors.principal.red[500],
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginTop: 16,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  buttonTextRegister: {
    color: Colors.principal.red[500],
  },
});