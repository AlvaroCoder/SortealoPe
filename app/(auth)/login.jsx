import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OutlineTextField from "../../components/common/TextFields/OutlineTextField";
import TextPrevAccount from "../../components/common/Texts/TextPrevAccount";
import { useAuthContext } from "../../context/AuthContext";
import LoadingScreen from "../../screens/LoadingScreen";
import FormInitial from "../../views/Form/FormInitial";

const URL_LOGO_IMAGE =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1730493843/laztvzw7ytanqrdj161e.png";

export default function Login() {
  const router = useRouter();
  const { signin, loading } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (formData.email === "" || formData.password === "") {
      return Alert.alert(
        "Información incompleta",
        "Ingresa tus datos para continuar",
      );
    }

    if (!formData.email.includes("@")) {
      return Alert.alert(
        "Correo no válido",
        "Ingresa un correo electrónico válido",
      );
    }

    const response = await signin(formData);
    if (response?.error) {
      return Alert.alert("Error", response.error);
    }

    router.push("/(app)/(drawer)/home");
    console.log("Datos del formulario:", formData);
  };

  const updateFields = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        >
          <OutlineTextField
            title="Correo electronico"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            type="email"
            onChangeText={(text) => updateFields("email", text)}
            required={true}
            returnKeyType="next"
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title="Contraseña"
            type="password"
            value={formData.password}
            onChangeText={(text) => updateFields("password", text)}
            placeholder="Crea una contraseña segura"
            secureTextEntry={true}
            required={true}
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
  additionalComponents: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 28,
  },
  image: {
    width: 200,
    height: 80,
    marginTop: 10,
    alignSelf: "center",
  },
  containerBottom: {
    marginTop: Dimensions.get("window").height * 0.1,
    opacity: 0.5,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
