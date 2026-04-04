import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";

const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775246084/mascota_sortealo_triste.png";

export default function EmptyEvents() {
  return (
    <View style={styles.emptyState}>
      <Image source={URL_IMAGEN} style={{ width: 80, height: 100 }} />
      <Text style={styles.emptyTitle}>Sin eventos</Text>
      <Text style={styles.emptySubtitle}>
        No hay eventos en esta categoría.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: NEUTRAL_700,
  },
  emptySubtitle: {
    fontSize: 14,
    color: NEUTRAL_500,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
