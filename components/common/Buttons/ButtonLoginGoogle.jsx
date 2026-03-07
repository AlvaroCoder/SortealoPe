import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_IDS = {
  androidClientId:
    "258869415345-muaua0e6vfvd34r6j1b261g7kb01igpq.apps.googleusercontent.com",
  iosClientId:
    "258869415345-h6ct4c8dsrj15vdm9kr7lktp0f85ks4d.apps.googleusercontent.com",
  webClientId:
    "258869415345-j7m21vbdmv4ncv5pcn36cjkghh3uogmi.apps.googleusercontent.com",
};

const GOOGLE_ICON_URL =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1762924676/logo_google_zlsawc.png";

export default function ButtonLoginGoogle({
  buttonText = "Iniciar sesión con Google",
  onSuccess,
}) {
  const { signInWithGoogle } = useAuthContext();
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CLIENT_IDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response === null) return;

    if (response.type === "success") {
      handleGoogleToken(response.authentication.accessToken);
    } else {
      // cancel, dismiss o error
      if (response.type === "error") {
        Alert.alert("Error", "No se pudo iniciar sesión con Google");
      }
      setLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken) => {
    const result = await signInWithGoogle(accessToken);
    setLoading(false);
    if (result?.error) {
      return Alert.alert("Error", result.error);
    }
    onSuccess?.();
  };

  const handlePress = async () => {
    setLoading(true);
    await promptAsync();
  };

  return (
    <Pressable
      disabled={!request || loading}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed || loading ? 0.8 : 1 },
      ]}
      onPress={handlePress}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <View style={styles.content}>
          <Image source={{ uri: GOOGLE_ICON_URL }} style={styles.icon} />
          <Text style={styles.text}>{buttonText}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 22,
    height: 22,
  },
  text: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: "#333",
  },
});
