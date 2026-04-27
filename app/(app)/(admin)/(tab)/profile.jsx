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
import { ENDPOINTS_USERS } from "../../../../Connections/APIURLS";
import { UploadUserImage } from "../../../../Connections/images";
import { Colors, Typography } from "../../../../constants/theme";
import { useAuthContext } from "../../../../context/AuthContext";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const RED_100 = Colors.principal.red[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const ROLE_CONFIG = {
  badge: "ADMIN",
  label: "Administrador",
  icon: "shield-checkmark-outline",
  badgeBg: NEUTRAL_100,
  badgeText: NEUTRAL_500,
  roleBg: GREEN_500,
  roleText: GREEN_900,
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

export default function AdminProfileTab() {
  const { signout, loading, userData: userStorage } = useAuthContext();
  const router = useRouter();

  const { data: userData, loading: loadingFetch } = useFetch(
    userStorage?.userId
      ? `${ENDPOINTS_USERS.GET_BY_ID}${userStorage.userId}`
      : null,
  );

  const [avatarUri, setAvatarUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ── Derived values ─────────────────────────────────────────────────────────
  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.username || userData?.email || "Usuario";

  const initials = (() => {
    if (userData?.firstName && userData?.lastName)
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    if (userData?.username) return userData.username[0].toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "?";
  })();

  const profileImageSource = avatarUri ?? userData?.photo ?? null;

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signout();
    router.replace("/(auth)/login");
  };

  // ── Image picker ───────────────────────────────────────────────────────────
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
      formData.append("userId", String(userStorage?.userId));
      const res = await UploadUserImage(formData);
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

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading || loadingFetch) return <LoadingScreen />;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Banner ─────────────────────────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={styles.bannerCircle} />

          {/* Top bar: brand + ADMIN badge */}
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>Sortealo</Text>
            <View
              style={[
                styles.rolePill,
                { backgroundColor: ROLE_CONFIG.badgeBg },
              ]}
            >
              <Text
                style={[styles.rolePillText, { color: ROLE_CONFIG.badgeText }]}
              >
                {ROLE_CONFIG.badge}
              </Text>
            </View>
          </View>

          {/* Avatar */}
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
              <View style={styles.avatar}>
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

          <Text style={styles.displayName}>{displayName}</Text>
          {userData?.username && (
            <Text style={styles.usernameText}>@{userData.username}</Text>
          )}

          {/* Role badge */}
          <View
            style={[styles.roleBadge, { backgroundColor: ROLE_CONFIG.roleBg }]}
          >
            <Ionicons
              name={ROLE_CONFIG.icon}
              size={13}
              color={ROLE_CONFIG.roleText}
            />
            <Text
              style={[styles.roleBadgeText, { color: ROLE_CONFIG.roleText }]}
            >
              {ROLE_CONFIG.label}
            </Text>
          </View>
        </View>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <View style={styles.content}>
          <ProfileSection title="Datos personales">
            <ProfileRow
              icon="person-outline"
              label="Nombre completo"
              value={
                [userData?.firstName, userData?.lastName]
                  .filter(Boolean)
                  .join(" ") || "No registrado"
              }
            />
            <ProfileRow
              icon="call-outline"
              label="Teléfono"
              value={userData?.phone || "No registrado"}
              last
            />
          </ProfileSection>

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

          {/* Edit button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/(app)/profile/edit")}
            activeOpacity={0.8}
          >
            <View style={styles.editIconContainer}>
              <Ionicons name="create-outline" size={20} color={GREEN_900} />
            </View>
            <Text style={styles.editButtonText}>Editar perfil</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={NEUTRAL_700}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

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
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NEUTRAL_50 },
  safeTop: { backgroundColor: GREEN_900 },
  scrollContent: { paddingBottom: 40 },

  // Banner
  banner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 16,
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
    alignSelf: "stretch",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  brandText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    flex: 1,
  },
  rolePill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  rolePillText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.5,
  },

  // Avatar
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden",
  },
  avatar: {
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
  displayName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 4,
  },
  usernameText: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 10,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },

  // Content
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },

  // Section
  section: { gap: 8 },
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

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 14,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1 },
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

  // Edit button
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  editIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // Logout
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
