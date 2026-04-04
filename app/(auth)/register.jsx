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
import ButtonLoginGoogle from "../../components/common/Buttons/ButtonLoginGoogle";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import { Colors } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import { isStrongPassword, isValidEmail } from "../../lib/validate";
import LoadingScreen from "../../screens/LoadingScreen";
import FormInitial from "../../views/Form/FormInitial";

const URL_LOGO_IMAGE =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1730493843/laztvzw7ytanqrdj161e.png";

const HOME_ROUTE = "/(auth)/welcome";

export default function Register() {
  const router = useRouter();
  const { signUp, loading } = useAuthContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
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
    if (!isStrongPassword(formData.password)) {
      return Alert.alert(
        "Contraseña débil",
        "La contraseña debe tener mínimo 6 caracteres",
      );
    }
    const result = await signUp(formData);
    if (result?.error) {
      return Alert.alert("Error al registrar", result.error);
    }
    router.push("/(auth)/validateCode");
  };

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight }]}>
      {loading && <LoadingScreen />}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <FormInitial
          title="Registro"
          buttonText="Registrate"
          onSubmit={handleSubmit}
        >
          <OutlineTextField
            title="Nombre de usuario"
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            type="text"
            onChangeText={(text) => handleChange("username", text)}
            required
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Correo electrónico"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            type="email"
            onChangeText={(text) => handleChange("email", text)}
            required
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Contraseña"
            placeholder="Crea una contraseña segura"
            value={formData.password}
            type="password"
            onChangeText={(text) => handleChange("password", text)}
            required
            secureTextEntry
          />
        </FormInitial>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>o continúa con</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.googleContainer}>
          <ButtonLoginGoogle
            buttonText="Registrarse con Google"
            onSuccess={() => router.replace(HOME_ROUTE)}
          />
        </View>

        <TextPrevAccount type="register" />

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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.principal.neutral[200],
  },
  dividerText: {
    marginHorizontal: 12,
    color: Colors.principal.neutral[500],
    fontSize: 14,
  },
  googleContainer: {
    paddingHorizontal: 28,
    marginBottom: 8,
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
