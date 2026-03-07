import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/theme";

const CONFIG = {
  login: {
    question: "¿No tienes cuenta? ",
    actionText: "Regístrate",
    route: "/(auth)/register",
  },
  register: {
    question: "¿Ya tienes una cuenta? ",
    actionText: "Inicia sesión",
    route: "/(auth)/login",
  },
};

export default function TextPrevAccount({ type = "register" }) {
  const router = useRouter();
  const { question, actionText, route } = CONFIG[type] ?? CONFIG.register;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "white",
        width: "100%",
        height: 40,
        paddingVertical: 10,
      }}
    >
      <Text>{question}</Text>
      <TouchableOpacity onPress={() => router.push(route)}>
        <Text style={{ color: Colors.principal.blue[600], fontWeight: "bold" }}>
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
