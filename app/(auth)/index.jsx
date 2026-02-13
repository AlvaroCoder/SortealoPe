import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AnimationHome from "../../components/cards/AnimationHome";
import Button from "../../components/common/Buttons/Button";
import Title from "../../components/common/Titles/Title";
import { Colors, Typography } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = 'white';
const NEUTRAL_700 = Colors.principal.neutral[700];

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.30; 

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const { loading: loadingvalidacion, isLogged } = useAuthContext();
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || loadingvalidacion) return <AnimationHome />;

  if (isLogged) {
    return <Redirect href={"/(app)/(drawer)"} />
  }

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
            <Text style={{color : WHITE}}>Powered by</Text>
            <Title styleTitle={{ color: WHITE }}>COSAI</Title>
          </View>
          <Image
            source={{ uri: URL_IMAGEN }}
            style={[styles.image, { height: IMAGE_HEIGHT }]}
            contentFit="contain"
            transition={800}
          />
        </View>

        <View
          style={[
            styles.content,
            {
              paddingBottom: insets.bottom + 30, 
            },
          ]}
        >
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
  safeArea: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: "100%",
  },
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