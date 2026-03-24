import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MiniFormCreate from "../../../../../components/forms/MiniFormCreate";
import { ENDPOINTS_USERS } from "../../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../../constants/theme";
import { useAuthContext } from "../../../../../context/AuthContext";
import { useFetch } from "../../../../../lib/useFetch";

const YELLOW_50 = Colors.principal.yellow[50];
const YELLOW_600 = Colors.principal.yellow[600];
const YELLOW_700 = Colors.principal.yellow[700];

export default function Home() {
  const router = useRouter();
  const { userData: authData, accessToken } = useAuthContext();
  const [dismissed, setDismissed] = useState(false);
  console.log(accessToken);

  // Pre-load user profile to detect incomplete fields
  const { data: userData, refetch } = useFetch(
    authData?.userId ? `${ENDPOINTS_USERS.GET_BY_ID}${authData.userId}` : null,
  );

  // Re-fetch every time this screen gains focus so the banner disappears
  // immediately after the user completes their profile
  useFocusEffect(
    useCallback(() => {
      if (authData?.userId) refetch();
    }, [authData?.userId, refetch]),
  );

  // Show banner only when data has loaded, profile is incomplete, and not dismissed
  // Only firstName and lastName are required (phone is optional)
  const isProfileIncomplete =
    !dismissed &&
    userData !== null &&
    userData !== undefined &&
    (!userData?.firstName || !userData?.lastName);

  return (
    <View style={styles.container}>
      {/* Profile completion banner */}
      {isProfileIncomplete && (
        <TouchableOpacity
          style={styles.banner}
          onPress={() => router.push("/(app)/profile/complete")}
          activeOpacity={0.85}
        >
          <View style={styles.bannerIconBox}>
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={YELLOW_700}
            />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Completa tu perfil</Text>
            <Text style={styles.bannerSubtitle}>
              Agrega tu nombre completo para una mejor experiencia.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bannerClose}
            onPress={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={16} color={YELLOW_700} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>
          Crea tu primer <Text style={styles.highlight}>evento</Text>
        </Text>

        <Text style={styles.subtitle}>
          Comienza a compartir la emoción de ganar y conecta con más personas
          desde hoy.
        </Text>
      </View>

      <MiniFormCreate />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  header: {
    maxWidth: 340,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 38,
  },

  highlight: {
    color: "#0f3d2e",
  },

  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    marginBottom: 20,
  },

  // Profile completion banner
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: YELLOW_50,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.principal.yellow[200],
  },
  bannerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.principal.yellow[100],
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: YELLOW_700,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: YELLOW_600,
    lineHeight: 16,
  },
  bannerClose: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
