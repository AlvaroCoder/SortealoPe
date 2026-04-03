import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import { useAuthContext } from "../../context/AuthContext";
import { isValidEmail } from "../../lib/validate";
import LoadingScreen from "../../screens/LoadingScreen";
import FormInitial from "../../views/Form/FormInitial";

const URL_LOGO_IMAGE =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1730493843/laztvzw7ytanqrdj161e.png";

const HOME_ROUTE = "/(app)/(drawer)/home";

export default function Login() {
  const router = useRouter();
  const { signin, loading } = useAuthContext();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      return Alert.alert(
        "Información incompleta",
        "Ingresa tus datos para continuar",
      );
    }
    if (!isValidEmail(formData.email)) {
      return Alert.alert(
        "Correo no válido",
        "Ingresa un correo electrónico válido",
      );
    }
    console.log("Data form data : ", formData);

    const result = await signin(formData);
    if (result?.error) {
      return Alert.alert("Error", result.error);
    }
    router.replace(HOME_ROUTE);
  };

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight }]}>
      {loading && <LoadingScreen />}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <FormInitial
          title="Inicio de Sesión"
          buttonText="Iniciar Sesión"
          onSubmit={handleSubmit}
          onForgotPassword={() => router.push("/(auth)/forgot-password")}
        >
          <OutlineTextField
            title="Correo electrónico"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            type="email"
            onChangeText={(text) => updateField("email", text)}
            required
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Contraseña"
            type="password"
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            required
          />
        </FormInitial>

        <TextPrevAccount type="login" />

        <View style={styles.containerBottom}>
          <Text>Powered By </Text>
          <Image
            source={{ uri: URL_LOGO_IMAGE }}
            style={styles.image}
            contentFit="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 80,
    marginTop: 10,
    alignSelf: "center",
  },
  containerBottom: {
    marginTop: Dimensions.get("window").height * 0.05,
    opacity: 0.5,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
