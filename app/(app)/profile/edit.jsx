import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_USERS } from "../../../Connections/APIURLS";
import { UploadUserImage } from "../../../Connections/images";
import { UpdateUser } from "../../../Connections/users";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function EditProfileScreen() {
  const { userData: userStorage } = useAuthContext();
  const router = useRouter();

  // ── Remote user data ──────────────────────────────────────────────────────────
  const { data: userData, loading: loadingFetch } = useFetch(
    userStorage?.userId
      ? `${ENDPOINTS_USERS.GET_BY_ID}${userStorage.userId}`
      : null,
  );

  // ── Form state ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [saving, setSaving] = useState(false);

  // Pre-populate once data arrives
  useEffect(() => {
    if (userData) {
      setForm({
        firstName: userData.firstName ?? "",
        lastName: userData.lastName ?? "",
        phone: userData.phone ?? "",
      });
    }
  }, [userData]);

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Avatar state ──────────────────────────────────────────────────────────────
  const [avatarUri, setAvatarUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const profileImageSource = avatarUri ?? userData?.photo ?? null;

  // Initials fallback while image loads
  const initials = (() => {
    if (userData?.firstName && userData?.lastName)
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    if (userData?.username) return userData.username[0].toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "?";
  })();

  // ── Image picker ──────────────────────────────────────────────────────────────
  const launchPicker = async (useCamera) => {
    const permFn = useCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;
    const { status } = await permFn();
    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        `Necesitamos acceso a tu ${useCamera ? "cámara" : "galería"}.`,
      );
      return;
    }
    const options = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    };
    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled || !result.assets?.length) return;
    await uploadProfileImage(result.assets[0]);
  };

  const uploadProfileImage = async (asset) => {
    setUploading(true);
    try {
      const extension = asset.uri.split(".").pop() ?? "jpg";
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        type: `image/${extension}`,
        name: asset.uri.split("/").pop() ?? `avatar.${extension}`,
      });
      const res = await UploadUserImage(formData, userStorage?.userId);
      if (!res.ok) {
        Alert.alert("Error", "No se pudo actualizar la foto.");
        return;
      }
      const json = await res.json();
      if (!json?.url) {
        Alert.alert("Error", "No se recibió la URL de la imagen.");
        return;
      }
      setAvatarUri(json.url);
      Alert.alert("Listo", "Foto de perfil actualizada.");
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarPress = () => {
    if (uploading) return;
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Tomar foto", "Elegir de galería"],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) launchPicker(true);
          else if (i === 2) launchPicker(false);
        },
      );
    } else {
      Alert.alert("Foto de perfil", "Elige una opción", [
        { text: "Cancelar", style: "cancel" },
        { text: "Tomar foto", onPress: () => launchPicker(true) },
        { text: "Elegir de galería", onPress: () => launchPicker(false) },
      ]);
    }
  };

  // ── Save handler ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      };
      const res = await UpdateUser(payload);
      if (!res.ok) {
        Alert.alert("Error", "No se pudo guardar los cambios.");
        return;
      }
      Alert.alert("Listo", "Perfil actualizado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loadingFetch) return <LoadingScreen />;

  return (
    <View style={styles.root}>
      {/* ── Top header bar ─────────────────────────────────────────────────── */}
      <SafeAreaView style={styles.headerSafe} edges={["top"]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={24} color={WHITE} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar perfil</Text>

          {/* Spacer mirrors the back button to keep the title centered */}
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* ── Avatar section (still on GREEN_900 background) ─────────────────── */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarRing}
          onPress={handleAvatarPress}
          activeOpacity={0.85}
          disabled={uploading}
        >
          {profileImageSource ? (
            <Image
              source={{ uri: profileImageSource }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          {uploading && (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator size="small" color={WHITE} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color={WHITE} />
          </View>
        </TouchableOpacity>

        <Text style={styles.changePhotoHint}>Toca para cambiar foto</Text>
      </View>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Nombre */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NOMBRE</Text>
            <TextInput
              style={styles.fieldInput}
              value={form.firstName}
              onChangeText={(v) => updateForm("firstName", v)}
              placeholder="Nombre"
              placeholderTextColor={NEUTRAL_500}
              autoCapitalize="words"
            />
          </View>

          {/* Apellido */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>APELLIDO</Text>
            <TextInput
              style={styles.fieldInput}
              value={form.lastName}
              onChangeText={(v) => updateForm("lastName", v)}
              placeholder="Apellido"
              placeholderTextColor={NEUTRAL_500}
              autoCapitalize="words"
            />
          </View>

          {/* Teléfono */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>TELÉFONO</Text>
            <TextInput
              style={styles.fieldInput}
              value={form.phone}
              onChangeText={(v) => updateForm("phone", v)}
              placeholder="Número de teléfono"
              placeholderTextColor={NEUTRAL_500}
              keyboardType="phone-pad"
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          {/* Cancel text button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NEUTRAL_50 },
  flex: { flex: 1 },

  // Header
  headerSafe: { backgroundColor: GREEN_900 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: GREEN_900,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  // Mirror of backButton width to keep title visually centered
  headerSpacer: { width: 36 },

  // Avatar section
  avatarSection: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingBottom: 32,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 102, height: 102, borderRadius: 51 },
  avatarInitials: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: GREEN_900,
    borderWidth: 2,
    borderColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 500,
  },
  changePhotoHint: {
    fontSize: Typography.sizes.xs,
    color: GREEN_500,
    fontWeight: Typography.weights.medium,
  },

  // Form
  formContent: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 4,
    // Occupies full width since it's inside a flex: 1 ScrollView
    flexGrow: 1,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: NEUTRAL_50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: GREEN_900,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },

  // Buttons
  saveButton: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },
});
