// app/(auth)/welcome.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { USER_ROLES } from "../../constants/roles";
import { Colors, Typography } from "../../constants/theme";
import { useAuthContext } from "../../context/AuthContext";
import { useRaffleContext } from "../../context/RaffleContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLUE_500 = Colors.principal.blue[500];
const BG_SCREEN = "#EDF2F7";
const WHITE = "#FFFFFF";

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775314294/mascotas_zlqjn5.png";

const ROLES = [
  {
    key: USER_ROLES.ADMIN,
    label: "ADMINISTRADOR",
    badge: "MASTER",
    description: "Gestiona eventos y vendedores",
    icon: "grid-outline",
    iconBg: GREEN_900,
    badgeBg: NEUTRAL_100,
    badgeText: NEUTRAL_500,
  },
  {
    key: USER_ROLES.SELLER,
    label: "VENDEDOR",
    badge: "VENTAS",
    description: "Vende y gestiona tus colecciones",
    icon: "ticket-outline",
    iconBg: BLUE_500,
    badgeBg: "#DBEAFE",
    badgeText: BLUE_500,
  },
  {
    key: USER_ROLES.BUYER,
    label: "COMPRADOR",
    badge: "PREMIUM",
    description: "Explora rifas y tus tickets",
    icon: "star-outline",
    iconBg: GREEN_500,
    badgeBg: "#D1FAE5",
    badgeText: GREEN_900,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Welcome() {
  const router = useRouter();
  const { userData } = useAuthContext();
  const { updateRole } = useRaffleContext();
  const insets = useSafeAreaInsets();

  const [selectedRole, setSelectedRole] = useState(USER_ROLES.ADMIN);

  const firstName =
    userData?.firstName ??
    userData?.name ??
    userData?.sub?.split("@")?.[0] ??
    "Usuario";

  const photoUri = userData?.photo ?? null;

  const handleContinue = async () => {
    if (!selectedRole) return;

    await updateRole(selectedRole); // guarda en AsyncStorage + actualiza contexto

    switch (selectedRole) {
      case USER_ROLES.ADMIN:
        router.replace("/(app)/(admin)");
        break;
      case USER_ROLES.SELLER:
        router.replace("/(app)/(seller)");
        break;
      case USER_ROLES.BUYER:
        router.replace("/(app)/(buyer)/(tab)/index");
        break;
      default:
        router.replace("/(app)/(admin)");
    }
  };

  return (
    // FIX: quitamos edges bottom para que el SafeAreaView no consuma
    // el espacio inferior — lo maneja el bottomBar con insets manualmente
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.helloText} numberOfLines={1}>
            ¡Hola, {firstName}!
          </Text>
        </View>
        <Text style={styles.brandText}>RifaloPe</Text>
      </View>

      {/* ── FIX: flex:1 container para que scroll + bottomBar usen el espacio correcto */}
      <View style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.heading}>
            ¿Con qué rol vas a{"\n"}operar hoy?
          </Text>
          <Text style={styles.subtitle}>
            Selecciona tu perfil para comenzar a navegar.
          </Text>

          {/* Role cards */}
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.key;
            return (
              <TouchableOpacity
                key={role.key}
                activeOpacity={0.8}
                onPress={() => setSelectedRole(role.key)}
                style={[
                  styles.roleCard,
                  isSelected ? styles.roleCardSelected : styles.roleCardDefault,
                ]}
              >
                <View
                  style={[styles.iconPill, { backgroundColor: role.iconBg }]}
                >
                  <Ionicons name={role.icon} size={28} color={WHITE} />
                </View>

                <View style={styles.roleInfo}>
                  {/* FIX: labelRow sin gap — usa marginRight en badge para Android */}
                  <View style={styles.labelRow}>
                    <Text style={styles.roleLabel}>{role.label}</Text>
                    <View
                      style={[
                        styles.badgePill,
                        { backgroundColor: role.badgeBg },
                      ]}
                    >
                      <Text
                        style={[styles.badgeText, { color: role.badgeText }]}
                      >
                        {role.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>

                {isSelected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={26}
                    color={GREEN_500}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={NEUTRAL_400}
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Mascot — FIX: burbuja con "colita" via borderRadius asimétrico */}
          <View style={styles.mascotRow}>
            <View style={styles.bubbleWrapper}>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>¡Hola! ¿Listos? 👋</Text>
              </View>
              {/* Colita de la burbuja apuntando a la mascota (derecha) */}
              <View style={styles.bubbleTail} />
            </View>
            <Image
              source={{ uri: MASCOT_URI }}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>
        </ScrollView>

        {/* ── FIX: bottomBar en flujo normal (no absolute), con insets manuales */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 20 },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE, // header se ve blanco en iOS status bar
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: {
    color: WHITE,
  },
  helloText: {
    color: NEUTRAL_700,
    flex: 1,
  },
  brandText: {
    color: GREEN_900,
    marginLeft: 12,
    flexShrink: 0,
  },

  // ── Body (scroll + bottomBar) ────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: BG_SCREEN, // fondo de la zona de contenido
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 16, // espacio natural al final del scroll
  },

  // ── Titles ───────────────────────────────────────────────────────────────
  heading: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    color: NEUTRAL_500,
    textAlign: "center",
    marginBottom: 32,
  },

  // ── Role cards ──────────────────────────────────────────────────────────
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  roleCardSelected: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: GREEN_500,
    ...Platform.select({
      ios: {
        shadowColor: GREEN_500,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  roleCardDefault: {
    backgroundColor: WHITE, // FIX: blanco en ambos estados, el borde los diferencia
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconPill: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  roleInfo: {
    flex: 1,
    gap: 4,
  },
  // FIX: sin gap en labelRow para compatibilidad Android
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  roleLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 0.5,
    marginRight: 8, // FIX: reemplaza gap
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  roleDescription: {
    color: NEUTRAL_700,
    marginTop: 2,
  },

  // ── Mascot + burbuja ─────────────────────────────────────────────────────
  mascotRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  bubbleWrapper: {
    alignItems: "flex-end",
    marginRight: 4,
    marginBottom: 30,
  },
  chatBubble: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderBottomRightRadius: 4, // FIX: asimetría para efecto "colita"
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  // FIX: triángulo CSS-style para la colita de la burbuja
  bubbleTail: {
    position: "absolute",
    bottom: -7,
    right: 12,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: "transparent",
    borderTopWidth: 8,
    borderTopColor: WHITE,
  },
  chatText: {
    color: NEUTRAL_700,
  },
  mascotImage: {
    width: 120,
    height: 120,
  },

  // ── Bottom CTA bar ───────────────────────────────────────────────────────
  bottomBar: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
  },
  continueButton: {
    backgroundColor: GREEN_500,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    color: WHITE,
    letterSpacing: 0.3,
  },
});
