import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AnimationHome from "../../components/cards/AnimationHome";
import Button from "../../components/common/Buttons/Button";
import Title from "../../components/common/Titles/Title";
import { Colors, Typography } from "../../constants/theme";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <AnimationHome />;
  }

  return (
    <LinearGradient
      colors={[GREEN_900, GREEN_500, Colors.principal.green[300]]}
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
    backgroundColor: "white",
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
    textAlign: "center",
    marginBottom: 10,
    fontFamily: Typography.fonts.display,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.normal,
    color: NEUTRAL_700,
    textAlign: "center",
    marginBottom: 45,
    minHeight: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonLogin: {
    width: "100%",
    backgroundColor: Colors.principal.blue[500],
    borderColor: Colors.principal.blue[700],
  },
  buttonRegister: {
    backgroundColor: WHITE,
    borderColor: GREEN_900,
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  buttonTextRegister: {
    color: GREEN_900,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
});
