import { StyleSheet, Text, View } from "react-native";
import MiniFormCreate from "../../../../../components/forms/MiniFormCreate";

export default function Home() {
  return (
    <View style={styles.container}>
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
    paddingTop: 60,
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
    color: "#0f3d2e", // verde oscuro
  },

  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
});
