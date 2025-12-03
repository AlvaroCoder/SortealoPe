import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_100 = Colors.principal.green[100];
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function MetricCard({
  label,
  value,
  icon,
  route,
  useRoute = true,
}) {
  const router = useRouter();
  if (useRoute) {
    return (
      <TouchableOpacity
        style={styles.metricCard}
        onPress={() => router.push(route)}
      >
        <View style={styles.metricIconContainer}>
          <Ionicons name={icon} size={24} color={GREEN_900} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <Ionicons name={icon} size={24} color={GREEN_900} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  metricCard: {
    width: "48%",
    backgroundColor: GREEN_100,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
  },
  metricIconContainer: {
    backgroundColor: Colors.principal.green[200],
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 2,
  },
  metricValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
});
