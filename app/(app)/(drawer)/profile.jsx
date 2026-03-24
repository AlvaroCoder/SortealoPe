import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_USERS } from "../../../Connections/APIURLS";
import { UploadUserImage } from "../../../Connections/images";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useRaffleContext } from "../../../context/RaffleContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const RED_100 = Colors.principal.red[100];
const BLUE_500 = Colors.principal.blue[500];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const ROLE_CONFIG = {
  Administrador: {
    bg: GREEN_500,
    text: GREEN_900,
    icon: "shield-checkmark-outline",
  },
  Vendedor: { bg: BLUE_500, text: WHITE, icon: "storefront-outline" },
  Comprador: { bg: NEUTRAL_700, text: WHITE, icon: "bag-handle-outline" },
};

function ProfileSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ProfileRow({ icon, label, value, last = false }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIconContainer}>
        <Ionicons name={icon} size={18} color={GREEN_900} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function Perfil() {
  const USER_URL = ENDPOINTS_USERS.GET_BY_ID;

  const { userRole } = useRaffleContext();
  const { signout, loading, userData: userStorage } = useAuthContext();
  const router = useRouter();

  const { data: userData, loading: loadingFetch } = useFetch(
    userStorage?.userId ? `${USER_URL}${userStorage.userId}` : null,
  );

  // Local avatar URI — overrides the server value after a successful upload
  const [avatarUri, setAvatarUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.username || userData?.email || "Usuario";

  const initials = (() => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    if (userData?.username) return userData.username[0].toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "?";
  })();

  // El campo de foto en UserDto es "photo" (Cloudinary URL)
  const profileImageSource = avatarUri ?? userData?.photo ?? null;

  const roleConfig = ROLE_CONFIG[userRole] ?? ROLE_CONFIG.Comprador;

  const handleLogout = async () => {
    await signout();
    router.replace("/(auth)/login");
  };

  // ── Image picker helpers ──────────────────────────────────────────────────

  const launchPicker = async (useCamera) => {
    // Request the appropriate permission
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Necesitamos acceso a tu cámara para tomar una foto.",
        );
        return;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Necesitamos acceso a tu galería para seleccionar una foto.",
        );
        return;
      }
    }

    const pickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop for avatars
      quality: 0.85,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    await uploadProfileImage(asset);
  };

  const uploadProfileImage = async (asset) => {
    setUploading(true);
    try {
      const extension = asset.uri.split(".").pop() ?? "jpg";
      const formData = new FormData();
      // POST /images/user requiere "file" + "userId"
      formData.append("file", {
        uri: asset.uri,
        type: `image/${extension}`,
        name: asset.uri.split("/").pop() ?? `avatar.${extension}`,
      });
      formData.append("userId", String(userStorage?.userId));

      // Una sola llamada: sube la imagen Y actualiza user.photo en el backend
      const res = await UploadUserImage(formData);
      if (!res.ok) {
        Alert.alert("Error", "No se pudo actualizar la foto. Intenta de nuevo.");
        return;
      }

      const resJson = await res.json();
      const imageUrl = resJson?.url;

      if (!imageUrl) {
        Alert.alert("Error", "No se recibió la URL de la imagen.");
        return;
      }

      setAvatarUri(imageUrl);
      Alert.alert("Listo", "Foto de perfil actualizada.");
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarPress = () => {
    if (uploading) return;

    if (Platform.OS === "ios") {
      // Native action sheet on iOS
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Tomar foto", "Elegir de galería"],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) launchPicker(true);
          else if (index === 2) launchPicker(false);
        },
      );
    } else {
      // Cross-platform Alert-based picker on Android
      Alert.alert("Foto de perfil", "Elige una opción", [
        { text: "Cancelar", style: "cancel" },
        { text: "Tomar foto", onPress: () => launchPicker(true) },
        { text: "Elegir de galería", onPress: () => launchPicker(false) },
      ]);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  if (loading || loadingFetch) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header banner ───────────────────────────────── */}
        <View style={styles.banner}>
          {/* Decorative circle */}
          <View style={styles.bannerCircle} />

          {/* Tappable avatar with camera badge */}
          <TouchableOpacity
            style={styles.avatarRing}
            onPress={handleAvatarPress}
            activeOpacity={0.85}
            disabled={uploading}
          >
            {/* Photo or initials */}
            {profileImageSource ? (
              <Image
                source={{ uri: profileImageSource }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}

            {/* Uploading spinner overlay */}
            {uploading && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator size="small" color={WHITE} />
              </View>
            )}

            {/* Camera badge — bottom-right corner of the ring */}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={12} color={WHITE} />
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{displayName}</Text>

          {userData?.username && userData?.username !== displayName && (
            <Text style={styles.username}>@{userData.username}</Text>
          )}

          <View style={[styles.roleBadge, { backgroundColor: roleConfig.bg }]}>
            <Ionicons
              name={roleConfig.icon}
              size={13}
              color={roleConfig.text}
            />
            <Text style={[styles.roleBadgeText, { color: roleConfig.text }]}>
              {userRole}
            </Text>
          </View>
        </View>

        {/* ── Content cards ────────────────────────────────── */}
        <View style={styles.content}>
          {/* Personal info */}
          <ProfileSection title="Datos personales">
            {(userData?.firstName || userData?.lastName) && (
              <ProfileRow
                icon="person-outline"
                label="Nombre completo"
                value={`${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim()}
              />
            )}
            <ProfileRow
              icon="call-outline"
              label="Teléfono"
              value={userData?.phone || "No registrado"}
              last
            />
          </ProfileSection>

          {/* Account info */}
          <ProfileSection title="Cuenta">
            {userData?.username && (
              <ProfileRow
                icon="at-outline"
                label="Usuario"
                value={`@${userData.username}`}
              />
            )}
            <ProfileRow
              icon="mail-outline"
              label="Correo electrónico"
              value={userData?.email || "—"}
              last
            />
          </ProfileSection>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={20} color={RED_500} />
            </View>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={RED_500}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Banner ──────────────────────────────────────────────
  banner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 36,
    overflow: "hidden",
  },
  bannerCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: GREEN_700,
    opacity: 0.25,
    top: -80,
    right: -60,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    // Needed so the camera badge and overlay clip correctly
    overflow: "hidden",
  },
  avatar: {
    width: 102, // fills the ring (108 - 2*3 border)
    height: 102,
    borderRadius: 51,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 102,
    height: 102,
    borderRadius: 51,
  },
  avatarInitials: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },
  // Semi-transparent overlay shown while uploading
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  // Small camera icon badge at the bottom-right of the avatar ring
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

  displayName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 4,
  },
  username: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },

  // ── Content area ────────────────────────────────────────
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },

  // ── Section ─────────────────────────────────────────────
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Row ─────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 14,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Logout ──────────────────────────────────────────────
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: RED_100,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: RED_100,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: RED_500,
  },
});
