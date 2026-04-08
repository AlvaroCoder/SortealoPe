import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnimationHome from "../components/cards/AnimationHome";
import Button from "../components/common/Buttons/Button";
import Title from "../components/common/Titles/Title";
import { Colors, Typography } from "../constants/theme";
import { useAuthContext } from "../context/AuthContext";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "white";
const NEUTRAL_700 = Colors.principal.neutral[700];

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.3;
const SPLASH_DURATION = 3000;

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loading: authLoading, isLogged } = useAuthContext();

  // FIX: dos flags independientes que deben cumplirse ambas
  const [timerDone, setTimerDone] = useState(false);
  const [authDone, setAuthDone] = useState(false);
  const hasNavigated = useRef(false); // evita doble navegación

  // Flag del timer
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Flag del auth — se activa cuando authLoading pasa a false
  useEffect(() => {
    if (!authLoading) setAuthDone(true);
  }, [authLoading]);

  // Solo navega cuando AMBOS están listos
  useEffect(() => {
    if (!timerDone || !authDone) return;
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (isLogged) {
      router.replace("/(auth)/welcome");
    }
    // Si no está logueado, simplemente muestra los botones (no navega)
  }, [timerDone, authDone, isLogged, router]);

  // Muestra la animación mientras cualquiera de los dos no esté listo
  const showSplash = !timerDone || !authDone;

  if (showSplash) return <AnimationHome />;

  // Si está logueado y la navegación aún no ocurrió (edge case muy raro)
  // evita mostrar la pantalla de login/register brevemente
  if (isLogged) return <AnimationHome />;

  return (
    <LinearGradient
      colors={[GREEN_900, GREEN_500, Colors.principal.green[300]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text style={{ color: WHITE }}>Powered by</Text>
            <Title styleTitle={{ color: WHITE }}>COSAI</Title>
          </View>
          <Image
            source={{ uri: URL_IMAGEN }}
            style={[styles.image, { height: IMAGE_HEIGHT }]}
            contentFit="contain"
            transition={800}
          />
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
          <Title styleTitle={styles.title}>Gestiona tus rifas</Title>

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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: { width: "100%" },
  content: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 32,
    paddingTop: 34,
    minHeight: height * 0.45,
    elevation: 6,
  },
  title: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: Typography.fonts.display,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: NEUTRAL_700,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 14,
  },
  buttonLogin: {
    width: "100%",
    backgroundColor: Colors.principal.blue[500],
    borderColor: Colors.principal.blue[700],
  },
  buttonRegister: {
    width: "100%",
    backgroundColor: WHITE,
    borderColor: GREEN_900,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonText: {
    color: WHITE,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  buttonTextRegister: {
    color: GREEN_900,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
});
