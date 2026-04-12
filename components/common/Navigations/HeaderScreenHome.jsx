import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";
import ActiveColectionCard from "../Card/ActiveColectionCard";
import HeaderBarCard from "../Card/HeaderBarCard";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];

export default function HeaderScreenHome({
  items,
  userStorage,
  profileData,
  defaultValueName = "Vendedor",
}) {
  const firstName = userStorage?.sub?.split("@")?.[0] ?? defaultValueName;
  const lastName = profileData?.lastName ?? userStorage?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const avatarUri = profileData?.photo ?? userStorage?.photo ?? null;
  const initials = (firstName[0] ?? "V").toUpperCase();

  const router = useRouter();
  return (
    <View>
      {/* ── User header ─────────────────────────────────────────────────── */}
      <HeaderBarCard
        avatarUri={avatarUri}
        initials={initials}
        fullName={fullName}
        role={"VENDEDOR"}
      />

      <ActiveColectionCard items={items} />

      {/* ── Section header ──────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eventos Asignados</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(seller)/events")}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLink}>Ver todos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  sectionLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_500,
  },
});
