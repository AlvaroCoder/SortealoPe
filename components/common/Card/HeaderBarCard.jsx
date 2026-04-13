import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

export default function HeaderBarCard({ avatarUri, initials, fullName, role, onAvatarPress }) {
  const router = useRouter();

  return (
    <View style={styles.userHeader}>
      <TouchableOpacity
        onPress={onAvatarPress ?? (() => router.push("/(app)/(seller)/profile"))}
        activeOpacity={0.8}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.userHeaderInfo}>
        <Text style={styles.welcomeLabel}>Bienvenido,</Text>
        <View style={styles.nameRow}>
          <Text style={styles.fullName} numberOfLines={1}>
            {fullName}
          </Text>
          <View style={styles.vendedorBadge}>
            <Text style={styles.vendedorBadgeText}>{role}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bellBtn}
        onPress={() => router.push("/welcome")}
      >
        <Ionicons name="home-outline" size={22} color={GREEN_900} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── User header ─────────────────────────────────────────────────────────────
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: WHITE,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  userHeaderInfo: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.normal,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  fullName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  vendedorBadge: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  vendedorBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
});
